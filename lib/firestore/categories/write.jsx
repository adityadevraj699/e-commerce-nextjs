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

// Create new category
export const createNewCategory = async ({ data, image }) => {
  if (!image) {
    throw new Error("Image is Required");
  }
  if (!data?.name) {
    throw new Error("Name is required");
  }
  if (!data?.slug) {
    throw new Error("Slug is required");
  }

  const newId = doc(collection(db, `ids`)).id;
  const imageRef = ref(storage, `categories/${newId}`);

  try {
    console.log("Uploading image to Firebase Storage...");
    await uploadBytes(imageRef, image);
    const imageURL = await getDownloadURL(imageRef);
    console.log("Image uploaded successfully, URL:", imageURL);

    // Logging the timestamp process
    const timestampCreate = Timestamp.now().seconds * 1000; // Convert to milliseconds
    console.log("Timestamp created:", timestampCreate);

    await setDoc(doc(db, `categories/${newId}`), {
      ...data,
      id: newId,
      imageURL: imageURL,
      timestampCreate: timestampCreate,
    });
    console.log("Category created successfully");
  } catch (error) {
    console.error("Error creating category:", error);
    throw new Error("Error creating category: " + error.message);
  }
};

// Update category
export const updateCategory = async ({ data, image }) => {
  if (!data?.name) {
    throw new Error("Name is required");
  }
  if (!data?.slug) {
    throw new Error("Slug is required");
  }
  if (!data?.id) {
    throw new Error("ID is required");
  }
  const id = data?.id;

  let imageURL = data?.imageURL;

  if (image) {
    const imageRef = ref(storage, `categories/${id}`);
    try {
      console.log("Uploading new image for category...");
      await uploadBytes(imageRef, image);
      imageURL = await getDownloadURL(imageRef);
      console.log("New image uploaded successfully, URL:", imageURL);
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Error uploading image: " + error.message);
    }
  }

  // Logging the timestamp update process
  const timestampUpdate = Timestamp.now().seconds * 1000; // Convert to milliseconds
  console.log("Timestamp updated:", timestampUpdate);

  try {
    await updateDoc(doc(db, `categories/${id}`), {
      ...data,
      imageURL: imageURL,
      timestampUpdate: timestampUpdate,
    });
    console.log("Category updated successfully");
  } catch (error) {
    console.error("Error updating category:", error);
    throw new Error("Error updating category: " + error.message);
  }
};

// Delete category
export const deleteCategory = async ({ id }) => {
  if (!id) {
    throw new Error("ID is required");
  }
  try {
    console.log("Deleting category with ID:", id);
    await deleteDoc(doc(db, `categories/${id}`));
    console.log("Category deleted successfully");
  } catch (error) {
    console.error("Error deleting category:", error);
    throw new Error("Error deleting category: " + error.message);
  }
};
