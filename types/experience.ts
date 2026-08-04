export interface Experience {
  id: string;
  title: string;
  slug: string;
  shortDesc: string;
  fullDesc: string;
  duration: string;
  bestTime: string;
  image: string;
  gallery?: string[];
  difficulty?: "Easy Walk" | "Moderate Hike" | "Adventure Trail";
  season?: string;
  displayOrder?: number;
  highlights: string[];
  featured: boolean;
}
