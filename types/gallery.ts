export interface GalleryItem {
  id: string;
  title: string;
  category: "Nature" | "Rooms" | "Food" | "Events" | "Birding" | "Sunrise" | "Guests";
  imageUrl: string;
  altText: string;
  width?: number;
  height?: number;
  blurHash?: string;
  location?: string;
  photographer?: string;
  tags?: string[];
  featured?: boolean;
  uploadedAt?: string;
}
