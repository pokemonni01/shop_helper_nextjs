"use client";

import { useState, useEffect } from "react";
import { ref, onValue, remove } from "firebase/database";
import { realtimeDB, storage } from "@/lib/firebaseConfig";
import { deleteObject, ref as storageRef } from "firebase/storage";
import Image from "next/image";
import { useRouter } from "next/router";
import { Product } from "@/types/product";

interface ProductGridProps {
  filterText: string;
}

export default function ProductGrid({ filterText }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const productsRef = ref(realtimeDB, "products");
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const productList = Object.entries(data).map(([id, product]) => {
          const typedProduct = product as Product;
          return {
            id: id,
            name_th: typedProduct.name_th,
            name_en: typedProduct.name_en,
            price: typedProduct.price,
            imageUrl: typedProduct.imageUrl,
          };
        });
        setProducts(productList);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (productId: string, imageUrl: string) => {
    setIsDeleting(true);
    try {
      console.log("Deleting product with ID:", productId);
      // Delete product from Realtime Database
      const productRef = ref(realtimeDB, `products/${productId}`);
      await remove(productRef);

      // Delete image from Firebase Storage
      const imageRef = storageRef(storage, imageUrl);
      await deleteObject(imageRef);

      // Update local state to remove the deleted product
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );

      console.log("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (productId: string) => {
    console.log("Editing product with ID:", productId);
    router.push(`/edit-product/${productId}`);
  };

  // Filter products based on filterText
  const filteredProducts = products.filter((product) =>
    product.name_th.toLowerCase().includes(filterText.toLowerCase())
  );
  console.log("filteredProducts:", filteredProducts);
  return (
    <div className="h-screen overflow-hidden">
      <h2 className="text-xl text-white mb-4">รายการสินค้า</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white text-black p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <div className="relative w-full h-40 mb-2">
              <Image
                src={product.imageUrl}
                alt={product.name_en}
                fill
                className="object-cover rounded-md"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
              />
            </div>
            <h3 className="text-lg font-semibold mb-1">
              {product.name_th} / {product.name_en}
            </h3>
            <p className="text-gray-600 mb-2">{product.price} THB</p>
            <div className="flex space-x-2">
              <button
                onClick={() => handleDelete(product.id, product.imageUrl)}
                className="w-full py-1 rounded text-white bg-red-600 hover:bg-red-800"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={() => handleEdit(product.id)}
                className="w-full py-1 rounded text-white bg-blue-600 hover:bg-blue-800"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
