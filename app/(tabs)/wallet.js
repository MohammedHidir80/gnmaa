import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { usePaystack } from "react-native-paystack-webview";
import { Ionicons } from "@expo/vector-icons";

import COLORS from "../../constants/colors";
import { useAuth } from "../../context/AuthContext";
// 1. Import the transactions subscription
import { 
  subscribeToWallet, 
  subscribeToWalletTransactions, 
  creditWalletAfterDemoPayment 
} from "../../services/walletService";

export default function WalletScreen() {
  const { user } = useAuth();

  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // 2. Add state for transactions
  const [transactions, setTransactions] = useState([]);
  const [loadingTx, setLoadingTx] = useState(true);

  const { popup } = usePaystack();
  const [depositAmount, setDepositAmount] = useState("10");
  const [depositing, setDepositing] = useState(false);

  const startDeposit = async () => {
    // ... (keep your existing startDeposit logic exactly as it is)
    const amount = Number(depositAmount);

    if (!user?.uid || !user?.email) {
      Alert.alert(
        "Account required",
        "Please sign in with an account that has an email address."
      );
      return;
    }

    if (!Number.isFinite(amount) || amount < 1) {
      Alert.alert("Invalid amount", "Enter at least GH₵1.");
      return;
    }

    if (!process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY) {
      Alert.alert(
        "Missing Paystack key",
        "Add your public test key to the .env file and restart Expo."
      );
      return;
    }

    setDepositing(true);

    try {
      const reference = `GNMA_${user.uid}_${Date.now()}`;

      popup.checkout({
        email: user.email,
        amount,
        reference,
        metadata: {
          userId: user.uid,
          purpose: "wallet_funding",
        },
        onSuccess: async (response) => {
          try {
            await creditWalletAfterDemoPayment(
              user.uid,
              amount,
              reference
            );

            Alert.alert(
              "Deposit successful",
              `GH₵${amount.toFixed(2)} has been added to your demo wallet.`
            );
          } catch (error) {
            console.error("DEMO WALLET CREDIT ERROR:", error);
            Alert.alert(
              "Wallet update failed",
              "Checkout returned success, but the wallet could not be updated. Check Firestore rules and try again."
            );
          } finally {
            setDepositing(false);
          }
        },
        onCancel: () => {
          setDepositing(false);
          Alert.alert("Payment cancelled", "No deposit was added.");
        },
        onError: (error) => {
          console.error("PAYSTACK CHECKOUT ERROR:", error);
          setDepositing(false);
          Alert.alert("Checkout error", "Paystack checkout could not complete.");
        },
      });
    } catch (error) {
      console.error("DEPOSIT ERROR:", error);
      setDepositing(false);
      Alert.alert("Deposit error", error.message || "Please try again.");
    }
  };

  // Existing Wallet Subscription
  useEffect(() => {
    if (!user?.uid) {
      setWallet(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = subscribeToWallet(
      user.uid,
      (walletData) => {
        setWallet(walletData);
        setLoading(false);
      },
      (error) => {
        console.error("WALLET ERROR:", error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user?.uid]);

  // 3. Add Transactions Subscription
  useEffect(() => {
    if (!user?.uid) {
      setTransactions([]);
      setLoadingTx(false);
      return;
    }

    setLoadingTx(true);
    const unsubscribe = subscribeToWalletTransactions(
      user.uid,
      (txData) => {
        setTransactions(txData);
        setLoadingTx(false);
      },
      (error) => {
        console.error("TRANSACTIONS ERROR:", error);
        setLoadingTx(false);
      }
    );

    return unsubscribe;
  }, [user?.uid]);

  const balance = Number(wallet?.balance || 0);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>My Wallet</Text>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.label}>AVAILABLE BALANCE</Text>

          {loading ? (
            <View style={styles.balanceLoading}>
              <ActivityIndicator size="small" color={COLORS.gold} />
            </View>
          ) : (
            <Text style={styles.balance}>GH₵{balance.toFixed(2)}</Text>
          )}

          <Text style={styles.depositLabel}>Deposit amount</Text>

          <View style={styles.depositInputContainer}>
            <Text style={styles.currencySymbol}>GH₵</Text>
            <TextInput
              style={styles.depositInput}
              value={depositAmount}
              onChangeText={setDepositAmount}
              keyboardType="decimal-pad"
              placeholder="Enter amount"
              placeholderTextColor={COLORS.textSecondary}
              editable={!depositing}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.fundButton,
              depositing && { opacity: 0.65 },
            ]}
            activeOpacity={0.8}
            onPress={startDeposit}
            disabled={depositing}
          >
            {depositing ? (
              <ActivityIndicator color={COLORS.black} />
            ) : (
              <>
                <Ionicons name="add" size={19} color={COLORS.black} />
                <Text style={styles.fundText}>Fund Wallet</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Transactions */}
        <Text style={styles.sectionTitle}>Recent Transactions</Text>

        {/* 4. Dynamically Render Transactions */}
        {loadingTx ? (
          <ActivityIndicator color={COLORS.gold} style={{ marginTop: 20 }} />
        ) : transactions.length === 0 ? (
          <Text style={styles.emptyText}>No recent transactions.</Text>
        ) : (
          transactions.map((tx) => {
            // Determine if it's a deposit or withdrawal based on your DB 'type' field
            const isPositive = tx.type === "deposit";
            
            // Format the amount based on type
            const amountPrefix = isPositive ? "+ " : "- ";
            const formattedAmount = `${amountPrefix}GH₵${Number(tx.amount).toFixed(2)}`;
            
            // Choose an icon based on the transaction type
            const icon = isPositive ? "add-circle" : "ticket-outline";

            return (
              <Transaction
                key={tx.id}
                icon={icon}
                title={tx.title || "Transaction"}
                amount={formattedAmount}
                positive={isPositive}
              />
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

// Keep your Transaction component exactly as it is
function Transaction({ icon, title, amount, positive }) {
  return (
    <View style={styles.transaction}>
      <View style={styles.transactionIcon}>
        <Ionicons name={icon} size={20} color={COLORS.gold} />
      </View>

      <Text style={styles.transactionTitle}>{title}</Text>

      <Text style={[styles.amount, positive && styles.positive]}>
        {amount}
      </Text>
    </View>
  );
}

// Add 'emptyText' to your styles
const styles = StyleSheet.create({
  // ... keep all your existing styles ...
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 20, paddingTop: 60, paddingBottom: 110 },
  title: { color: COLORS.white, fontSize: 30, fontWeight: "900", marginBottom: 20 },
  balanceCard: { borderRadius: 22, padding: 22, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.goldDark },
  label: { color: COLORS.textSecondary, fontSize: 10, fontWeight: "700", letterSpacing: 1 },
  balance: { color: COLORS.goldLight, fontSize: 36, fontWeight: "900", marginTop: 7 },
  balanceLoading: { height: 51, justifyContent: "center", alignItems: "flex-start" },
  fundButton: { height: 46, borderRadius: 23, backgroundColor: COLORS.gold, flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 20, gap: 7 },
  fundText: { color: COLORS.black, fontSize: 13, fontWeight: "900" },
  sectionTitle: { color: COLORS.white, fontSize: 18, fontWeight: "800", marginTop: 30, marginBottom: 13 },
  transaction: { minHeight: 65, backgroundColor: COLORS.surface, borderRadius: 15, marginBottom: 9, padding: 12, flexDirection: "row", alignItems: "center" },
  transactionIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: "#241C0D", alignItems: "center", justifyContent: "center" },
  transactionTitle: { flex: 1, color: COLORS.white, fontSize: 12, fontWeight: "600", marginLeft: 11 },
  amount: { color: COLORS.danger, fontSize: 12, fontWeight: "800" },
  positive: { color: COLORS.success },
  depositLabel: { color: COLORS.textSecondary, fontSize: 12, fontWeight: "700", marginTop: 20, marginBottom: 8 },
  depositInputContainer: { height: 48, borderWidth: 1, borderColor: COLORS.goldDark, borderRadius: 12, paddingHorizontal: 14, flexDirection: "row", alignItems: "center" },
  currencySymbol: { color: COLORS.goldLight, fontSize: 15, fontWeight: "800" },
  depositInput: { flex: 1, marginLeft: 10, color: COLORS.white, fontSize: 16, paddingVertical: 8 },
  
  // New style for empty state
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic",
  }
});