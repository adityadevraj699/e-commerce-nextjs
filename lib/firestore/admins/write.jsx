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

// Convert Timestamp to milliseconds
const getTimestampInMilliseconds = () => {
  return Timestamp.now().seconds * 1000;
};

export const createNewAdmin = async ({ data, image }) => {
  if (!image) {
    throw new Error("Image is Required");
  }
  if (!data?.name) {
    throw new Error("Name is required");
  }
  if (!data?.email) {
    throw new Error("Email is required");
  }

  const newId = data?.email; // Using email as ID

  try {
    const imageRef = ref(storage, `admins/${newId}`);
    await uploadBytes(imageRef, image);
    const imageURL = await getDownloadURL(imageRef);

    await setDoc(doc(db, `admins/${newId}`), {
      ...data,
      id: newId,
      imageURL: imageURL,
      timestampCreate: getTimestampInMilliseconds(),
    });
  } catch (error) {
    throw new Error("Error creating admin: " + error.message);
  }
};

export const updateAdmin = async ({ data, image }) => {
  if (!data?.name) {
    throw new Error("Name is required");
  }
  if (!data?.id) {
    throw new Error("ID is required");
  }
  if (!data?.email) {
    throw new Error("Email is required");
  }

  const id = data?.id;

  let imageURL = data?.imageURL;

  try {
    if (image) {
      const imageRef = ref(storage, `admins/${id}`);
      await uploadBytes(imageRef, image);
      imageURL = await getDownloadURL(imageRef);
    }

    // If ID and email match, update the document, else replace with new ID
    if (id === data?.email) {
      await updateDoc(doc(db, `admins/${id}`), {
        ...data,
        imageURL: imageURL,
        timestampUpdate: getTimestampInMilliseconds(),
      });
    } else {
      const newId = data?.email;
      await deleteDoc(doc(db, `admins/${id}`));

      await setDoc(doc(db, `admins/${newId}`), {
        ...data,
        id: newId,
        imageURL: imageURL,
        timestampUpdate: getTimestampInMilliseconds(),
      });
    }
  } catch (error) {
    throw new Error("Error updating admin: " + error.message);
  }
};

export const deleteAdmin = async ({ id }) => {
  if (!id) {
    throw new Error("ID is required");
  }
  try {
    await deleteDoc(doc(db, `admins/${id}`));
  } catch (error) {
    throw new Error("Error deleting admin: " + error.message);
  }
};
