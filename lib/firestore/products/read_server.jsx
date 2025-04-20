import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";

// Get product by ID
export const getProduct = async ({ id }) => {
  console.log("Fetching product with ID:", id);
  try {
    const data = await getDoc(doc(db, `products/${id}`));
    if (data.exists()) {
      console.log("Product found:", data.data());
      return data.data();
    } else {
      console.log("Product not found for ID:", id);
      return null;
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Error("Error fetching product: " + error.message);
  }
};

// Get featured products
export const getFeaturedProducts = async () => {
  console.log("Fetching featured products...");
  try {
    const list = await getDocs(
      query(collection(db, "products"), where("isFeatured", "==", true))
    );
    const products = list.docs.map((snap) => snap.data());
    console.log("Featured products:", products);
    return products;
  } catch (error) {
    console.error("Error fetching featured products:", error);
    throw new Error("Error fetching featured products: " + error.message);
  }
};

// Get all products ordered by creation timestamp
export const getProducts = async () => {
  console.log("Fetching all products ordered by creation timestamp...");
  try {
    const list = await getDocs(
      query(collection(db, "products"), orderBy("timestampCreate", "desc"))
    );
    const products = list.docs.map((snap) => snap.data());
    console.log("All products:", products);
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Error fetching products: " + error.message);
  }
};

// ✅ Fix applied: where() before orderBy()
export const getProductsByCategory = async ({ categoryId }) => {
  console.log("Fetching products by category with ID:", categoryId);
  try {
    const list = await getDocs(
      query(
        collection(db, "products"),
        where("categoryId", "==", categoryId),
        orderBy("timestampCreate", "desc")
      )
    );
    const products = list.docs.map((snap) => snap.data());
    console.log("Products by category:", products);
    return products;
  } catch (error) {
    console.error("Error fetching products by category:", error);
    throw new Error("Error fetching products by category: " + error.message);
  }
};
