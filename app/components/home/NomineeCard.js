import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import COLORS from "../../../constants/colors";

export default function NomineeCard({ item, index, onVote }) {
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.image}
        />

        <View style={styles.rank}>
          <Text style={styles.rankText}>
            {index + 1}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text
          style={styles.name}
          numberOfLines={1}
        >
          {item.name}
        </Text>

        <Text
          style={styles.category}
          numberOfLines={1}
        >
          {item.category}
        </Text>

        <Text style={styles.votes}>
          {item.votes.toLocaleString()} votes
        </Text>

        <TouchableOpacity
          style={styles.voteButton}
          onPress={onVote}
        >
          <Text style={styles.voteText}>
            Vote
          </Text>

          <View style={styles.separator} />

          <Text style={styles.price}>
            GH₵1
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 190,
    borderRadius: 17,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
    marginRight: 12,
  },

  imageContainer: {
    height: 145,
    position: "relative",
    backgroundColor: COLORS.surfaceLight,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  rank: {
    position: "absolute",
    left: 10,
    top: 10,
    width: 29,
    height: 29,
    borderRadius: 15,
    backgroundColor: COLORS.gold,
    alignItems: "center",
    justifyContent: "center",
  },

  rankText: {
    color: COLORS.black,
    fontWeight: "900",
  },

  content: {
    padding: 12,
  },

  name: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "800",
  },

  category: {
    color: COLORS.textSecondary,
    fontSize: 10,
    marginTop: 4,
  },

  votes: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 9,
  },

  voteButton: {
    height: 37,
    backgroundColor: COLORS.gold,
    borderRadius: 20,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  voteText: {
    color: COLORS.black,
    fontSize: 11,
    fontWeight: "900",
  },

  price: {
    color: COLORS.black,
    fontSize: 11,
    fontWeight: "900",
  },

  separator: {
    width: 1,
    height: 15,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
});