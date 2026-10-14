import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import COLORS from "../../../constants/colors";

export default function AwardsHero() {
    const router = useRouter();

    return (
        <View style={styles.wrapper}>
            <LinearGradient
                colors={[
                    "#2A2112",
                    "#15120D",
                    "#090909",
                ]}
                style={styles.container}
            >
                <View style={styles.glow} />

                <Text style={styles.eyebrow}>
                    THE BIGGEST MUSIC AWARDS
                </Text>

                <Text style={styles.eyebrow}>
                    IN NORTHERN GHANA
                </Text>

                <Text style={styles.year}>
                    2027
                </Text>

                <Text style={styles.title}>
                    AWARDS
                </Text>

                <Text style={styles.description}>
                    Celebrating Northern{"\n"}
                    Music & Talent
                </Text>

                <View style={styles.countdown}>
                    <TimeBox number="364" label="Days" />
                    <TimeBox number="14" label="Hours" />
                    <TimeBox number="23" label="Minutes" />
                    <TimeBox number="58" label="Seconds" />
                </View>

                <TouchableOpacity style={styles.button}
                    onPress={() =>
                        router.push("/categories")
                    }

                >
                    <Ionicons
                        name="ticket-outline"
                        size={21}
                        color={COLORS.black}
                    />

                    <Text style={styles.buttonText}>
                        VOTE NOW
                    </Text>

                    <Ionicons
                        name="arrow-forward"
                        size={20}
                        color={COLORS.black}
                    />
                </TouchableOpacity>

                <View style={styles.trophy}>
                    <Ionicons
                        name="trophy"
                        size={80}
                        color={COLORS.gold}
                    />
                </View>
            </LinearGradient>
        </View>
    );
}

function TimeBox({ number, label }) {
    return (
        <View style={styles.timeBox}>
            <Text style={styles.number}>
                {number}
            </Text>

            <Text style={styles.label}>
                {label}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        paddingHorizontal: 16,
    },

    container: {
        minHeight: 365,
        borderRadius: 24,
        padding: 24,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: COLORS.goldDark,
    },

    glow: {
        position: "absolute",
        width: 250,
        height: 250,
        borderRadius: 125,
        backgroundColor: "#5A431C",
        opacity: 0.25,
        right: -80,
        top: -70,
    },

    eyebrow: {
        color: COLORS.gold,
        fontSize: 9,
        fontWeight: "800",
        letterSpacing: 2,
    },

    year: {
        color: COLORS.goldLight,
        fontSize: 56,
        fontWeight: "900",
        marginTop: 18,
        lineHeight: 58,
    },

    title: {
        color: COLORS.white,
        fontSize: 36,
        fontWeight: "900",
        lineHeight: 38,
    },

    description: {
        color: COLORS.textSecondary,
        fontSize: 14,
        lineHeight: 21,
        marginTop: 9,
    },

    countdown: {
        flexDirection: "row",
        gap: 7,
        marginTop: 20,
    },

    timeBox: {
        width: 58,
        paddingVertical: 8,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.goldDark,
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.35)",
    },

    number: {
        color: COLORS.goldLight,
        fontSize: 17,
        fontWeight: "900",
    },

    label: {
        color: COLORS.muted,
        fontSize: 8,
        marginTop: 2,
    },

    button: {
        height: 48,
        backgroundColor: COLORS.gold,
        borderRadius: 24,
        paddingHorizontal: 18,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        alignSelf: "flex-start",
        marginTop: 22,
    },

    buttonText: {
        color: COLORS.black,
        fontSize: 13,
        fontWeight: "900",
    },

    trophy: {
        position: "absolute",
        right: 25,
        top: 115,
        opacity: 0.9,
    },
});