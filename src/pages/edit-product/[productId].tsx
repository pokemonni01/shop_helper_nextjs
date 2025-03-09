import "../../styles/globals.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getProductById, updateProduct } from "@/lib/productService";
import { Product } from "@/types/product";
import EditProductForm from "@/components/EditProductForm";

const EditProductPage = () => {
  const router = useRouter();
  const { productId } = router.query;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        try {
          const productData = await getProductById(productId as string);
          setProduct(productData);
          setLoading(false);
        } catch (err) {
          setError("Failed to fetch product");
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [productId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <EditProductForm product={product!} />
    </div>
  );
};

export default EditProductPage;
