import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import COLORS from "../../constants/colors";
import { getCategories } from "../../services/categoryService";

export default function CategoriesScreen() {
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);

      const data = await getCategories();

      setCategories(data);
    } catch (error) {
      console.error(
        "CATEGORIES ERROR:",
        error
      );

      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.eyebrow}>
          GNMA 2027
        </Text>

        <Text style={styles.title}>
          Award Categories
        </Text>

        <Text style={styles.description}>
          Explore the categories and vote for
          your favourite nominees.
        </Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color={COLORS.gold}
            />

            <Text style={styles.loadingText}>
              Loading categories...
            </Text>
          </View>
        ) : categories.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="trophy-outline"
              size={50}
              color={COLORS.muted}
            />

            <Text style={styles.emptyTitle}>
              No categories available
            </Text>

            <Text style={styles.emptyText}>
              Award categories will appear here
              when they are published.
            </Text>
          </View>
        ) : (
          categories.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              activeOpacity={0.8}
              onPress={() =>
                router.push({
                  pathname: "/category/[id]",
                  params: {
                    id: item.id,
                  },
                })
              }
            >
              <View style={styles.icon}>
                <Ionicons
                  name="trophy-outline"
                  size={25}
                  color={COLORS.gold}
                />
              </View>

              <View style={styles.info}>
                <Text style={styles.cardTitle}>
                  {item.name}
                </Text>

                {item.description ? (
                  <Text
                    style={styles.descriptionText}
                    numberOfLines={1}
                  >
                    {item.description}
                  </Text>
                ) : (
                  <Text style={styles.nominees}>
                    View nominees
                  </Text>
                )}
              </View>

              <Ionicons
                name="chevron-forward"
                size={20}
                color={COLORS.gold}
              />
            </TouchableOpacity>
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
    padding: 20,
    paddingTop: 60,
    paddingBottom: 110,
  },

  eyebrow: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
  },

  title: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: "900",
    marginTop: 8,
  },

  description: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 25,
  },

  card: {
    minHeight: 80,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 17,
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  icon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#241C0D",
    alignItems: "center",
    justifyContent: "center",
  },

  info: {
    flex: 1,
    marginLeft: 13,
  },

  cardTitle: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "800",
  },

  descriptionText: {
    color: COLORS.textSecondary,
    fontSize: 10,
    marginTop: 5,
  },

  nominees: {
    color: COLORS.gold,
    fontSize: 10,
    marginTop: 5,
  },

  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 70,
  },

  loadingText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 12,
  },

  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 70,
    paddingHorizontal: 25,
  },

  emptyTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "800",
    marginTop: 15,
  },

  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
    marginTop: 8,
  },
});