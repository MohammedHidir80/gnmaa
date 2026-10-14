import React, { useEffect, useState } from "react";

import {
  ScrollView,
  View,
  StyleSheet,
  StatusBar,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import HomeHeader from "../components/home/HomeHeader";
import AwardsHero from "../components/home/AwardsHero";
import SectionHeader from "../components/home/SectionHeader";
import CategoryCard from "../components/home/CategoryCard";
import NomineeCard from "../components/home/NomineeCard";
import EventCard from "../components/home/EventCard";

import {
  categories,
  nominees,
} from "../../constants/data";

import COLORS from "../../constants/colors";
import { useAuth } from "../../context/AuthContext";
import { getPublishedEvents } from "../../services/eventService";

export default function HomeScreen() {
  const router = useRouter();

  const { profile } = useAuth();

  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  /*
   * Load published events
   */
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setEventsLoading(true);

      const data = await getPublishedEvents();

      setEvents(data);
    } catch (error) {
      console.error("HOME EVENTS ERROR:", error);
      setEvents([]);
    } finally {
      setEventsLoading(false);
    }
  };

  /*
   * User name from Firestore profile
   */
  const userName = profile?.name || "Guest";

  const walletBalance = 25.00;

  const handleVote = (nominee) => {
    console.log("Vote for:", nominee.name);
  };

  const handleFundWallet = () => {
    console.log("Navigate to wallet funding");
  };

  const handleProfile = () => {
    router.push("/(tabs)/profile");
  };

  const handleEventPress = (event) => {
    router.push({
      pathname: "/events/[id]",
      params: {
        id: event.id,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.background}
      />

      {/* Header */}
      <HomeHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Greeting */}
        <View style={styles.greetingRow}>
          <View>
            <Text style={styles.greeting}>
              Welcome back,
            </Text>

            <Text style={styles.userName}>
              {userName} 👋
            </Text>
          </View>

          <TouchableOpacity
            style={styles.profileButton}
            onPress={handleProfile}
          >
            <Ionicons
              name="person-outline"
              size={21}
              color={COLORS.gold}
            />
          </TouchableOpacity>
        </View>

        {/* Awards Hero */}
        <AwardsHero
          onPress={() =>
            router.push("/categories")
          }
        />

        {/* Live Voting Banner */}
        <TouchableOpacity
          style={styles.liveBanner}
          activeOpacity={0.8}
          onPress={() =>
            console.log("Open active elections")
          }
        >
          <View style={styles.liveIcon}>
            <Ionicons
              name="radio"
              size={20}
              color={COLORS.gold}
            />
          </View>

          <View style={styles.liveContent}>
            <Text style={styles.liveTitle}>
              Voting is Live
            </Text>

            <Text style={styles.liveSubtitle}>
              Support your favourite nominees today.
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color={COLORS.gold}
          />
        </TouchableOpacity>

        {/* Featured Categories */}
        <SectionHeader
          title="Featured Categories"
          onPress={() =>
            router.push("/categories")
          }
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalContent}
        >
          {categories.map((item) => (
            <CategoryCard
              key={item.id}
              item={item}
              onPress={() =>
                router.push({
                  pathname: "/category/[id]",
                  params: {
                    id: item.id,
                  },
                })
              }
            />
          ))}
        </ScrollView>

        {/* Leading Nominees */}
        <SectionHeader
          title="Leading Nominees"
          onPress={() =>
            console.log("Leaderboard")
          }
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalContent}
        >
          {nominees.map((item, index) => (
            <NomineeCard
              key={item.id}
              item={item}
              index={index}
              onVote={() => handleVote(item)}
            />
          ))}
        </ScrollView>

        {/* Upcoming Events */}
        <SectionHeader
          title="Upcoming Events"
          onPress={() =>
            router.push("/(tabs)/events")
          }
        />

        {eventsLoading ? (
          <View style={styles.eventsLoading}>
            <ActivityIndicator
              size="small"
              color={COLORS.gold}
            />

            <Text style={styles.eventsLoadingText}>
              Loading events...
            </Text>
          </View>
        ) : events.length === 0 ? (
          <View style={styles.emptyEvents}>
            <Ionicons
              name="calendar-outline"
              size={28}
              color={COLORS.gold}
            />

            <Text style={styles.emptyEventsTitle}>
              No upcoming events
            </Text>

            <Text style={styles.emptyEventsText}>
              Check back later for GNMA updates.
            </Text>
          </View>
        ) : (
          events.slice(0, 2).map((item) => (
            <EventCard
              key={item.id}
              item={item}
              onPress={() =>
                handleEventPress(item)
              }
            />
          ))
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>
            GNMA 2027
          </Text>

          <Text style={styles.footerText}>
            Celebrating Northern Music & Talent
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    paddingBottom: 110,
  },

  greetingRow: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  greeting: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },

  userName: {
    color: COLORS.white,
    fontSize: 23,
    fontWeight: "900",
    marginTop: 4,
  },

  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },

  walletCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 18,
    borderRadius: 20,
    backgroundColor: "#17130B",
    borderWidth: 1,
    borderColor: COLORS.goldDark,
  },

  walletTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  walletIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#29200E",
    alignItems: "center",
    justifyContent: "center",
  },

  walletLabel: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
    marginLeft: 11,
  },

  walletStatus: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.success,
    marginRight: 5,
  },

  statusText: {
    color: COLORS.textSecondary,
    fontSize: 10,
  },

  balanceLabel: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 20,
  },

  balance: {
    color: COLORS.white,
    fontSize: 30,
    fontWeight: "900",
    marginTop: 5,
    letterSpacing: 0.5,
  },

  walletBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 18,
  },

  voteInfo: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: "700",
  },

  fundButton: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: 14,
    height: 38,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  fundButtonText: {
    color: COLORS.black,
    fontSize: 11,
    fontWeight: "900",
  },

  liveBanner: {
    marginHorizontal: 20,
    marginTop: 2,
    marginBottom: 20,
    padding: 14,
    borderRadius: 17,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
  },

  liveIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#29200E",
    alignItems: "center",
    justifyContent: "center",
  },

  liveContent: {
    flex: 1,
    marginLeft: 11,
  },

  liveTitle: {
    color: COLORS.gold,
    fontSize: 13,
    fontWeight: "900",
  },

  liveSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 10,
    marginTop: 4,
  },

  horizontalContent: {
    paddingHorizontal: 20,
  },

  /*
   * Events loading
   */
  eventsLoading: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
  },

  eventsLoadingText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 8,
  },

  /*
   * Empty events
   */
  emptyEvents: {
    marginHorizontal: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  emptyEventsTitle: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "800",
    marginTop: 10,
  },

  emptyEventsText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    textAlign: "center",
    marginTop: 5,
  },

  footer: {
    alignItems: "center",
    paddingVertical: 45,
  },

  footerTitle: {
    color: COLORS.gold,
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 2,
  },

  footerText: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 6,
  },
});