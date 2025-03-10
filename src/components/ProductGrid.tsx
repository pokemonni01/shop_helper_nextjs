"use client";

import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { realtimeDB } from "@/lib/firebaseConfig";
import Image from "next/image";
import { useRouter } from "next/router";
import { Product } from "@/types/product";

interface ProductGridProps {
  filterText: string;
}

export default function ProductGrid({ filterText }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
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
            price: typedProduct.price,
            imageUrl: typedProduct.imageUrl,
          };
        });
        setProducts(productList);
      }
    });
    return () => unsubscribe();
  }, []);

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
    <div className="min-h-screen p-4">
      <h2 className="text-xl mb-4">รายการสินค้า</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white text-black p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <div className="relative w-full h-40 mb-2">
              <Image
                src={product.imageUrl}
                alt={product.name_th}
                fill
                className="object-cover rounded-md"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
              />
            </div>
            <div className="h-12 mb-1 flex">
              <h3 className="text-lg font-semibold line-clamp-2">
                {product.name_th}
              </h3>
            </div>
            <p className="text-gray-600 mb-2">
              {Number(product.price).toLocaleString()} THB
            </p>
            <button
              onClick={() => handleEdit(product.id)}
              className="w-full py-1 rounded text-white bg-blue-600 hover:bg-blue-800"
            >
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
