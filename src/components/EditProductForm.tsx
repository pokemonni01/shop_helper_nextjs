"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { addProduct } from "@/lib/addProduct";
import { storage } from "@/lib/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
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
        setImagePreview(reader.result as string); // Set base64 URL as preview
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  // Compress and upload image to Firebase Storage
  const uploadImage = async (file: File): Promise<string> => {
    // Compression options
    const options = {
      maxSizeMB: 1, // Max size in MB (adjust as needed)
      maxWidthOrHeight: 800, // Max width or height in pixels
      useWebWorker: true, // Use web worker for better performance
    };

    // Compress image
    const compressedFile = await imageCompression(file, options);
    console.log("Original size:", file.size / 1024, "KB");
    console.log("Compressed size:", compressedFile.size / 1024, "KB");

    // Generate a random name for the image
    const randomName = uuidv4();
    const fileExtension = file.name.split(".").pop();
    const newFileName = `${randomName}.${fileExtension}`;

    // Upload compressed image with the new random name
    const storageRef = ref(storage, `products/${newFileName}`);
    const snapshot = await uploadBytes(storageRef, compressedFile);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  };

  // Handle form submission
  const handleSubmit = async () => {
    const { name_th, price } = formData;

    if (!name_th || !price || !imageFile) {
      setMessage("Please fill in all fields and select an image.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      setIsUploading(true);
      const imageUrl = await uploadImage(imageFile); // Upload image and get URL
      setIsUploading(false);

      await addProduct({
        name_th,
        price: Number(price),
        imageUrl,
      });

      setMessage("Product edit successfully!");
      setFormData({
        name_th: "",
        price: "",
      });
      setImageFile(null);
      setImagePreview(null);
      router.push("/");
    } catch (error) {
      console.error("Error adding product:", error);
      setMessage("Failed to add product.");
    } finally {
      setIsSubmitting(false);
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
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || isUploading}
          className={`w-full p-2 rounded text-white ${
            isSubmitting || isUploading
              ? "bg-gray-500"
              : "bg-black hover:bg-gray-800"
          }`}
        >
          {isUploading
            ? "Uploading Image..."
            : isSubmitting
            ? "Adding..."
            : "Add Product"}
        </button>
        {message && (
          <p className="text-center text-sm text-red-500">{message}</p>
        )}
      </div>
    </div>
  );
}
