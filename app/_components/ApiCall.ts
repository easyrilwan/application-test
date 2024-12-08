import { ImageData } from "@/app/_components/TypeDefinitions";

export const fetchImages = async (
  page: number = 1,
  limit: number = 30
): Promise<ImageData[]> => {
  try {
    const response = await fetch(
      `https://picsum.photos/v2/list?page=${page}&limit=${limit}`
    );
    if (!response.ok) throw new Error("Failed to fetch images");
    return response.json();
  } catch (error) {
    console.error("Error fetching images:", error);
    return [];
  }
};

export const getEditedImageUrl = (
  id: string,
  settings: ImageEditSettings
): string => {
  const baseUrl = "https://picsum.photos/id";
  const url = `${baseUrl}/${id}/${settings.width}/${settings.height}`;

  const params = new URLSearchParams();
  if (settings.grayscale) params.append("grayscale", "");
  if (settings.blur > 0) params.append("blur", settings.blur.toString());

  const queryString = params.toString();
  return queryString ? `${url}?${queryString}` : url;
};
