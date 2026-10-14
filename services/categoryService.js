import {
  collection,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";

import { db } from "./firebase";

const categoriesRef = collection(db, "categories");

/*
 * Get all active categories
 */
export async function getCategories() {
  const snapshot = await getDocs(categoriesRef);

  const categories = snapshot.docs
    .map((document) => ({
      id: document.id,
      ...document.data(), 
    }))
    .filter((category) => category.status === "active");

  // Sort by the order saved from the admin dashboard
  categories.sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );

  return categories;
}

/*
 * Get one category by ID
 */
export async function getCategoryById(categoryId) {
  if (!categoryId) {
    return null;
  }

  const categoryRef = doc(
    db,
    "categories",
    String(categoryId)
  );

  const snapshot = await getDoc(categoryRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}