import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import COLORS from "../../constants/colors";
import { categories, nominees } from "../../constants/data";

export default function LeaderboardScreen() {
  const [selectedCategory, setSelectedCategory] = useState(
    categories[0]?.title || ""
  );

  const [liveNominees, setLiveNominees] = useState(nominees);

  // Keeps track of each nominee's previous position
  const previousRanks = useRef({});

  // Current movement direction
  const [movements, setMovements] = useState({});

  /*
   * Get nominees belonging to the selected category
   * and sort them by votes.
   */
  const leaderboard = useMemo(() => {
    return liveNominees
      .filter(
        (item) => item.category === selectedCategory
      )
      .sort((a, b) => b.votes - a.votes);
  }, [liveNominees, selectedCategory]);

  /*
   * Simulate incoming votes.
   *
   * This is only for the frontend prototype.
   * Later this can be replaced with real backend/Firebase
   * vote updates.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveNominees((currentNominees) => {
        return currentNominees.map((nominee) => {
          if (nominee.category !== selectedCategory) {
            return nominee;
          }

          // Random number of incoming votes
          const incomingVotes =
            Math.floor(Math.random() * 8) + 1;

          return {
            ...nominee,
            votes: nominee.votes + incomingVotes,
          };
        });
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedCategory]);

  /*
   * Detect position changes.
   */
  useEffect(() => {
    const newMovements = {};

    leaderboard.forEach((nominee, index) => {
      const currentRank = index + 1;
      const previousRank =
        previousRanks.current[nominee.id];

      if (previousRank !== undefined) {
        if (currentRank < previousRank) {
          newMovements[nominee.id] = "up";
        } else if (currentRank > previousRank) {
          newMovements[nominee.id] = "down";
        } else {
          newMovements[nominee.id] = "same";
        }
      } else {
        newMovements[nominee.id] = "same";
      }

      previousRanks.current[nominee.id] = currentRank;
    });

    setMovements(newMovements);
  }, [leaderboard]);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.eyebrow}>
          LIVE VOTING
        </Text>

        <Text style={styles.title}>
          Leaderboard
        </Text>

        <Text style={styles.subtitle}>
          Watch the standings change as votes come in.
        </Text>

        {/* Live indicator */}
        <View style={styles.liveStatus}>
          <View style={styles.liveDot} />

          <Text style={styles.liveText}>
            LIVE • Updating automatically
          </Text>
        </View>

        {/* Category selector */}
        <Text style={styles.filterLabel}>
          SELECT CATEGORY
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
        >
          {categories.map((category) => {
            const isSelected =
              selectedCategory === category.title;

            return (
              <TouchableOpacity
                key={category.id}
                activeOpacity={0.8}
                style={[
                  styles.filterButton,
                  isSelected &&
                    styles.filterButtonActive,
                ]}
                onPress={() =>
                  setSelectedCategory(category.title)
                }
              >
                <Ionicons
                  name={category.icon}
                  size={16}
                  color={
                    isSelected
                      ? COLORS.black
                      : COLORS.gold
                  }
                />

                <Text
                  style={[
                    styles.filterText,
                    isSelected &&
                      styles.filterTextActive,
                  ]}
                >
                  {category.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Current category */}
        <View style={styles.categoryHeader}>
          <View style={styles.categoryHeaderIcon}>
            <Ionicons
              name={
                categories.find(
                  (item) =>
                    item.title === selectedCategory
                )?.icon || "trophy-outline"
              }
              size={22}
              color={COLORS.gold}
            />
          </View>

          <View style={styles.categoryHeaderInfo}>
            <Text style={styles.categoryLabel}>
              CURRENT CATEGORY
            </Text>

            <Text style={styles.categoryTitle}>
              {selectedCategory}
            </Text>
          </View>
        </View>

        {/* Leaderboard */}
        {leaderboard.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="trophy-outline"
              size={45}
              color={COLORS.muted}
            />

            <Text style={styles.emptyTitle}>
              No nominees yet
            </Text>

            <Text style={styles.emptyText}>
              There are currently no nominees in this
              category.
            </Text>
          </View>
        ) : (
          leaderboard.map((item, index) => {
            const rank = index + 1;
            const movement = movements[item.id];

            return (
              <View
                key={item.id}
                style={[
                  styles.row,
                  rank === 1 && styles.firstPlace,
                ]}
              >
                {/* Rank */}
                <View
                  style={[
                    styles.rank,
                    rank === 1 && styles.firstRank,
                  ]}
                >
                  <Text style={styles.rankText}>
                    {rank}
                  </Text>
                </View>

                {/* Movement */}
                <View style={styles.movement}>
                  {movement === "up" && (
                    <Ionicons
                      name="arrow-up"
                      size={15}
                      color={COLORS.success}
                    />
                  )}

                  {movement === "down" && (
                    <Ionicons
                      name="arrow-down"
                      size={15}
                      color="#EF4444"
                    />
                  )}
                </View>

                {/* Nominee */}
                <View style={styles.info}>
                  <Text style={styles.name}>
                    {item.name}
                  </Text>

                  <Text style={styles.category}>
                    {item.category}
                  </Text>
                </View>

                {/* Votes */}
                <View>
                  <Text style={styles.votes}>
                    {item.votes.toLocaleString()}
                  </Text>

                  <Text style={styles.voteLabel}>
                    votes
                  </Text>
                </View>
              </View>
            );
          })
        )}

        {/* Explanation */}
        <View style={styles.infoBox}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={COLORS.gold}
          />

          <Text style={styles.infoBoxText}>
            Rankings are based on the current number of
            votes received by each nominee.
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

  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 110,
  },

  eyebrow: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
  },

  title: {
    color: COLORS.white,
    fontSize: 30,
    fontWeight: "900",
    marginTop: 7,
  },

  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 5,
    marginBottom: 15,
  },

  liveStatus: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#172112",
    borderWidth: 1,
    borderColor: "#29451F",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginBottom: 25,
  },

  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.success,
    marginRight: 7,
  },

  liveText: {
    color: COLORS.success,
    fontSize: 10,
    fontWeight: "800",
  },

  filterLabel: {
    color: COLORS.muted,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 10,
  },

  filterContent: {
    paddingRight: 20,
    paddingBottom: 20,
  },

  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 9,
  },

  filterButtonActive: {
    backgroundColor: COLORS.gold,
    borderColor: COLORS.gold,
  },

  filterText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: "700",
    marginLeft: 7,
  },

  filterTextActive: {
    color: COLORS.black,
  },

  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    marginBottom: 15,
  },

  categoryHeaderIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: "#241C0D",
    alignItems: "center",
    justifyContent: "center",
  },

  categoryHeaderInfo: {
    flex: 1,
    marginLeft: 12,
  },

  categoryLabel: {
    color: COLORS.muted,
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 4,
  },

  categoryTitle: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "900",
  },

  row: {
    minHeight: 78,
    backgroundColor: COLORS.surface,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  firstPlace: {
    borderColor: COLORS.gold,
  },

  rank: {
    width: 39,
    height: 39,
    borderRadius: 20,
    backgroundColor: "#241C0D",
    alignItems: "center",
    justifyContent: "center",
  },

  firstRank: {
    backgroundColor: COLORS.gold,
  },

  rankText: {
    color: COLORS.gold,
    fontSize: 15,
    fontWeight: "900",
  },

  movement: {
    width: 22,
    alignItems: "center",
    justifyContent: "center",
  },

  info: {
    flex: 1,
    marginLeft: 4,
  },

  name: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "800",
  },

  category: {
    color: COLORS.textSecondary,
    fontSize: 10,
    marginTop: 4,
  },

  votes: {
    color: COLORS.gold,
    fontSize: 15,
    fontWeight: "900",
    textAlign: "right",
  },

  voteLabel: {
    color: COLORS.muted,
    fontSize: 9,
    textAlign: "right",
    marginTop: 2,
  },

  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 65,
    paddingHorizontal: 25,
  },

  emptyTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "800",
    marginTop: 15,
  },

  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 7,
  },

  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 15,
    padding: 14,
    marginTop: 10,
  },

  infoBoxText: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: 11,
    lineHeight: 17,
    marginLeft: 9,
  },
});