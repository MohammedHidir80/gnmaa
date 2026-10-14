
import {
  collection,
  doc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "./firebase";

const VOTE_PRICE = 1; // GH₵1 per vote — demo price

export async function castVote({
  uid,
  nomineeId,
  categoryId,
  quantity,
}) {
  if (!uid) {
    throw new Error("Please sign in before voting.");
  }

  const votes = Number(quantity);

  if (!Number.isInteger(votes) || votes < 1) {
    throw new Error("Please select a valid number of votes.");
  }

  const totalAmount = votes * VOTE_PRICE;

  const walletRef = doc(db, "wallets", uid);
  const nomineeRef = doc(db, "nominees", String(nomineeId));

  // Generate a unique transaction document reference.
  const transactionRef = doc(
    collection(db, "wallets", uid, "transactions")
  );

  return runTransaction(db, async (transaction) => {
    // Read all required documents before writing.
    const walletSnapshot = await transaction.get(walletRef);
    const nomineeSnapshot = await transaction.get(nomineeRef);

    if (!walletSnapshot.exists()) {
      throw new Error("WALLET_NOT_FOUND");
    }

    if (!nomineeSnapshot.exists()) {
      throw new Error("NOMINEE_NOT_FOUND");
    }

    const wallet = walletSnapshot.data();
    const nominee = nomineeSnapshot.data();

    if (nominee.status !== "active") {
      throw new Error("This nominee is not currently accepting votes.");
    }

    const balance = Number(wallet.balance || 0);

    if (balance < totalAmount) {
      throw new Error("INSUFFICIENT_BALANCE");
    }

    const currentVoteCount = Number(nominee.voteCount || 0);

    // 1. Deduct the voting cost.
    transaction.update(walletRef, {
      balance: balance - totalAmount,
      updatedAt: serverTimestamp(),
    });

    // 2. Increase the nominee's vote count.
    transaction.update(nomineeRef, {
      voteCount: currentVoteCount + votes,
    });

    // 3. Record the debit in wallet transaction history.
    transaction.set(transactionRef, {
      type: "vote",
      title: `${votes} ${votes === 1 ? "vote" : "votes"} — ${
        nominee.name || "Nominee"
      }`,
      amount: -totalAmount,
      currency: "GHS",
      status: "success",
      nomineeId: String(nomineeId),
      nomineeName: nominee.name || "Nominee",
      categoryId: String(categoryId || nominee.categoryId || ""),
      voteCount: votes,
      createdAt: serverTimestamp(),
    });

    return {
      votes,
      totalAmount,
      newBalance: balance - totalAmount,
      nomineeName: nominee.name || "Nominee",
    };
  });
}