import type { SiteGeneralSettings, HomepageSectionConfig } from "@/types/settings";

let generalSettings: SiteGeneralSettings = {
  phone1: "+91 98320 12345",
  phone2: "+91 94340 67890",
  whatsappNumber: "+919832012345",
  email: "stay@lotusparadisehomestay.com",
  address: "Upper Latpanchar Forest Road, Kurseong Division, Darjeeling District, West Bengal - 734008",
  mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14238.123456789!2d88.412!3d26.921",
  seoKeywords: "Latpanchar Homestay, Rufous-necked Hornbill, Kanchenjunga View, Sittong Orange Orchards",
};

let homepageSections: HomepageSectionConfig[] = [
  { id: "hero", name: "Cinematic Hero Banner", enabled: true, order: 1 },
  { id: "weather", name: "Latpanchar Altitude & Weather Widget", enabled: true, order: 2 },
  { id: "about", name: "Storytelling About Section", enabled: true, order: 3 },
  { id: "whyChooseUs", name: "Why Choose Us Luxury Cards", enabled: true, order: 4 },
  { id: "birds", name: "Mahananda Sanctuary Avian Treasures", enabled: true, order: 5 },
  { id: "seasonal", name: "Seasonal Visit Guide", enabled: true, order: 6 },
  { id: "experiences", name: "Signature Experiences Story Cards", enabled: true, order: 7 },
  { id: "rooms", name: "Luxury Mountain Suites Showcase", enabled: true, order: 8 },
  { id: "corporate", name: "Corporate Offsite Retreat Section", enabled: true, order: 9 },
  { id: "attractions", name: "Nearby Attractions & Interactive Map", enabled: true, order: 10 },
  { id: "gallery", name: "Pinterest Masonry Gallery", enabled: true, order: 11 },
  { id: "testimonials", name: "Google Verified Reviews & Ratings", enabled: true, order: 12 },
  { id: "faq", name: "Frequently Asked Questions Accordion", enabled: true, order: 13 },
];

export const SettingsService = {
  async getGeneralSettings(): Promise<SiteGeneralSettings> {
    return { ...generalSettings };
  },

  async updateGeneralSettings(updated: Partial<SiteGeneralSettings>): Promise<SiteGeneralSettings> {
    generalSettings = { ...generalSettings, ...updated };
    return { ...generalSettings };
  },

  async getHomepageSections(): Promise<HomepageSectionConfig[]> {
    return [...homepageSections].sort((a, b) => a.order - b.order);
  },

  async updateHomepageSections(sections: HomepageSectionConfig[]): Promise<HomepageSectionConfig[]> {
    homepageSections = [...sections];
    return [...homepageSections];
  },
};
