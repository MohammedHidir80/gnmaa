import {
  doc,
  writeBatch,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
} from "firebase/auth";

import { auth, db } from "./firebase";

export async function signupUser({
  name,
  email,
  phone,
  password,
  
}) {
  const credential =
    await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

  const user = credential.user;

  const userRef = doc(db, "users", user.uid);
  const walletRef = doc(db, "wallets", user.uid);

  const batch = writeBatch(db);

  batch.set(userRef, {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),

    role: "voter",
    status: "active",

    pushToken: "",

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  batch.set(walletRef, {
    balance: 0,
    currency: "GHS",
    status: "active",

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await batch.commit();
  await sendEmailVerification(user);
  return user;
}

export async function loginUser(email, password) {
  const credential =
    await signInWithEmailAndPassword(
      auth,
      email.trim().toLowerCase(),
      password
    );

  return credential.user;
}

export async function logoutUser() {
  await signOut(auth);
}

export async function getUserProfile(uid) {
  const userRef = doc(db, "users", uid);

  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}