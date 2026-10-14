import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../../constants/colors";

export default function SectionHeader({ title, onPress }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {title}
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
      >
        <Text style={styles.viewAll}>
          View All
        </Text>

        <Ionicons
          name="chevron-forward"
          size={16}
          color={COLORS.gold}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 28,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    color: COLORS.white,
    fontSize: 19,
    fontWeight: "800",
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
  },

  viewAll: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginRight: 2,
  },
});