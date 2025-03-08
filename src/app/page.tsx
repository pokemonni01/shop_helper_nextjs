"use client";

import AddProductForm from "@/components/AddProductForm";
import ProductGrid from "@/components/ProductGrid";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen bg-black text-white p-16">
      <AddProductForm />
      <ProductGrid />
    </main>
  );
}
