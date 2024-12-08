"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ImageData } from "@/app/_components/TypeDefinitions";
import { fetchImages } from "@/app/_components/ApiCall";
import Image from "next/image";

export default function ImageGrid() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      setLoading(true);
      const data = await fetchImages(page);
      setImages(data);
      setLoading(false);
      // Save current page to localStorage
      localStorage.setItem("currentPage", page.toString());
    };

    loadImages();
  }, [page]);

  // Restore page from localStorage on mount
  useEffect(() => {
    const savedPage = localStorage.getItem("currentPage");
    if (savedPage) {
      setPage(parseInt(savedPage));
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <Link
                href={`/edit/${image.id}`}
                key={image.id}
                className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <img
                  src={image.download_url}
                  alt={`Photo by ${image.author}`}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                  <p className="text-sm font-medium">{image.author}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
