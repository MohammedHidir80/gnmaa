import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "./firebase";

const nomineesRef = collection(db, "nominees");
 
/*
 * Get all active nominees belonging to a category
 */
export async function getNomineesByCategory(categoryId) {
  if (!categoryId) {
    return [];
  }

  const q = query(
    nomineesRef,
    where("categoryId", "==", String(categoryId))
  );

  const snapshot = await getDocs(q);

  const nominees = snapshot.docs
    .map((document) => ({
      id: document.id,
      ...document.data(),
    }))
    .filter((nominee) => nominee.status === "active");

  return nominees;
}

/*
 * Get all active nominees
 */
export async function getNominees() {
  const snapshot = await getDocs(nomineesRef);

  return snapshot.docs
    .map((document) => ({
      id: document.id,
      ...document.data(),
    }))
    .filter((nominee) => nominee.status === "active");
}