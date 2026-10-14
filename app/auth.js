import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    Alert,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

import COLORS from "../constants/colors";
import { signupUser, loginUser } from "../services/userService";
import { registerPushToken } from "../services/notificationService";

export default function AuthScreen() {

    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState("login");

    const [showPassword, setShowPassword] = useState(false);

    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });

    const [signupData, setSignupData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const isLogin = mode === "login";

    const handleLogin = async () => {
        if (!loginData.email.trim() || !loginData.password) {
            Alert.alert(
                "Missing Information",
                "Please enter your email and password."
            );
            return;
        }

        try {
            setLoading(true);

            await loginUser(
                loginData.email,
                loginData.password
            );

            Alert.alert(
                "Login Successful",
                "Welcome back to GNMA.",
                [
                    {
                        text: "Continue",
                        onPress: () => {
                            router.replace("/(tabs)/home");
                        },
                    },
                ]
            );
        } catch (error) {
            console.error("LOGIN ERROR:", error);

            let message = "Unable to login. Please try again.";

            if (error.code === "auth/invalid-credential") {
                message = "Incorrect email or password.";
            } else if (error.code === "auth/user-not-found") {
                message = "No account was found with this email.";
            } else if (error.code === "auth/wrong-password") {
                message = "Incorrect password.";
            } else if (error.code === "auth/invalid-email") {
                message = "Please enter a valid email address.";
            }

            Alert.alert("Login Failed", message);
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async () => {
        if (!signupData.name.trim()) {
            Alert.alert(
                "Missing Name",
                "Please enter your full name."
            );
            return;
        }

        if (!signupData.email.trim()) {
            Alert.alert(
                "Missing Email",
                "Please enter your email address."
            );
            return;
        }

        if (!signupData.phone.trim()) {
            Alert.alert(
                "Missing Phone",
                "Please enter your phone number."
            );
            return;
        }

        if (!signupData.password) {
            Alert.alert(
                "Missing Password",
                "Please create a password."
            );
            return;
        }

        if (signupData.password.length < 6) {
            Alert.alert(
                "Password Too Short",
                "Your password must be at least 6 characters."
            );
            return;
        }

        if (
            signupData.password !==
            signupData.confirmPassword
        ) {
            Alert.alert(
                "Password Error",
                "Passwords do not match."
            );
            return;
        }

        try {
            setLoading(true);

            const user = await signupUser({
                name: signupData.name,
                email: signupData.email,
                phone: signupData.phone,
                password: signupData.password,
            });

            // Push notification registration should NOT
            // prevent account creation if it fails.
            await registerPushToken(user.uid);

            Alert.alert(
                "Account Created",
                "Your account has been created successfully. Please verify your email before continuing.",
                [
                    {
                        text: "Continue",
                        onPress: () => {
                            router.replace({
                                pathname: "/verify-email",
                                params: {
                                    email: signupData.email,
                                },
                            });
                        },
                    },
                ]
            );
        } catch (error) {
            console.error("SIGNUP ERROR:", error);

            let message =
                "Unable to create your account. Please try again.";

            if (error.code === "auth/email-already-in-use") {
                message =
                    "An account already exists with this email.";
            } else if (error.code === "auth/invalid-email") {
                message =
                    "Please enter a valid email address.";
            } else if (error.code === "auth/weak-password") {
                message =
                    "Please choose a stronger password.";
            }

            Alert.alert(
                "Signup Failed",
                message
            );
        } finally {
            setLoading(false);
        }
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
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Logo */}
                    <View style={styles.logoContainer}>
                        <View style={styles.logoCircle}>
                            <Text style={styles.logo}>
                                GNMA
                            </Text>
                        </View>

                        <Text style={styles.brand}>
                            GHANA NORTHERN MUSIC AWARDS
                        </Text>
                    </View>

                    {/* Heading */}
                    <View style={styles.heading}>
                        <Text style={styles.title}>
                            {isLogin
                                ? "Welcome Back"
                                : "Create Account"}
                        </Text>

                        <Text style={styles.subtitle}>
                            {isLogin
                                ? "Sign in to continue voting for your favourites."
                                : "Join GNMA and start supporting your favourite artistes."}
                        </Text>
                    </View>

                    {/* Switch */}
                    <View style={styles.switchContainer}>
                        <TouchableOpacity
                            style={[
                                styles.switchButton,
                                isLogin &&
                                styles.activeSwitch,
                            ]}
                            onPress={() => setMode("login")}
                        >
                            <Text
                                style={[
                                    styles.switchText,
                                    isLogin &&
                                    styles.activeSwitchText,
                                ]}
                            >
                                Login
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.switchButton,
                                !isLogin &&
                                styles.activeSwitch,
                            ]}
                            onPress={() => setMode("signup")}
                        >
                            <Text
                                style={[
                                    styles.switchText,
                                    !isLogin &&
                                    styles.activeSwitchText,
                                ]}
                            >
                                Sign Up
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Forms */}
                    {isLogin ? (
                        <LoginForm
                            data={loginData}
                            setData={setLoginData}
                            showPassword={showPassword}
                            setShowPassword={setShowPassword}
                            onSubmit={handleLogin}
                            loading={loading}
                        />
                    ) : (
                        <SignupForm
                            data={signupData}
                            setData={setSignupData}
                            showPassword={showPassword}
                            setShowPassword={setShowPassword}
                            onSubmit={handleSignup}
                            loading={loading}
                        />
                    )}

                    {/* Terms */}
                    <Text style={styles.terms}>
                        By continuing, you agree to the GNMA
                        Terms of Service and Privacy Policy.
                    </Text>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

