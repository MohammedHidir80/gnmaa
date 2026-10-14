import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import * as Linking from "expo-linking"

import COLORS from "../constants/colors";
import { reload, sendEmailVerification } from "firebase/auth";
import { auth } from "../services/firebase";

export default function VerifyEmailScreen() {
  const { email } = useLocalSearchParams();
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);



  const inputs = useRef([]);

  const verifyEmail = async () => {
    try {
      setVerifying(true);

      await reload(auth.currentUser);

      if (auth.currentUser?.emailVerified) {
        Alert.alert(
          "Email Verified",
          "Your email has been verified successfully.",
          [
            {
              text: "Continue",
              onPress: () =>
                router.replace(
                  "/(tabs)/home"
                ),
            },
          ]
        );
      } else {
        Alert.alert(
          "Not Verified Yet",
          "Please open the verification link in your email first."
        );
      }
    } catch (error) {
      console.error(
        "EMAIL VERIFICATION ERROR:",
        error
      );

      Alert.alert(
        "Verification Error",
        "We couldn't check your email verification status. Please try again."
      );
    } finally {
      setVerifying(false);
    }
  };

  const resendEmail = async () => {
    try {
      setResending(true);

      await sendEmailVerification(
        auth.currentUser
      );

      Alert.alert(
        "Email Sent",
        "We've sent another verification link to your email."
      );
    } catch (error) {
      console.error(
        "RESEND EMAIL ERROR:",
        error
      );

      Alert.alert(
        "Unable to Send",
        "We couldn't send the verification email. Please try again later."
      );
    } finally {
      setResending(false);
    }
  };

  const displayEmail =
    email || "your email address";

  const openEmailApp = async () => {
    await Linking.openURL("mailto:");
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
          {/* Back button */}


          {/* Verification Icon */}
          <View style={styles.iconOuter}>
            <View style={styles.iconInner}>
              <Ionicons
                name="mail-outline"
                size={42}
                color={COLORS.gold}
              />
            </View>
          </View>

          {/* Heading */}
          <Text style={styles.title}>
            Verify Your Email
          </Text>

          <Text style={styles.description}>
            We've sent a verification link to
          </Text>

          <Text
            style={styles.email}
            numberOfLines={1}
          >
            {displayEmail}
          </Text>

          {/* Code Inputs */}
          <TouchableOpacity
            style={styles.openEmailButton}
            onPress={openEmailApp}
          >
            <Ionicons
              name="mail-open-outline"
              size={20}
              color={COLORS.gold}
            />

            <Text style={styles.openEmailText}>
              Open Email App
            </Text>
          </TouchableOpacity>

          {/* Verify Button */}
          <TouchableOpacity
            style={[
              styles.verifyButton,
              verifying && styles.buttonDisabled,
            ]}
            onPress={verifyEmail}
            disabled={verifying}
            activeOpacity={0.8}
          >
            {verifying ? (
              <>
                <ActivityIndicator
                  size="small"
                  color={COLORS.black}
                />

                <Text style={styles.verifyText}>
                  CHECKING...
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.verifyText}>
                  I'VE VERIFIED MY EMAIL
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={19}
                  color={COLORS.black}
                />
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.replace("/auth")}
            activeOpacity={0.8}
          >
            <Text style={styles.changeEmailText}>
              Wrong email? Go back and sign up again
            </Text>
          </TouchableOpacity>

          {/* Resend */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendLabel}>
              Didn't receive the Link?
            </Text>

            <TouchableOpacity
              onPress={resendEmail}
              disabled={resending}
            >
              {resending ? (
                <ActivityIndicator
                  size="small"
                  color={COLORS.gold}
                />
              ) : (
                <Text style={styles.resendButton}>
                  Resend Link
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Help */}
          <View style={styles.helpContainer}>
            <Ionicons
              name="information-circle-outline"
              size={17}
              color={COLORS.muted}
            />

            <Text style={styles.helpText}>
              Check your spam or junk folder if you
              don't see the email.
            </Text>
          </View>

          {/* Branding */}
          <View style={styles.brandContainer}>
            <Text style={styles.brand}>
              GNMA
            </Text>

            <Text style={styles.brandSubtitle}>
              GHANA NORTHERN MUSIC AWARDS
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  changeEmailText: {
    color: COLORS.gold,
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 18,
  },

  keyboard: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 55,
    paddingBottom: 35,
    alignItems: "center",
  },

  backButton: {
    alignSelf: "flex-start",
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 48,
  },

  iconOuter: {
    width: 105,
    height: 105,
    borderRadius: 53,
    backgroundColor: "#1A150B",
    borderWidth: 1,
    borderColor: COLORS.goldDark,
    alignItems: "center",
    justifyContent: "center",
  },

  iconInner: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: "#241C0D",
    borderWidth: 1,
    borderColor: COLORS.gold,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    color: COLORS.white,
    fontSize: 29,
    fontWeight: "900",
    marginTop: 30,
    textAlign: "center",
  },

  description: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 9,
    textAlign: "center",
  },

  email: {
    color: COLORS.gold,
    fontSize: 13,
    fontWeight: "800",
    marginTop: 4,
    maxWidth: "90%",
  },

  openEmailButton: {
    width: "100%",
    height: 54,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.gold,
    backgroundColor: "#1C170D",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 32,
    marginBottom: 24,
  },

  openEmailText: {
    color: COLORS.gold,
    fontSize: 14,
    fontWeight: "800",
  },

  verifyButton: {
    width: "100%",
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.gold,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  verifyText: {
    color: COLORS.black,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0.5,
  },

  resendContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
  },

  resendLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },

  resendButton: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: "800",
    marginLeft: 5,
  },

  helpContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 13,
    padding: 12,
    marginTop: 28,
  },

  helpText: {
    flex: 1,
    color: COLORS.muted,
    fontSize: 10,
    lineHeight: 15,
    marginLeft: 8,
  },

  brandContainer: {
    alignItems: "center",
    marginTop: "auto",
    paddingTop: 40,
  },

  brand: {
    color: COLORS.gold,
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 2,
  },

  brandSubtitle: {
    color: COLORS.muted,
    fontSize: 7,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginTop: 3,
  },
}); 