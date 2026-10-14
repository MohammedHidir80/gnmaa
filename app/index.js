import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import COLORS from "../constants/colors";
import { useAuth } from "../context/AuthContext";

export default function SplashScreen() {
  const logoAnimation = useRef(new Animated.Value(0)).current;
  const contentAnimation = useRef(new Animated.Value(0)).current;
  const { user, loading } = useAuth();


  // Keep the existing splash animations.
  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoAnimation, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),

      Animated.timing(contentAnimation, {
        toValue: 1,
        duration: 1000,
        delay: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [logoAnimation, contentAnimation]);

  // Wait for Firebase to restore the session before navigating.
  useEffect(() => {
    if (loading) return;

    const timer = setTimeout(() => {
      if (!user) {
        // No authenticated session.
        router.replace("/auth");
      } else if (!user.emailVerified) {
        // Preserve your email-verification requirement.
        router.replace({
          pathname: "/verify-email",
          params: {
            email: user.email || "",
          },
        });
      } else {
        // Already authenticated and email verified.
        router.replace("/(tabs)/home");
      }
    }, 2800);

    return () => clearTimeout(timer);
  }, [user, loading]);


  const logoTranslateY = logoAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [80, 0],
  });

  const contentTranslateY = contentAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [40, 0],
  });

  return (
    <LinearGradient
      colors={[COLORS.black, "#252525"]}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />

      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoAnimation,
            transform: [{ translateY: logoTranslateY }],
          },
        ]}
      >
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>GNMA</Text>
        </View>

        <Text style={styles.brandName}>
          GHANA NORTHERN
        </Text>

        <Text style={styles.brandName}>
          MUSIC AWARDS
        </Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.content,
          {
            opacity: contentAnimation,
            transform: [{ translateY: contentTranslateY }],
          },
        ]}
      >
        <View style={styles.divider} />

        <Text style={styles.year}>
          2027 AWARDS
        </Text>

        <Text style={styles.tagline}>
          Celebrating Northern Music{"\n"}
          & Talent
        </Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.bottom,
          {
            opacity: contentAnimation,
          },
        ]}
      >
        <View style={styles.loadingDot} />
        <Text style={styles.loadingText}>
          Preparing your experience
        </Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  logoContainer: {
    alignItems: "center",
  },

  logoCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },

  logoText: {
    color: COLORS.primary,
    fontSize: 27,
    fontWeight: "900",
    letterSpacing: 2,
  },

  brandName: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 2,
  },

  content: {
    alignItems: "center",
    marginTop: 38,
  },

  divider: {
    width: 55,
    height: 2,
    backgroundColor: COLORS.primary,
    marginBottom: 18,
  },

  year: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 3,
  },

  tagline: {
    color: "#D4D4D4",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 23,
    marginTop: 10,
  },

  bottom: {
    position: "absolute",
    bottom: 45,
    alignItems: "center",
  },

  loadingDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginBottom: 9,
  },

  loadingText: {
    color: "#8A8A8A",
    fontSize: 12,
  },
});