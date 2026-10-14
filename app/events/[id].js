import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

import COLORS from "../../constants/colors";
import { getEventById } from "../../services/eventService";

export default function EventDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    try {
      setLoading(true);

      if (!id) {
        setEvent(null);
        return;
      }

      const eventData = await getEventById(String(id));

      setEvent(eventData);
    } catch (error) {
      console.error("EVENT DETAILS ERROR:", error);
      setEvent(null);
    } finally {
      setLoading(false);
    }
  };

  /*
   * Loading state
   */
  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />

        <View style={styles.notFound}>
          <ActivityIndicator
            size="large"
            color={COLORS.gold}
          />

          <Text style={styles.loadingText}>
            Loading event...
          </Text>
        </View>
      </View>
    );
  }

  /*
   * Event not found
   */
  if (!event) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />

        <View style={styles.notFound}>
          <Ionicons
            name="calendar-outline"
            size={50}
            color={COLORS.gold}
          />

          <Text style={styles.notFoundTitle}>
            Event not found
          </Text>

          <TouchableOpacity
            style={styles.backHomeButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backHomeText}>
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
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
          Event Details
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Event Icon */}
        <View style={styles.heroIcon}>
          <Ionicons
            name="calendar"
            size={42}
            color={COLORS.gold}
          />
        </View>

        {/* Event title */}
        <Text style={styles.title}>
          {event.title}
        </Text>

        <Text style={styles.eyebrow}>
          GNMA 2027
        </Text>

        {/* Date & Time */}
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Ionicons
                name="calendar-outline"
                size={19}
                color={COLORS.gold}
              />
            </View>

            <View>
              <Text style={styles.infoLabel}>
                DATE
              </Text>

              <Text style={styles.infoValue}>
                {event.date}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Ionicons
                name="time-outline"
                size={19}
                color={COLORS.gold}
              />
            </View>

            <View>
              <Text style={styles.infoLabel}>
                TIME
              </Text>

              <Text style={styles.infoValue}>
                {event.time}
              </Text>
            </View>
          </View>
        </View>

        {/* Story */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            About This Event
          </Text>

          <Text style={styles.story}>
            {event.description ||
              `The ${event.title} is an important part of the GNMA 2027 awards journey. This event brings together artistes, music lovers, industry professionals and fans as we celebrate Northern Ghana's music and talent.`}
          </Text>

          <Text style={styles.story}>
            GNMA continues to provide a platform for recognising
            outstanding talent and celebrating the people who
            contribute to the growth and development of Northern
            Ghana's entertainment industry.
          </Text>

          <Text style={styles.story}>
            Stay connected through the GNMA app for announcements,
            updates and important information surrounding this
            event.
          </Text>
        </View>

        {/* Event details */}
        <View style={styles.detailsCard}>
          <View style={styles.detailsHeader}>
            <Ionicons
              name="information-circle-outline"
              size={21}
              color={COLORS.gold}
            />

            <Text style={styles.detailsTitle}>
              Event Information
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
              Event
            </Text>

            <Text style={styles.detailValue}>
              {event.title}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
              Date
            </Text>

            <Text style={styles.detailValue}>
              {event.date}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
              Time
            </Text>

            <Text style={styles.detailValue}>
              {event.time}
            </Text>
          </View>

          {event.eventInfo?.venue ? (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>
                Venue
              </Text>

              <Text style={styles.detailValue}>
                {event.eventInfo.venue}
              </Text>
            </View>
          ) : null}

          {event.eventInfo?.location ? (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>
                Location
              </Text>

              <Text style={styles.detailValue}>
                {event.eventInfo.location}
              </Text>
            </View>
          ) : null}

          {event.eventInfo?.dressCode ? (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>
                Dress Code
              </Text>

              <Text style={styles.detailValue}>
                {event.eventInfo.dressCode}
              </Text>
            </View>
          ) : null}

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
              Edition
            </Text>

            <Text style={styles.detailValue}>
              GNMA 2027
            </Text>
          </View>

          {event.eventInfo?.additionalInfo ? (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>
                Additional Info
              </Text>

              <Text style={styles.detailValue}>
                {event.eventInfo.additionalInfo}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Bottom message */}
        <View style={styles.bottomMessage}>
          <Ionicons
            name="notifications-outline"
            size={20}
            color={COLORS.gold}
          />

          <Text style={styles.bottomMessageText}>
            Keep an eye on the app for more GNMA 2027 updates.
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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 58,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  headerTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "900",
  },

  content: {
    padding: 20,
    paddingBottom: 110,
  },

  heroIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#241C0D",
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 22,
  },

  title: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
    lineHeight: 35,
  },

  eyebrow: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
    textAlign: "center",
    marginTop: 10,
  },

  infoContainer: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    padding: 17,
    marginTop: 28,
  },

  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  infoIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#241C0D",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  infoLabel: {
    color: COLORS.muted,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 4,
  },

  infoValue: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "700",
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 15,
  },

  section: {
    marginTop: 30,
  },

  sectionTitle: {
    color: COLORS.white,
    fontSize: 21,
    fontWeight: "900",
    marginBottom: 13,
  },

  story: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 23,
    marginBottom: 15,
  },

  detailsCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    padding: 17,
    marginTop: 15,
  },

  detailsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 17,
  },

  detailsTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "800",
    marginLeft: 8,
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  detailLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    flex: 1,
  },

  detailValue: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "700",
    maxWidth: "65%",
    textAlign: "right",
  },

  bottomMessage: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#241C0D",
    borderRadius: 15,
    padding: 15,
    marginTop: 22,
  },

  bottomMessageText: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginLeft: 10,
  },

  loadingText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 12,
  },

  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },

  notFoundTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "800",
    marginTop: 15,
    marginBottom: 20,
  },

  backHomeButton: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: 25,
    paddingVertical: 13,
    borderRadius: 12,
  },

  backHomeText: {
    color: COLORS.black,
    fontWeight: "800",
  },
});