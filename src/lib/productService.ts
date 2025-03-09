// src/lib/productService.ts
import { realtimeDB } from "./firebaseConfig";
import { ref, get, update } from "firebase/database";
import { Product } from "@/types/product";

// Fetch a single product by ID
export const getProductById = async (productId: string): Promise<Product> => {
  const productRef = ref(realtimeDB, `products/${productId}`);
  const snapshot = await get(productRef);

  if (snapshot.exists()) {
    // Cast the snapshot value to the Product type
    return snapshot.val() as Product;
  } else {
    throw new Error("Product not found");
  }
};

// Update a product by ID
export const updateProduct = async (
  productId: string,
  productData: Product
) => {
  const productRef = ref(realtimeDB, `products/${productId}`);
  await update(productRef, productData);
};
