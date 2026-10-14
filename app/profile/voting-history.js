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

const history = [
  {
    id: "1",
    nominee: "King Paluta",
    category: "Overall Artiste of the Year",
    votes: 10,
    amount: 10,
    date: "18 Sep 2026",
    time: "07:15 AM",
  },
  {
    id: "2",
    nominee: "Diana Hamilton",
    category: "Gospel Artiste of the Year",
    votes: 5,
    amount: 5,
    date: "16 Sep 2026",
    time: "08:42 PM",
  },
  {
    id: "3",
    nominee: "Maccasio",
    category: "Overall Artiste of the Year",
    votes: 3,
    amount: 3,
    date: "14 Sep 2026",
    time: "11:20 AM",
  },
];

export default function VotingHistoryScreen() {
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
          Voting History
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summary}>
          <View style={styles.summaryIcon}>
            <Ionicons
              name="ticket-outline"
              size={25}
              color={COLORS.gold}
            />
          </View>

          <View>
            <Text style={styles.summaryLabel}>
              TOTAL VOTES
            </Text>

            <Text style={styles.summaryValue}>
              {history.reduce(
                (total, item) => total + item.votes,
                0
              )}
            </Text>
          </View>

          <View style={styles.summaryDivider} />

          <View>
            <Text style={styles.summaryLabel}>
              TOTAL SPENT
            </Text>

            <Text style={styles.summaryValue}>
              GH₵
              {history
                .reduce(
                  (total, item) =>
                    total + item.amount,
                  0
                )
                .toFixed(2)}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          Recent Votes
        </Text>

        {history.map((item) => (
          <View
            key={item.id}
            style={styles.card}
          >
            <View style={styles.voteIcon}>
              <Ionicons
                name="checkmark-circle"
                size={24}
                color={COLORS.gold}
              />
            </View>

            <View style={styles.info}>
              <Text style={styles.nominee}>
                {item.nominee}
              </Text>

              <Text style={styles.category}>
                {item.category}
              </Text>

              <Text style={styles.date}>
                {item.date} • {item.time}
              </Text>
            </View>

            <View style={styles.amount}>
              <Text style={styles.votes}>
                {item.votes}
              </Text>

              <Text style={styles.voteLabel}>
                votes
              </Text>

              <Text style={styles.price}>
                GH₵{item.amount}
              </Text>
            </View>
          </View>
        ))}

        <View style={styles.notice}>
          <Ionicons
            name="information-circle-outline"
            size={19}
            color={COLORS.gold}
          />

          <Text style={styles.noticeText}>
            Each vote costs GH₵1. Your voting history
            records all successful votes made from your
            account.
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

  summary: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
  },

  summaryIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: "#241C0D",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  summaryLabel: {
    color: COLORS.muted,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
  },

  summaryValue: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "900",
    marginTop: 4,
  },

  summaryDivider: {
    width: 1,
    height: 35,
    backgroundColor: COLORS.border,
    marginHorizontal: 17,
  },

  sectionTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "900",
    marginTop: 28,
    marginBottom: 12,
  },

  card: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 17,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  voteIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#241C0D",
    alignItems: "center",
    justifyContent: "center",
  },

  info: {
    flex: 1,
    marginLeft: 12,
  },

  nominee: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "800",
  },

  category: {
    color: COLORS.textSecondary,
    fontSize: 10,
    marginTop: 4,
  },

  date: {
    color: COLORS.muted,
    fontSize: 9,
    marginTop: 6,
  },

  amount: {
    alignItems: "flex-end",
  },

  votes: {
    color: COLORS.gold,
    fontSize: 15,
    fontWeight: "900",
  },

  voteLabel: {
    color: COLORS.muted,
    fontSize: 8,
  },

  price: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: "700",
    marginTop: 5,
  },

  notice: {
    flexDirection: "row",
    backgroundColor: "#18140D",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 15,
    padding: 14,
    marginTop: 12,
  },

  noticeText: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: 10,
    lineHeight: 16,
    marginLeft: 9,
  },
});