import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import COLORS from "../../constants/colors";

const notifications = [
  {
    id: "1",
    icon: "trophy-outline",
    title: "GNMA Voting is Open",
    message:
      "Voting is now open. Support your favourite nominees and make your vote count.",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: "2",
    icon: "wallet-outline",
    title: "Wallet Funded",
    message:
      "Your wallet has been successfully credited with GH₵50.00.",
    time: "Yesterday",
    unread: true,
  },
  {
    id: "3",
    icon: "checkmark-circle-outline",
    title: "Vote Successful",
    message:
      "Your 10 votes for King Paluta have been successfully recorded.",
    time: "2 days ago",
    unread: false,
  },
  {
    id: "4",
    icon: "calendar-outline",
    title: "GNMA Awards Night",
    message:
      "The 2027 GNMA Awards ceremony is scheduled for 20 December 2027.",
    time: "3 days ago",
    unread: false,
  },
];

export default function NotificationsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color={COLORS.white}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Notifications
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topRow}>
          <View>
            <Text style={styles.title}>
              Updates
            </Text>

            <Text style={styles.subtitle}>
              Stay up to date with GNMA.
            </Text>
          </View>

          <TouchableOpacity>
            <Text style={styles.markRead}>
              Mark all read
            </Text>
          </TouchableOpacity>
        </View>

        {notifications.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.8}
            style={[
              styles.card,
              item.unread && styles.unreadCard,
            ]}
          >
            <View style={styles.icon}>
              <Ionicons
                name={item.icon}
                size={21}
                color={COLORS.gold}
              />
            </View>

            <View style={styles.info}>
              <View style={styles.titleRow}>
                <Text style={styles.notificationTitle}>
                  {item.title}
                </Text>

                {item.unread && (
                  <View style={styles.unreadDot} />
                )}
              </View>

              <Text style={styles.message}>
                {item.message}
              </Text>

              <Text style={styles.time}>
                {item.time}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.emptySpace}>
          <Ionicons
            name="notifications-off-outline"
            size={35}
            color={COLORS.muted}
          />

          <Text style={styles.endText}>
            You're all caught up
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    height: 100,
    paddingHorizontal: 20,
    paddingTop: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "900",
  },

  headerSpacer: {
    width: 42,
  },

  content: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 50,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  title: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "900",
  },

  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 4,
  },

  markRead: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: "800",
  },

  card: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 17,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
  },

  unreadCard: {
    borderColor: COLORS.goldDark,
  },

  icon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: "#241C0D",
    alignItems: "center",
    justifyContent: "center",
  },

  info: {
    flex: 1,
    marginLeft: 12,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  notificationTitle: {
    flex: 1,
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "800",
  },

  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.gold,
    marginLeft: 8,
  },

  message: {
    color: COLORS.textSecondary,
    fontSize: 10,
    lineHeight: 16,
    marginTop: 5,
  },

  time: {
    color: COLORS.muted,
    fontSize: 9,
    marginTop: 7,
  },

  emptySpace: {
    alignItems: "center",
    marginTop: 35,
    paddingBottom: 30,
  },

  endText: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 8,
  },
});