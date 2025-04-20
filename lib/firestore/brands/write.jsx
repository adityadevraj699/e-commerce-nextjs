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

// Create new brand
export const createNewBrand = async ({ data, image }) => {
  if (!image) {
    throw new Error("Image is Required");
  }
  if (!data?.name) {
    throw new Error("Name is required");
  }

  const newId = doc(collection(db, `ids`)).id;
  const imageRef = ref(storage, `brands/${newId}`);
  try {
    console.log("Uploading image to Firebase Storage...");
    await uploadBytes(imageRef, image);
    const imageURL = await getDownloadURL(imageRef);
    console.log("Image uploaded successfully, URL:", imageURL);

    const timestampCreate = Timestamp.now().seconds * 1000; // Convert to milliseconds
    console.log("Timestamp created:", timestampCreate);

    await setDoc(doc(db, `brands/${newId}`), {
      ...data,
      id: newId,
      imageURL: imageURL,
      timestampCreate: timestampCreate,
    });
    console.log("Brand created successfully");
  } catch (error) {
    console.error("Error during createNewBrand:", error);
    throw new Error("Error creating brand: " + error.message);
  }
};

// Update brand
export const updateBrand = async ({ data, image }) => {
  if (!data?.name) {
    throw new Error("Name is required");
  }
  if (!data?.id) {
    throw new Error("ID is required");
  }
  const id = data?.id;

  let imageURL = data?.imageURL;

  if (image) {
    const imageRef = ref(storage, `brands/${id}`);
    try {
      console.log("Uploading new image for brand...");
      await uploadBytes(imageRef, image);
      imageURL = await getDownloadURL(imageRef);
      console.log("New image uploaded successfully, URL:", imageURL);
    } catch (error) {
      console.error("Error during image upload:", error);
      throw new Error("Error uploading image: " + error.message);
    }
  }

  const timestampUpdate = Timestamp.now().seconds * 1000; // Convert to milliseconds
  console.log("Timestamp updated:", timestampUpdate);

  try {
    await updateDoc(doc(db, `brands/${id}`), {
      ...data,
      imageURL: imageURL,
      timestampUpdate: timestampUpdate,
    });
    console.log("Brand updated successfully");
  } catch (error) {
    console.error("Error during updateBrand:", error);
    throw new Error("Error updating brand: " + error.message);
  }
};

// Delete brand
export const deleteBrand = async ({ id }) => {
  if (!id) {
    throw new Error("ID is required");
  }
  try {
    console.log("Deleting brand with ID:", id);
    await deleteDoc(doc(db, `brands/${id}`));
    console.log("Brand deleted successfully");
  } catch (error) {
    console.error("Error during deleteBrand:", error);
    throw new Error("Error deleting brand: " + error.message);
  }
};
