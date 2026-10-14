import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";

import COLORS from "../../constants/colors";
import EventCard from "../components/home/EventCard";
import { getPublishedEvents } from "../../services/eventService";

export default function EventsScreen() {
    const router = useRouter();

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getPublishedEvents();

            setEvents(data);
        } catch (error) {
            console.error("EVENTS ERROR:", error);

            setError(
                "We couldn't load the events. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.content}
            >
                <Text style={styles.eyebrow}>
                    GNMA 2027
                </Text>

                <Text style={styles.title}>
                    Events
                </Text>

                <Text style={styles.subtitle}>
                    Follow the journey to the awards night.
                </Text>

                {loading ? (
                    <View style={styles.centerState}>
                        <ActivityIndicator
                            size="small"
                            color={COLORS.gold}
                        />

                        <Text style={styles.stateText}>
                            Loading events...
                        </Text>
                    </View>
                ) : error ? (
                    <View style={styles.centerState}>
                        <Text style={styles.errorText}>
                            {error}
                        </Text>
                    </View>
                ) : events.length === 0 ? (
                    <View style={styles.centerState}>
                        <Text style={styles.emptyTitle}>
                            No events yet
                        </Text>

                        <Text style={styles.stateText}>
                            Check back later for upcoming GNMA events.
                        </Text>
                    </View>
                ) : (
                    events.map((item) => (
                        <View
                            key={item.id}
                            style={styles.eventWrapper}
                        >
                            <EventCard
                                item={item}
                                onPress={() =>
                                    router.push({
                                        pathname: "/events/[id]",
                                        params: {
                                            id: item.id,
                                        },
                                    })
                                }
                            />
                        </View>
                    ))
                )}
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
        paddingTop: 60,
        paddingBottom: 110,
    },

    eyebrow: {
        color: COLORS.gold,
        fontSize: 11,
        fontWeight: "800",
        letterSpacing: 2,
        marginHorizontal: 20,
    },

    title: {
        color: COLORS.white,
        fontSize: 30,
        fontWeight: "900",
        marginTop: 7,
        marginHorizontal: 20,
    },

    subtitle: {
        color: COLORS.textSecondary,
        fontSize: 13,
        marginTop: 6,
        marginBottom: 25,
        marginHorizontal: 20,
    },

    eventWrapper: {
        marginBottom: 10,
    },

    centerState: {
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 30,
        paddingVertical: 60,
    },

    stateText: {
        color: COLORS.textSecondary,
        fontSize: 13,
        textAlign: "center",
        marginTop: 10,
    },

    errorText: {
        color: "#EF4444",
        fontSize: 13,
        textAlign: "center",
    },

    emptyTitle: {
        color: COLORS.white,
        fontSize: 17,
        fontWeight: "800",
        textAlign: "center",
    },
});