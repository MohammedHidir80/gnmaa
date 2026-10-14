import {
    collection,
    getDocs,
    query,
    where,
    doc,
    getDoc,
} from "firebase/firestore";

import { db } from "./firebase";

const eventsRef = collection(db, "events");

export async function getPublishedEvents() {
    const q = query(
        eventsRef,
        where("status", "==", "published")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
}

export async function getEventById(id) {
    const eventRef = doc(db, "events", id);

    const snapshot = await getDoc(eventRef);

    if (!snapshot.exists()) {
        return null;
    }

    return {
        id: snapshot.id,
        ...snapshot.data(),
    };
}