/* ------------------------------------------------ */
/* LOGIN FORM */
/* ------------------------------------------------ */

function LoginForm({
    data,
    setData,
    showPassword,
    setShowPassword,
    onSubmit,
    loading,
}) {
    return (
        <View style={styles.form}>
            <Input
                label="Email Address"
                icon="mail-outline"
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={data.email}
                onChangeText={(text) =>
                    setData({
                        ...data,
                        email: text,
                    })
                }
            />

            <Input
                label="Password"
                icon="lock-closed-outline"
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                value={data.password}
                onChangeText={(text) =>
                    setData({
                        ...data,
                        password: text,
                    })
                }
                rightIcon={
                    showPassword
                        ? "eye-off-outline"
                        : "eye-outline"
                }
                onRightIconPress={() =>
                    setShowPassword(!showPassword)
                }
            />

            <TouchableOpacity
                style={styles.forgot}
                onPress={() => router.push("/forgot-password")}
            >
                <Text style={styles.forgotText}>
                    Forgot Password?
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.primaryButton,
                    loading && styles.buttonDisabled,
                ]}
                onPress={onSubmit}
                disabled={loading}
                activeOpacity={0.8}
            >
                {loading ? (
                    <ActivityIndicator
                        size="small"
                        color={COLORS.black}
                    />
                ) : (
                    <Text style={styles.primaryButtonText}>
                        LOGIN
                    </Text>
                )}
            </TouchableOpacity>

        </View>
    );
}

/* ------------------------------------------------ */
/* SIGNUP FORM */
/* ------------------------------------------------ */

