import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../../constants/colors";

export default function HomeHeader() {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.logo}>GNMA</Text>

        <Text style={styles.subtitle}>
          GHANA NORTHERN MUSIC AWARDS
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.wallet}>
          <Ionicons
            name="wallet-outline"
            size={19}
            color={COLORS.gold}
          />

          <View>
            <Text style={styles.walletLabel}>
              Wallet
            </Text>

            <Text style={styles.balance}>
              GH₵25.00
            </Text>
          </View>

          <View style={styles.add}>
            <Ionicons
              name="add"
              size={18}
              color={COLORS.black}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.notification}>
          <Ionicons
            name="notifications-outline"
            size={23}
            color={COLORS.white}
          />

          <View style={styles.dot} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 18,
    backgroundColor: COLORS.background,
  },

  logo: {
    color: COLORS.gold,
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: -2,
  },

  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 7,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginTop: -2,
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  wallet: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.goldDark,
    borderRadius: 14,
    paddingHorizontal: 9,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  walletLabel: {
    color: COLORS.muted,
    fontSize: 9,
  },

  balance: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "800",
  },

  add: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.gold,
    alignItems: "center",
    justifyContent: "center",
  },

  notification: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  dot: {
    position: "absolute",
    right: 10,
    top: 9,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.danger,
  },
});