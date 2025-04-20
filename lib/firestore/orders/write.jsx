import { db } from "@/lib/firebase";
import { doc, Timestamp, updateDoc } from "firebase/firestore";

// Function to update the order status
export const updateOrderStatus = async ({ id, status }) => {
  // Check if the necessary parameters are provided
  if (!id) {
    throw new Error("Order ID is required");
  }
  if (!status) {
    throw new Error("Order status is required");
  }

  try {
    // Update the status in the Firestore document
    await updateDoc(doc(db, `orders/${id}`), {
      status: status,
      timestampStatusUpdate: Timestamp.now(),
    });
  } catch (error) {
    // Handle errors during the update
    throw new Error("Error updating order status: " + error.message);
  }
};
