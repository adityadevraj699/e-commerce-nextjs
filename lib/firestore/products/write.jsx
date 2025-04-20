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
    // Reference to the specific order document in Firestore
    const orderRef = doc(db, `orders/${id}`);

    // Update the order status and timestamp
    const timestampStatusUpdate = Timestamp.now();
    const timestampMillis = timestampStatusUpdate.toMillis();  // Convert Timestamp to milliseconds

    await updateDoc(orderRef, {
      status: status,
      timestampStatusUpdate: timestampMillis,  // Store the timestamp as milliseconds
    });

    // Optionally return success message
    return { success: true, message: "Order status updated successfully" };
  } catch (error) {
    // Handle errors during the update
    console.error("Error updating order status:", error);
    throw new Error("Error updating order status: " + error.message);
  }
};
