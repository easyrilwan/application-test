export interface ImageData {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

export interface ImageEditSettings {
  width: number;
  height: number;
  grayscale: boolean;
  blur: number;
}
