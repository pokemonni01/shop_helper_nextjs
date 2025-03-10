"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { updateProduct, deleteProduct } from "@/lib/productService";
import { storage } from "@/lib/firebaseConfig";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import imageCompression from "browser-image-compression";
import { AiOutlineClose } from "react-icons/ai";
import { v4 as uuidv4 } from "uuid";
import { Product } from "@/types/product";

interface ProductFormProps {
  product: Product;
}

export default function EditProductForm({ product }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name_th: product.name_th,
    price: product.price.toString(),
  });

  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [isModified, setIsModified] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Check for changes
  useEffect(() => {
    const isFormModified =
      formData.name_th !== product.name_th ||
      formData.price !== product.price.toString() ||
      imageFile !== null;

    setIsModified(isFormModified);
  }, [formData, imageFile, product]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  // Compress and upload image to Firebase Storage
  const uploadImage = async (file: File): Promise<string> => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 800,
      useWebWorker: true,
    };

    const compressedFile = await imageCompression(file, options);

    const randomName = uuidv4();
    const fileExtension = file.name.split(".").pop();
    const newFileName = `${randomName}.${fileExtension}`;

    const storageRef = ref(storage, `products/${newFileName}`);
    const snapshot = await uploadBytes(storageRef, compressedFile);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  };

  // Handle form submission
  const handleSubmit = async () => {
    const { name_th, price } = formData;

    if (!name_th || !price) {
      setMessage("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      setIsUploading(true);
      let imageUrl = product.imageUrl; // Default to current image URL

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }
      setIsUploading(false);

      // Use updateProduct instead of addProduct
      await updateProduct(product.id, {
        ...product,
        name_th,
        price: Number(price),
        imageUrl,
      });

      setMessage("Product updated successfully!");
      router.push("/");
    } catch (error) {
      console.error("Error updating product:", error);
      setMessage("Failed to update product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (productId: string, imageUrl: string) => {
    setIsDeleting(true);
    try {
      console.log("Deleting product with ID:", productId);

      // Delete image from Firebase Storage
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);

      // Delete product from Realtime Database
      await deleteProduct(productId);

      console.log("Product deleted successfully!");
      setMessage("Product deleted successfully!");
      router.push("/");
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg text-black">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Edit Product</h2>
        <button
          onClick={() => router.push("/")}
          className="text-gray-500 hover:text-gray-700 transition-colors bg-transparent border-none outline-none cursor-pointer p-0 m-0"
        >
          <AiOutlineClose size={24} color="black" />
        </button>
      </div>
      <div
        className="w-100 mx-auto relative mb-4"
        style={{ paddingTop: "133.33%" }}
      >
        <Image
          src={imagePreview || product.imageUrl}
          alt="Selected"
          layout="fill"
          objectFit="cover"
          className="rounded"
          unoptimized
        />
      </div>
      <div className="space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="name_th"
          placeholder="Product Name (Thai)"
          value={formData.name_th}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="price"
          placeholder="Price (THB)"
          value={formData.price}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <div className="flex space-x-2 mt-4">
          <button
            onClick={() => handleDelete(product.id, product.imageUrl)}
            disabled={isDeleting}
            className={`w-full p-2 rounded text-white ${
              isDeleting
                ? "bg-red-500 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-800"
            }`}
          >
            {isDeleting ? "Deleting..." : "Delete Product"}
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isModified || isSubmitting || isUploading}
            className={`w-full p-2 rounded text-white ${
              !isModified || isSubmitting || isUploading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-black hover:bg-gray-800"
            }`}
          >
            {isUploading
              ? "Uploading Image..."
              : isSubmitting
              ? "Updating..."
              : "Update Product"}
          </button>
        </div>
        {message && (
          <p className="text-center text-sm text-red-500">{message}</p>
        )}
      </div>
    </div>
  );
}
