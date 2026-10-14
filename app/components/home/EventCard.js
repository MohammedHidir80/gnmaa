import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import COLORS from "../../../constants/colors";

export default function EventCard({ item }) {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: "/events/[id]",
      params: {
        id: item.id,
      },
    });
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={handlePress}
    >
      <View style={styles.icon}>
        <Ionicons
          name="calendar-outline"
          size={23}
          color={COLORS.gold}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>
          {item.title}
        </Text>

        <Text style={styles.date}>
          {item.date} • {item.time}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={19}
        color={COLORS.gold}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    flexDirection: "row",
    alignItems: "center",
  },

  icon: {
    width: 45,
    height: 45,
    borderRadius: 13,
    backgroundColor: "#241C0D",
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    flex: 1,
    marginLeft: 13,
  },

  title: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "800",
  },

  date: {
    color: COLORS.textSecondary,
    fontSize: 10,
    marginTop: 5,
  },
});