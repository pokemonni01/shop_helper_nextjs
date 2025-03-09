import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import EditProductForm from "@/components/EditProductForm";
import { getProductById } from "@/lib/productService";
import { Product } from "@/types/product";

export default function EditProductPage() {
  const router = useRouter();
  const { id } = router.query; // Get product ID from the URL
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProduct = async (productId: string) => {
    try {
      const product = await getProductById(productId);
      setProduct(product);
      setError("");
    } catch (err) {
      setError("Failed to load product.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProduct(id as string); // Ensure id is treated as a string
    }
  }, [id]);

  if (loading) return <div className="spinner">Loading...</div>;
  if (error)
    return (
      <div>
        <p>{error}</p>
        <button onClick={() => fetchProduct(id as string)}>Retry</button>
      </div>
    );
  if (!product) return <p>Product not found.</p>;

  return (
    <div>
      <h1>Edit Product</h1>
      <EditProductForm product={product} />
    </div>
  );
}
