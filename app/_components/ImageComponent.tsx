"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ImageEditSettings } from "@/app/_components/TypeDefinitions";
import { getEditedImageUrl } from "@/app/_components/ApiCall";

export default function ImageEditor() {
  const router = useRouter();
  const { id } = router.query;

  const [settings, setSettings] = useState<ImageEditSettings>(() => {
    // Try to load settings from localStorage
    const savedSettings = localStorage.getItem(`settings-${id}`);
    return savedSettings
      ? JSON.parse(savedSettings)
      : {
          width: 800,
          height: 600,
          grayscale: false,
          blur: 0,
        };
  });

  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    if (id) {
      const newUrl = getEditedImageUrl(id as string, settings);
      setImageUrl(newUrl);
      // Save settings to localStorage
      localStorage.setItem(`settings-${id}`, JSON.stringify(settings));
    }
  }, [id, settings]);

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `edited-image-${id}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Edit Image</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Width</label>
              <input
                type="number"
                value={settings.width}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    width: parseInt(e.target.value),
                  }))
                }
                className="w-full px-3 py-2 border rounded"
                min="1"
                max="2000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Height</label>
              <input
                type="number"
                value={settings.height}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    height: parseInt(e.target.value),
                  }))
                }
                className="w-full px-3 py-2 border rounded"
                min="1"
                max="2000"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.grayscale}
                  onChange={(e) =>
                    setSettings((s) => ({ ...s, grayscale: e.target.checked }))
                  }
                  className="rounded"
                />
                <span className="text-sm font-medium">Grayscale</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Blur (0-10)
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={settings.blur}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, blur: parseInt(e.target.value) }))
                }
                className="w-full"
              />
              <span className="text-sm">{settings.blur}</span>
            </div>

            <button
              onClick={handleDownload}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Download Image
            </button>
          </div>
        </div>

        <div className="relative">
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Preview"
              className="w-full rounded shadow-lg"
            />
          )}
        </div>
      </div>
    </div>
  );
}
