import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import {
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { castVote } from "../../services/votingService";


import COLORS from "../../constants/colors";
import {
  getCategoryById,
} from "../../services/categoryService";

import {
  getNomineesByCategory,
} from "../../services/nomineeService";

export default function CategoryNomineesScreen() {
  const router = useRouter();

  const { id } = useLocalSearchParams();

  const [category, setCategory] = useState(null);
  const [nominees, setNominees] = useState([]);
  const { user } = useAuth();
  const [voting, setVotion] = useState(false);

  const [loading, setLoading] = useState(true);

  const [selectedNominee, setSelectedNominee] =
    useState(null);

  const [voteQuantity, setVoteQuantity] =
    useState(1);

  useEffect(() => {
    loadCategory();
  }, [id]);

  const loadCategory = async () => {
    try {
      setLoading(true);

      const categoryId = Array.isArray(id)
        ? id[0]
        : id;

      const [categoryData, nomineesData] =
        await Promise.all([
          getCategoryById(categoryId),
          getNomineesByCategory(categoryId),
        ]);

      setCategory(categoryData);
      setNominees(nomineesData);
    } catch (error) {
      console.error(
        "CATEGORY DETAILS ERROR:",
        error
      );

      setCategory(null);
      setNominees([]);
    } finally {
      setLoading(false);
    }
  };

  const openVoteModal = (nominee) => {
    setSelectedNominee(nominee);
    setVoteQuantity(1);
  };

  const closeVoteModal = () => {
    setSelectedNominee(null);
    setVoteQuantity(1);
  };

  const increaseVotes = () => {
    setVoteQuantity(
      (current) => current + 1
    );
  };

  const decreaseVotes = () => {
    setVoteQuantity(
      (current) => Math.max(1, current - 1)
    );
  };

  const totalAmount = voteQuantity * 1;


  const confirmVote = () => {
    if (!selectedNominee || voting) {
      return;
    }

    if (!user?.uid) {
      Alert.alert(
        "Sign in required",
        "Please sign in before casting a vote."
      );
      return;
    }

    Alert.alert(
      "Confirm Vote",
      `You are about to cast ${voteQuantity} ${voteQuantity === 1 ? "vote" : "votes"
      } for ${selectedNominee.name}.\n\nTotal: GH₵${totalAmount.toFixed(2)}`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: async () => {
            if (voting) return;

            setVoting(true);

            try {
              const result = await castVote({
                uid: user.uid,
                nomineeId: selectedNominee.id,
                categoryId: category?.id,
                quantity: voteQuantity,
              });

              await loadCategory();
              closeVoteModal();

              Alert.alert(
                "Vote Successful",
                `${result.votes} ${result.votes === 1 ? "vote has" : "votes have"
                } been cast for ${result.nomineeName}.\n\n` +
                `Amount deducted: GH₵${result.totalAmount.toFixed(2)}\n` +
                `Remaining balance: GH₵${result.newBalance.toFixed(2)}`
              );
            } catch (error) {
              console.error("CAST VOTE ERROR:", error);

              if (error.message === "INSUFFICIENT_BALANCE") {
                Alert.alert(
                  "Insufficient Balance",
                  `You need GH₵${totalAmount.toFixed(2)} to cast these votes. ` +
                  "Please fund your wallet and try again."
                );
              } else if (error.message === "WALLET_NOT_FOUND") {
                Alert.alert(
                  "Wallet Not Found",
                  "Your wallet could not be found. Please contact support."
                );
              } else if (error.message === "NOMINEE_NOT_FOUND") {
                Alert.alert(
                  "Nominee Not Found",
                  "This nominee could not be found. Please refresh the page."
                );
              } else {
                Alert.alert(
                  "Vote Failed",
                  "Your vote could not be completed. Please try again."
                );
              }
            } finally {
              setVoting(false);
            }
          },
        },
      ]
    );
  };

  /*
   * Loading
   */
  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator
          size="large"
          color={COLORS.gold}
        />

        <Text style={styles.loadingScreenText}>
          Loading category...
        </Text>
      </View>
    );
  }

  /*
   * Category not found
   */
  if (!category) {
    return (
      <View style={styles.notFound}>
        <Ionicons
          name="trophy-outline"
          size={50}
          color={COLORS.gold}
        />

        <Text style={styles.notFoundTitle}>
          Category not found
        </Text>

        <TouchableOpacity
          style={styles.backButtonLarge}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonLargeText}>
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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

        <View style={styles.headerInfo}>
          <Text style={styles.eyebrow}>
            GNMA 2027
          </Text>

          <Text
            style={styles.headerTitle}
            numberOfLines={1}
          >
            {category.name}
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Category information */}
        <View style={styles.categoryBanner}>
          <View style={styles.categoryIcon}>
            <Ionicons
              name="trophy-outline"
              size={28}
              color={COLORS.gold}
            />
          </View>

          <View style={styles.categoryBannerInfo}>
            <Text style={styles.categoryName}>
              {category.name}
            </Text>

            <Text style={styles.categorySubtitle}>
              {nominees.length}{" "}
              {nominees.length === 1
                ? "nominee"
                : "nominees"}{" "}
              competing
            </Text>
          </View>
        </View>

        {category.description ? (
          <Text style={styles.categoryDescription}>
            {category.description}
          </Text>
        ) : null}

        <Text style={styles.sectionTitle}>
          All Nominees
        </Text>

        {/* Nominees */}
        {nominees.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="people-outline"
              size={48}
              color={COLORS.muted}
            />

            <Text style={styles.emptyTitle}>
              No nominees yet
            </Text>

            <Text style={styles.emptyText}>
              Nominees for this category will
              appear here.
            </Text>
          </View>
        ) : (
          nominees.map((nominee) => (
            <View
              key={nominee.id}
              style={styles.nomineeCard}
            >
              {nominee.imageUrl ? (
                <Image
                  source={{
                    uri: nominee.imageUrl,
                  }}
                  style={styles.nomineeImage}
                />
              ) : (
                <View
                  style={styles.nomineeImagePlaceholder}
                >
                  <Ionicons
                    name="person"
                    size={42}
                    color={COLORS.muted}
                  />
                </View>
              )}

              <View style={styles.nomineeInfo}>
                <Text style={styles.nomineeName}>
                  {nominee.name}
                </Text>

                <View style={styles.votesRow}>
                  <Ionicons
                    name="trophy-outline"
                    size={14}
                    color={COLORS.gold}
                  />

                  <Text style={styles.votesText}>
                    {Number(
                      nominee.voteCount || 0
                    ).toLocaleString()}{" "}
                    votes
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.voteButton}
                  activeOpacity={0.8}
                  onPress={() =>
                    openVoteModal(nominee)
                  }
                >
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={17}
                    color={COLORS.black}
                  />

                  <Text
                    style={styles.voteButtonText}
                  >
                    Vote
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Vote quantity modal */}
      <Modal
        visible={selectedNominee !== null}
        transparent
        animationType="slide"
        onRequestClose={closeVoteModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeVoteModal}
            >
              <Ionicons
                name="close"
                size={22}
                color={COLORS.white}
              />
            </TouchableOpacity>

            <View style={styles.modalIcon}>
              <Ionicons
                name="trophy"
                size={28}
                color={COLORS.gold}
              />
            </View>

            <Text style={styles.modalHeading}>
              Vote for
            </Text>

            <Text style={styles.modalNominee}>
              {selectedNominee?.name}
            </Text>

            <Text style={styles.modalDescription}>
              Select the number of votes you want
              to cast.
            </Text>

            {/* Vote quantity controls */}
            <View style={styles.quantityRow}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={decreaseVotes}
              >
                <Ionicons
                  name="remove"
                  size={24}
                  color={COLORS.white}
                />
              </TouchableOpacity>

              <View
                style={
                  styles.quantityValueContainer
                }
              >
                <Text
                  style={styles.quantityValue}
                >
                  {voteQuantity}
                </Text>

                <Text
                  style={styles.quantityLabel}
                >
                  {voteQuantity === 1
                    ? "Vote"
                    : "Votes"}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.quantityButton}
                onPress={increaseVotes}
              >
                <Ionicons
                  name="add"
                  size={24}
                  color={COLORS.white}
                />
              </TouchableOpacity>
            </View>

            {/* Total amount */}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                Total Amount
              </Text>

              <Text style={styles.totalAmount}>
                GH₵{totalAmount.toFixed(2)}
              </Text>
            </View>

            <Text style={styles.rateText}>
              1 vote = GH₵1
            </Text>


            <TouchableOpacity
              style={[
                styles.confirmButton,
                voting && { opacity: 0.6 },
              ]}
              onPress={confirmVote}
              disabled={voting}
            >
              {voting ? (
                <ActivityIndicator color={COLORS.black} />
              ) : (
                <>
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={COLORS.black}
                  />

                  <Text style={styles.confirmButtonText}>
                    Confirm Vote
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  loadingScreen: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingScreenText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 12,
  },

  notFound: {
    flex: 1,
    backgroundColor: COLORS.background,
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

  backButtonLarge: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: 25,
    paddingVertical: 13,
    borderRadius: 12,
  },

  backButtonLargeText: {
    color: COLORS.black,
    fontWeight: "800",
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
    marginRight: 12,
  },

  headerInfo: {
    flex: 1,
  },

  eyebrow: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 4,
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

  categoryBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    padding: 16,
    marginBottom: 15,
  },

  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 17,
    backgroundColor: "#241C0D",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  categoryBannerInfo: {
    flex: 1,
  },

  categoryName: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "900",
    lineHeight: 21,
  },

  categorySubtitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 6,
  },

  categoryDescription: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 25,
  },

  sectionTitle: {
    color: COLORS.white,
    fontSize: 21,
    fontWeight: "900",
    marginBottom: 15,
  },

  nomineeCard: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    padding: 12,
    marginBottom: 14,
  },

  nomineeImage: {
    width: 112,
    height: 135,
    borderRadius: 14,
    backgroundColor: COLORS.border,
  },

  nomineeImagePlaceholder: {
    width: 112,
    height: 135,
    borderRadius: 14,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },

  nomineeInfo: {
    flex: 1,
    paddingLeft: 14,
    justifyContent: "space-between",
  },

  nomineeName: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: "900",
    marginTop: 3,
  },

  votesRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  votesText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginLeft: 5,
  },

  voteButton: {
    height: 40,
    backgroundColor: COLORS.gold,
    borderRadius: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },

  voteButtonText: {
    color: COLORS.black,
    fontSize: 13,
    fontWeight: "900",
    marginLeft: 7,
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

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.78)",
  },

  modalContainer: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 24,
    paddingBottom: 35,
  },

  closeButton: {
    position: "absolute",
    top: 18,
    right: 20,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },

  modalIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#241C0D",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 15,
  },

  modalHeading: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: "center",
  },

  modalNominee: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 5,
  },

  modalDescription: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 25,
  },

  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
  },

  quantityButton: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },

  quantityValueContainer: {
    width: 110,
    alignItems: "center",
  },

  quantityValue: {
    color: COLORS.gold,
    fontSize: 32,
    fontWeight: "900",
  },

  quantityLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: -2,
  },

  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 16,
  },

  totalLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },

  totalAmount: {
    color: COLORS.gold,
    fontSize: 23,
    fontWeight: "900",
  },

  rateText: {
    color: COLORS.muted,
    fontSize: 11,
    textAlign: "right",
    marginTop: 7,
    marginBottom: 18,
  },

  confirmButton: {
    height: 54,
    borderRadius: 14,
    backgroundColor: COLORS.gold,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  confirmButtonText: {
    color: COLORS.black,
    fontSize: 15,
    fontWeight: "900",
    marginLeft: 8,
  },
});