import "../styles/globals.css";
import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";
import { useState, useEffect } from "react";
import debounce from "lodash.debounce";

export default function Home() {
  const [filterText, setFilterText] = useState("");

  const handleFilterChange = debounce((event) => {
    setFilterText(event.target.value);
  }, 500);

  useEffect(() => {
    return () => {
      handleFilterChange.cancel();
    };
  }, []);

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-black text-white p-16">
      <input
        type="text"
        placeholder="Filter products"
        className="mb-4 p-2 rounded text-black"
        onChange={handleFilterChange}
      />
      <ProductGrid filterText={filterText} />
      <Link
        href="/add-product"
        className="fixed bottom-8 right-8 bg-blue-500 text-white w-14 h-14 flex items-center justify-center rounded-full shadow-lg hover:bg-blue-600 text-2xl font-bold"
      >
        +
      </Link>
    </main>
  );
}
