import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import COLORS from "../../constants/colors";
import { logoutUser } from "../../services/userService";

export default function ProfileScreen() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
  Alert.alert(
    "Logout",
    "Are you sure you want to logout?",
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            setLoggingOut(true);

            await logoutUser();

            Alert.alert(
              "Logged Out",
              "You have been successfully logged out."
            );
          } catch (error) {
            console.error("LOGOUT ERROR:", error);

            Alert.alert(
              "Logout Failed",
              "Something went wrong while logging out."
            );
          } finally {
            setLoggingOut(false);
          }
        },
      },
    ]
  );
};

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatar}>
          <Ionicons
            name="person"
            size={35}
            color={COLORS.gold}
          />
        </View>

        <Text style={styles.name}>
          GNMA Voter
        </Text>

        <Text style={styles.email}>
          Welcome to GNMA
        </Text>

        <View style={styles.menu}>
          <MenuItem
            icon="wallet-outline"
            title="My Wallet"
            onPress={() => router.push("/wallet")}
          />

          <MenuItem
            icon="ticket-outline"
            title="Voting History"
            onPress={() =>
              router.push("/profile/voting-history")
            }
          />

          <MenuItem
            icon="notifications-outline"
            title="Notifications"
            onPress={() =>
              router.push("/profile/notifications")
            }
          />

          <MenuItem
            icon="settings-outline"
            title="Settings"
          />

          <MenuItem
            icon="moon-outline"
            title="Appearance"
          />
        </View>

        <TouchableOpacity
          style={[
            styles.logoutButton,
            loggingOut && styles.logoutButtonDisabled,
          ]}
          activeOpacity={0.8}
          onPress={handleLogout}
          disabled={loggingOut}
        >
          {loggingOut ? (
            <ActivityIndicator
              size="small"
              color="#EF4444"
            />
          ) : (
            <Ionicons
              name="log-out-outline"
              size={21}
              color="#EF4444"
            />
          )}

          <Text style={styles.logoutText}>
            {loggingOut ? "Logging out..." : "Logout"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function MenuItem({
  icon,
  title,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={styles.menuItem}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Ionicons
        name={icon}
        size={22}
        color={COLORS.gold}
      />

      <Text style={styles.menuText}>
        {title}
      </Text>

      <Ionicons
        name="chevron-forward"
        size={18}
        color={COLORS.muted}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    padding: 20,
    paddingTop: 65,
    paddingBottom: 110,
    alignItems: "center",
  },

  avatar: {
    width: 85,
    height: 85,
    borderRadius: 43,
    backgroundColor: "#241C0D",
    borderWidth: 1,
    borderColor: COLORS.goldDark,
    alignItems: "center",
    justifyContent: "center",
  },

  name: {
    color: COLORS.white,
    fontSize: 21,
    fontWeight: "900",
    marginTop: 13,
  },

  email: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },

  menu: {
    width: "100%",
    marginTop: 35,
  },

  menuItem: {
    height: 62,
    backgroundColor: COLORS.surface,
    borderRadius: 15,
    marginBottom: 9,
    paddingHorizontal: 17,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  menuText: {
    flex: 1,
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 13,
  },

  logoutButton: {
    width: "100%",
    height: 58,
    borderRadius: 15,
    marginTop: 18,
    borderWidth: 1,
    borderColor: "#4A2525",
    backgroundColor: "#211111",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  logoutButtonDisabled: {
    opacity: 0.7,
  },

  logoutText: {
    color: "#EF4444",
    fontSize: 13,
    fontWeight: "800",
    marginLeft: 9,
  },
});