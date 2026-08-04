export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  badge: string;
  desktopImage: string;
  mobileImage?: string;
  video?: string;
  overlayOpacity: number; // 0.1 to 0.9
  textAlignment: "left" | "center" | "right";
  buttonText: string;
  buttonLink: string;
  active: boolean;
  displayOrder: number;
}
