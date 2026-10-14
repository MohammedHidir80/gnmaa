import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

import COLORS from "../constants/colors";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleReset = () => {
    if (!email.trim()) {
      return;
    }

    // Prototype only.
    // Later this will call the real authentication backend.
    setSubmitted(true);
  };

  return (
    <LinearGradient
      colors={[
        COLORS.background,
        "#100E0A",
        COLORS.black,
      ]}
      style={styles.container}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.black}
      />

      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={21}
              color={COLORS.white}
            />

            <Text style={styles.backText}>
              Back
            </Text>
          </TouchableOpacity>

          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Ionicons
                name="lock-closed-outline"
                size={32}
                color={COLORS.gold}
              />
            </View>

            <Text style={styles.logo}>
              GNMA
            </Text>

            <Text style={styles.brand}>
              GHANA NORTHERN MUSIC AWARDS
            </Text>
          </View>

          {!submitted ? (
            <>
              <View style={styles.heading}>
                <Text style={styles.title}>
                  Forgot Password?
                </Text>

                <Text style={styles.subtitle}>
                  No worries. Enter the email address
                  associated with your account and
                  we'll help you reset your password.
                </Text>
              </View>

              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Email Address
                </Text>

                <View style={styles.inputContainer}>
                  <Ionicons
                    name="mail-outline"
                    size={19}
                    color={COLORS.gold}
                  />

                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    placeholderTextColor="#686868"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={styles.resetButton}
                onPress={handleReset}
                activeOpacity={0.8}
              >
                <Text style={styles.resetText}>
                  SEND RESET LINK
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={19}
                  color={COLORS.black}
                />
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.successContainer}>
              <View style={styles.successIcon}>
                <Ionicons
                  name="checkmark"
                  size={34}
                  color={COLORS.black}
                />
              </View>

              <Text style={styles.successTitle}>
                Check Your Email
              </Text>

              <Text style={styles.successText}>
                If an account exists for{" "}
                <Text style={styles.emailHighlight}>
                  {email}
                </Text>
                , we've sent instructions to
                reset your password.
              </Text>

              <TouchableOpacity
                style={styles.backLoginButton}
                onPress={() =>
                  router.replace("/auth")
                }
              >
                <Text style={styles.backLoginText}>
                  BACK TO LOGIN
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setSubmitted(false)}
              >
                <Text style={styles.resend}>
                  Try another email
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.footer}>
            GNMA • Celebrating Northern Music &
            Talent
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  keyboard: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 55,
    paddingBottom: 40,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 7,
  },

  backText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },

  logoContainer: {
    alignItems: "center",
    marginTop: 45,
  },

  logoCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#17130B",
    borderWidth: 1,
    borderColor: COLORS.goldDark,
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    color: COLORS.gold,
    fontSize: 25,
    fontWeight: "900",
    letterSpacing: 1,
    marginTop: 13,
  },

  brand: {
    color: COLORS.gold,
    fontSize: 7,
    fontWeight: "800",
    letterSpacing: 1.8,
    marginTop: 5,
  },

  heading: {
    marginTop: 42,
  },

  title: {
    color: COLORS.white,
    fontSize: 29,
    fontWeight: "900",
  },

  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 21,
    marginTop: 9,
  },

  inputGroup: {
    marginTop: 28,
  },

  label: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 8,
  },

  inputContainer: {
    height: 55,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },

  input: {
    flex: 1,
    color: COLORS.white,
    fontSize: 13,
    marginLeft: 11,
  },

  resetButton: {
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.gold,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 22,
  },

  resetText: {
    color: COLORS.black,
    fontSize: 12,
    fontWeight: "900",
  },

  successContainer: {
    alignItems: "center",
    marginTop: 45,
  },

  successIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.gold,
    alignItems: "center",
    justifyContent: "center",
  },

  successTitle: {
    color: COLORS.white,
    fontSize: 25,
    fontWeight: "900",
    marginTop: 20,
  },

  successText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 10,
  },

  emailHighlight: {
    color: COLORS.gold,
    fontWeight: "800",
  },

  backLoginButton: {
    width: "100%",
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.gold,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
  },

  backLoginText: {
    color: COLORS.black,
    fontSize: 12,
    fontWeight: "900",
  },

  resend: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 18,
  },

  footer: {
    color: COLORS.muted,
    fontSize: 10,
    textAlign: "center",
    marginTop: "auto",
    paddingTop: 40,
  },
});