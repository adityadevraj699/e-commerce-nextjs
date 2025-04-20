import { db } from "@/lib/firebase";
import { doc, setDoc, Timestamp } from "firebase/firestore";

// Function to create or update a user document in Firestore
export const createUser = async ({ uid, displayName, photoURL }) => {
  if (!uid || !displayName) {
    throw new Error("UID and Display Name are required");
  }

  try {
    await setDoc(
      doc(db, `users/${uid}`),
      {
        displayName: displayName,
        photoURL: photoURL ?? "", // If no photoURL, default to an empty string
        timestampCreate: Timestamp.now(),
      },
      { merge: true } // Merges with existing document if it exists
    );
    return { success: true, message: "User created/updated successfully" };
  } catch (error) {
    throw new Error("Error creating/updating user: " + error.message);
  }
};

// Function to update the user's favorite list in Firestore
export const updateFavorites = async ({ uid, list }) => {
  if (!uid || !Array.isArray(list)) {
    throw new Error("UID and a valid list of favorites are required");
  }

  try {
    await setDoc(
      doc(db, `users/${uid}`),
      { favorites: list },
      { merge: true }
    );
    return { success: true, message: "Favorites updated successfully" };
  } catch (error) {
    throw new Error("Error updating favorites: " + error.message);
  }
};

// Function to update the user's cart in Firestore
export const updateCarts = async ({ uid, list }) => {
  if (!uid || !Array.isArray(list)) {
    throw new Error("UID and a valid list of cart items are required");
  }

  try {
    await setDoc(
      doc(db, `users/${uid}`),
      { carts: list },
      { merge: true }
    );
    return { success: true, message: "Cart updated successfully" };
  } catch (error) {
    throw new Error("Error updating cart: " + error.message);
  }
};
