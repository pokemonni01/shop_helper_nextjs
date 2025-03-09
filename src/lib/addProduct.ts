import { realtimeDB } from "@/lib/firebaseConfig";
import { ref, push, set } from "firebase/database";

export const addProduct = async (product: {
  name_th: string;
  price: number;
  imageUrl: string;
}) => {
  const productsRef = ref(realtimeDB, "products");
  const newProductRef = push(productsRef);

  // Save product directly (not as a string)
  await set(newProductRef, {
    ...product,
    createdAt: Date.now(),
  });
};
