export interface RoomImage {
  url: string;
  alt: string;
  order: number;
}

export interface Room {
  id: string;
  title: string;
  slug: string;
  type: string;
  pricePerNight: number;
  capacity: number;
  bedType: string;
  view: string;
  size: string;
  location: string;
  description: string;
  amenities: string[];
  images: RoomImage[];
  featured: boolean;
  available: boolean;
}
