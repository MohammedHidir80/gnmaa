
import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "./firebase";

// Listen for changes to wallets/{uid}
export function subscribeToWallet(uid, callback, onError) {
  if (!uid) {
    return () => {};
  }

  const walletRef = doc(db, "wallets", uid);

  return onSnapshot(
    walletRef,
    (snapshot) => {
      callback(
        snapshot.exists()
          ? { id: snapshot.id, ...snapshot.data() }
          : null
      );
    },
    (error) => {
      console.error("WALLET SNAPSHOT ERROR:", error);
      onError?.(error);
    }
  );
}

// Listen for the latest transactions under wallets/{uid}/transactions
export function subscribeToWalletTransactions(uid, callback, onError) {
  if (!uid) {
    callback([]);
    return () => {};
  }

  const transactionsQuery = query(
    collection(db, "wallets", uid, "transactions"),
    orderBy("createdAt", "desc"),
    limit(20)
  );

  return onSnapshot(
    transactionsQuery,
    (snapshot) => {
      callback(
        snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }))
      );
    },
    (error) => {
      console.error("TRANSACTIONS SNAPSHOT ERROR:", error);
      onError?.(error);
    }
  );
}

// DEMO ONLY: credits the wallet after the demo payment flow reports success.
// Do not use this client-side crediting method for production payments.
export async function creditWalletAfterDemoPayment(
  uid,
  amount,
  paymentReference
) {
  if (!uid) {
    throw new Error("You must be logged in to fund your wallet.");
  }

  const depositAmount = Number(amount);

  if (!Number.isFinite(depositAmount) || depositAmount < 1) {
    throw new Error("Enter a valid deposit amount of at least GH₵1.");
  }

  const reference =
    String(paymentReference || `DEMO-${Date.now()}`)
      .replace(/[^a-zA-Z0-9_-]/g, "_");

  const walletRef = doc(db, "wallets", uid);
  const transactionRef = doc(
    db,
    "wallets",
    uid,
    "transactions",
    reference
  );

  return runTransaction(db, async (transaction) => {
    // Read both documents before writing.
    const walletSnapshot = await transaction.get(walletRef);
    const existingTransaction = await transaction.get(transactionRef);

    if (existingTransaction.exists()) {
      return {
        alreadyProcessed: true,
        balance: Number(walletSnapshot.data()?.balance || 0),
      };
    }

    if (!walletSnapshot.exists()) {
      throw new Error("Your wallet was not found.");
    }

    const currentBalance = Number(
      walletSnapshot.data().balance || 0
    );
    const newBalance = currentBalance + depositAmount;

    transaction.update(walletRef, {
      balance: newBalance,
      updatedAt: serverTimestamp(),
    });

    transaction.set(transactionRef, {
      type: "deposit",
      title: "Wallet Funding",
      amount: depositAmount,
      currency: "GHS",
      status: "success",
      provider: "paystack-demo",
      reference,
      createdAt: serverTimestamp(),
    });

    return {
      alreadyProcessed: false,
      balance: newBalance,
    };
  });
}
