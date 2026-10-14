import React, { useEffect } from "react";
import { Tabs, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import COLORS from "../../constants/colors";
import { useAuth } from "../../context/AuthContext";

export default function TabsLayout() {
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    // No logged-in user
    if (!user) {
      router.replace("/auth");
      return;
    }

    // Logged in, but email is NOT verified
    if (!user.emailVerified) {
      router.replace("/verify-email");
      return;
    }

    // User must be an active voter
    if (
      profile &&
      (profile.role !== "voter" ||
        profile.status !== "active")
    ) {
      router.replace("/auth");
    }
  }, [user, profile, loading]);

  // Wait while authentication is being checked
  if (loading) {
    return null;
  }

  // Don't render the tabs for unverified users
  if (!user || !user.emailVerified) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarStyle: {
          position: "absolute",
          left: 14,
          right: 14,
          bottom: 14,
          height: 68,
          borderRadius: 22,
          backgroundColor: "#151515",
          borderWidth: 1,
          borderColor: COLORS.border,
          paddingTop: 8,
          paddingBottom: 8,
        },

        tabBarActiveTintColor: COLORS.gold,
        tabBarInactiveTintColor: COLORS.muted,

        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: "700",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="categories"
        options={{
          title: "Categories",
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="trophy-outline"
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="leaderboard"
        options={{
          title: "Leaders",
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="podium-outline"
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="wallet"
        options={{
          title: "Wallet",
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="wallet-outline"
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="events"
        options={{
          title: "Events",
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="calendar-outline"
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="person-outline"
              size={22}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}