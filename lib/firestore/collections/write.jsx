import { db, storage } from "@/lib/firebase";
import {
  collection,
  deleteDoc,
  doc,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

// Function to create a new collection
export const createNewCollection = async ({ data, image }) => {
  if (!image) {
    throw new Error("Image is Required");
  }
  if (!data?.title) {
    throw new Error("Title is required");
  }
  if (!data?.products || data?.products?.length === 0) {
    throw new Error("At least one product is required");
  }

  try {
    const newId = doc(collection(db, `ids`)).id;
    const imageRef = ref(storage, `collections/${newId}`);
    
    // Upload the image to Firebase storage
    await uploadBytes(imageRef, image);
    const imageURL = await getDownloadURL(imageRef);

    // Add the collection data to Firestore
    await setDoc(doc(db, `collections/${newId}`), {
      ...data,
      id: newId,
      imageURL: imageURL,
      timestampCreate: Timestamp.now(),
    });
  } catch (error) {
    throw new Error("Error creating collection: " + error.message);
  }
};

// Function to update an existing collection
export const updateCollection = async ({ data, image }) => {
  if (!data?.title) {
    throw new Error("Title is required");
  }
  if (!data?.products || data?.products?.length === 0) {
    throw new Error("At least one product is required");
  }
  if (!data?.id) {
    throw new Error("ID is required");
  }

  const id = data?.id;

  let imageURL = data?.imageURL;

  try {
    // If a new image is provided, upload it and get the URL
    if (image) {
      const imageRef = ref(storage, `collections/${id}`);
      await uploadBytes(imageRef, image);
      imageURL = await getDownloadURL(imageRef);
    }

    // Update the collection data in Firestore
    await updateDoc(doc(db, `collections/${id}`), {
      ...data,
      imageURL: imageURL,
      timestampUpdate: Timestamp.now(),
    });
  } catch (error) {
    throw new Error("Error updating collection: " + error.message);
  }
};

// Function to delete a collection
export const deleteCollection = async ({ id }) => {
  if (!id) {
    throw new Error("ID is required");
  }

  try {
    // Delete the collection document from Firestore
    await deleteDoc(doc(db, `collections/${id}`));
  } catch (error) {
    throw new Error("Error deleting collection: " + error.message);
  }
};
