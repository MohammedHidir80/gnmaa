import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";

import {
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "./firebase";

export async function registerPushToken(uid) {
  try {
    // Push notifications require a physical device
    if (!Device.isDevice) {
      console.log(
        "Push notifications require a physical device."
      );
      return null;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } =
        await Notifications.requestPermissionsAsync();

      finalStatus = status;
    }

    // User declined notification permission
    if (finalStatus !== "granted") {
      console.log(
        "Notification permission was not granted."
      );

      return null;
    }

    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      Constants.easConfig?.projectId;

    if (!projectId) {
      console.log(
        "EAS projectId is missing. Skipping push token registration."
      );

      return null;
    }

    const token =
      await Notifications.getExpoPushTokenAsync({
        projectId,
      });

    const pushToken = token.data;

    await updateDoc(
      doc(db, "users", uid),
      {
        pushToken,
        updatedAt: serverTimestamp(),
      }
    );

    console.log(
      "Push token saved:",
      pushToken
    );

    return pushToken;

  } catch (error) {
    // Push registration should NEVER break signup
    console.error(
      "PUSH TOKEN ERROR:",
      error
    );

    return null;
  }
}