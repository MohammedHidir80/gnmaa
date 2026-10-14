import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../../constants/colors";

export default function CategoryCard({ item, onPress }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.icon}>
        <Ionicons
          name={item.icon}
          size={25}
          color={COLORS.gold}
        />
      </View>

      <Text style={styles.title}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 145,
    height: 135,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    padding: 14,
    justifyContent: "space-between",
    marginRight: 10,
  },

  icon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#241C0D",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 17,
  },
});