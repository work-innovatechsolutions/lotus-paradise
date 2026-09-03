export interface RoomImage {
  url: string;
  alt: string;
  order: number;
}

export interface Room {
  id: string;
  propertyId?: string;
  title: string;
  slug: string;
  type: string;
  floor?: "Ground Floor" | "First Floor" | string;
  pricePerNight: number;
  standardPricePerPax?: number;
  premiumPricePerPax?: number;
  pricingModel?: "per_pax_food_lodging" | "per_room_night";
  minCapacity?: number;
  capacity: number;
  quantity?: number;
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