function SignupForm({
    data,
    setData,
    showPassword,
    setShowPassword,
    onSubmit,
    loading,
}) {
    return (
        <View style={styles.form}>
            <Input
                label="Full Name"
                icon="person-outline"
                placeholder="Enter your full name"
                value={data.name}
                onChangeText={(text) =>
                    setData({
                        ...data,
                        name: text,
                    })
                }
            />

            <Input
                label="Email Address"
                icon="mail-outline"
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={data.email}
                onChangeText={(text) =>
                    setData({
                        ...data,
                        email: text,
                    })
                }
            />

            <Input
                label="Phone Number"
                icon="call-outline"
                placeholder="024 XXX XXXX"
                keyboardType="phone-pad"
                value={data.phone}
                onChangeText={(text) =>
                    setData({
                        ...data,
                        phone: text,
                    })
                }
            />

            <Input
                label="Password"
                icon="lock-closed-outline"
                placeholder="Create a password"
                secureTextEntry={!showPassword}
                value={data.password}
                onChangeText={(text) =>
                    setData({
                        ...data,
                        password: text,
                    })
                }
                rightIcon={
                    showPassword
                        ? "eye-off-outline"
                        : "eye-outline"
                }
                onRightIconPress={() =>
                    setShowPassword(!showPassword)
                }
            />

            <Input
                label="Confirm Password"
                icon="shield-checkmark-outline"
                placeholder="Confirm your password"
                secureTextEntry={!showPassword}
                value={data.confirmPassword}
                onChangeText={(text) =>
                    setData({
                        ...data,
                        confirmPassword: text,
                    })
                }
            />

            <TouchableOpacity
                style={[
                    styles.primaryButton,
                    loading && styles.buttonDisabled,
                ]}
                onPress={onSubmit}
                disabled={loading}
                activeOpacity={0.8}
            >
                {loading ? (
                    <ActivityIndicator
                        size="small"
                        color={COLORS.black}
                    />
                ) : (
                    <Text style={styles.primaryButtonText}>
                        CREATE ACCOUNT
                    </Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

/* ------------------------------------------------ */
/* INPUT */
/* ------------------------------------------------ */

function Input({
    label,
    icon,
    placeholder,
    value,
    onChangeText,
    secureTextEntry,
    rightIcon,
    onRightIconPress,
    keyboardType,
    autoCapitalize,
}) {
    return (
        <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
                {label}
            </Text>

            <View style={styles.inputContainer}>
                <Ionicons
                    name={icon}
                    size={19}
                    color={COLORS.gold}
                />

                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor="#686868"
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                />

                {rightIcon && (
                    <TouchableOpacity
                        onPress={onRightIconPress}
                    >
                        <Ionicons
                            name={rightIcon}
                            size={20}
                            color={COLORS.textSecondary}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

/* ------------------------------------------------ */
/* STYLES */
/* ------------------------------------------------ */

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    keyboard: {
        flex: 1,
    },

    scrollContent: {
        paddingHorizontal: 22,
        paddingTop: 55,
        paddingBottom: 45,
    },

    logoContainer: {
        alignItems: "center",
    },

    logoCircle: {
        width: 82,
        height: 82,
        borderRadius: 41,
        borderWidth: 1.5,
        borderColor: COLORS.gold,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#17130B",
    },

    logo: {
        color: COLORS.gold,
        fontSize: 23,
        fontWeight: "900",
        letterSpacing: 1,
    },

    brand: {
        color: COLORS.gold,
        fontSize: 8,
        fontWeight: "800",
        letterSpacing: 2,
        marginTop: 11,
    },

    heading: {
        marginTop: 38,
    },

    title: {
        color: COLORS.white,
        fontSize: 30,
        fontWeight: "900",
    },

    subtitle: {
        color: COLORS.textSecondary,
        fontSize: 13,
        lineHeight: 20,
        marginTop: 8,
    },

    switchContainer: {
        height: 55,
        backgroundColor: COLORS.surface,
        borderRadius: 15,
        padding: 5,
        flexDirection: "row",
        marginTop: 25,
        borderWidth: 1,
        borderColor: COLORS.border,
    },

    switchButton: {
        flex: 1,
        borderRadius: 11,
        alignItems: "center",
        justifyContent: "center",
    },

    activeSwitch: {
        backgroundColor: COLORS.gold,
    },

    switchText: {
        color: COLORS.textSecondary,
        fontSize: 13,
        fontWeight: "800",
    },

    activeSwitchText: {
        color: COLORS.black,
    },

    form: {
        marginTop: 25,
    },

    inputGroup: {
        marginBottom: 17,
    },

    inputLabel: {
        color: COLORS.text,
        fontSize: 12,
        fontWeight: "700",
        marginBottom: 8,
    },

    inputContainer: {
        height: 54,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.surface,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
    },

    input: {
        flex: 1,
        color: COLORS.white,
        fontSize: 13,
        marginLeft: 11,
        paddingVertical: 0,
    },

    forgot: {
        alignSelf: "flex-end",
        marginTop: -4,
        marginBottom: 20,
    },

    forgotText: {
        color: COLORS.gold,
        fontSize: 11,
        fontWeight: "700",
    },

    primaryButton: {
        height: 54,
        borderRadius: 27,
        backgroundColor: COLORS.gold,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        marginTop: 4,
    },

    primaryButtonText: {
        color: COLORS.black,
        fontSize: 13,
        fontWeight: "900",
        letterSpacing: 0.5,
    },
    buttonDisabled: {
        opacity: 0.7,
    },

    terms: {
        color: COLORS.muted,
        fontSize: 10,
        lineHeight: 16,
        textAlign: "center",
        marginTop: 25,
        paddingHorizontal: 15,
    },
});