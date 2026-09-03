import type { SiteGeneralSettings, HomepageSectionConfig } from "@/types/settings";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { IdbStorage } from "@/lib/idb-storage";

const SETTINGS_KEY = "lp_general_settings_v1";
const SECTIONS_KEY = "lp_homepage_sections_v1";

const DEFAULT_SETTINGS: SiteGeneralSettings = {
  phone1: "+91 98320 12345",
  phone2: "+91 97323 00111",
  phone3: "+91 92427 96931",
  phone4: "+91 76999 93099",
  whatsappNumber: "+919832012345",
  email: "stay@lotusparadisehomestay.com",
  address: "Upper Latpanchar Forest Road, Kurseong Division, Darjeeling District, West Bengal - 734008",
  mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14238.123456789!2d88.412!3d26.921",
  seoKeywords: "Latpanchar Homestay, Rufous-necked Hornbill, Kanchenjunga View, Sittong Orange Orchards, Darjeeling Retreat",
};

const DEFAULT_SECTIONS: HomepageSectionConfig[] = [
  { id: "hero", name: "Cinematic Hero Banner", enabled: true, order: 1 },
  { id: "weather", name: "Latpanchar Altitude & Weather Widget", enabled: true, order: 2 },
  { id: "properties", name: "Our Mountain Properties", enabled: true, order: 3 },
  { id: "about", name: "Storytelling About Section", enabled: true, order: 4 },
  { id: "whyChooseUs", name: "Why Choose Us Luxury Cards", enabled: true, order: 5 },
  { id: "birds", name: "Mahananda Sanctuary Avian Treasures", enabled: true, order: 6 },
  { id: "seasonal", name: "Seasonal Visit Guide", enabled: true, order: 7 },
  { id: "experiences", name: "Signature Experiences Story Cards", enabled: true, order: 8 },
  { id: "rooms", name: "Luxury Mountain Suites Showcase", enabled: true, order: 9 },
  { id: "corporate", name: "Corporate Offsite Retreat Section", enabled: true, order: 10 },
  { id: "attractions", name: "Nearby Attractions & Interactive Map", enabled: true, order: 11 },
  { id: "gallery", name: "Pinterest Masonry Gallery", enabled: true, order: 12 },
  { id: "testimonials", name: "Google Verified Reviews & Ratings", enabled: true, order: 13 },
  { id: "faq", name: "Frequently Asked Questions Accordion", enabled: true, order: 14 },
];

async function getStoredSettings(): Promise<SiteGeneralSettings> {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const idb = await IdbStorage.get<SiteGeneralSettings>(SETTINGS_KEY);
    if (idb && typeof idb === "object") return idb;
    const raw = IdbStorage.safeLocalGet(SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") return parsed;
    }
  } catch {}
  return DEFAULT_SETTINGS;
}

async function getStoredSections(): Promise<HomepageSectionConfig[]> {
  if (typeof window === "undefined") return DEFAULT_SECTIONS;
  try {
    const idb = await IdbStorage.get<HomepageSectionConfig[]>(SECTIONS_KEY);
    if (Array.isArray(idb) && idb.length > 0) return idb;
    const raw = IdbStorage.safeLocalGet(SECTIONS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return DEFAULT_SECTIONS;
}

export const SettingsService = {
  async getGeneralSettings(): Promise<SiteGeneralSettings> {
    const localSettings = await getStoredSettings();

    try {
      const docRef = doc(db, "siteSettings", "general");
      const fetchPromise = getDoc(docRef);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Firestore timeout")), 4000)
      );

      const snapshot = (await Promise.race([fetchPromise, timeoutPromise])) as any;
      if (snapshot && snapshot.exists()) {
        const firestoreData = snapshot.data() as SiteGeneralSettings;
        if (typeof window !== "undefined") {
          await IdbStorage.set(SETTINGS_KEY, firestoreData);
          IdbStorage.safeLocalSet(SETTINGS_KEY, JSON.stringify(firestoreData));
        }
        return firestoreData;
      } else if (snapshot && !snapshot.exists()) {
        await setDoc(doc(db, "siteSettings", "general"), DEFAULT_SETTINGS);
        return DEFAULT_SETTINGS;
      }
    } catch (err) {
      console.warn("Firestore siteSettings fetch fallback:", err);
    }

    return localSettings;
  },

  async updateGeneralSettings(updated: Partial<SiteGeneralSettings>): Promise<SiteGeneralSettings> {
    const current = await getStoredSettings();
    const nextSettings = { ...current, ...updated, updatedAt: new Date().toISOString() };

    if (typeof window !== "undefined") {
      await IdbStorage.set(SETTINGS_KEY, nextSettings);
      IdbStorage.safeLocalSet(SETTINGS_KEY, JSON.stringify(nextSettings));
      window.dispatchEvent(new Event("lp_settings_updated"));
    }

    try {
      await setDoc(doc(db, "siteSettings", "general"), nextSettings, { merge: true });
    } catch (err) {
      console.warn("Firestore updateGeneralSettings sync:", err);
    }

    return nextSettings;
  },

  async getHomepageSections(): Promise<HomepageSectionConfig[]> {
    const localSections = await getStoredSections();

    try {
      const docRef = doc(db, "homepageSections", "config");
      const fetchPromise = getDoc(docRef);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Firestore timeout")), 4000)
      );

      const snapshot = (await Promise.race([fetchPromise, timeoutPromise])) as any;
      if (snapshot && snapshot.exists()) {
        const data = snapshot.data();
        if (data && Array.isArray(data.sections)) {
          if (typeof window !== "undefined") {
            await IdbStorage.set(SECTIONS_KEY, data.sections);
            IdbStorage.safeLocalSet(SECTIONS_KEY, JSON.stringify(data.sections));
          }
          return data.sections as HomepageSectionConfig[];
        }
      } else if (snapshot && !snapshot.exists()) {
        await setDoc(doc(db, "homepageSections", "config"), { sections: DEFAULT_SECTIONS });
        return DEFAULT_SECTIONS;
      }
    } catch (err) {
      console.warn("Firestore homepageSections fetch fallback:", err);
    }

    return localSections;
  },

  async updateHomepageSections(sections: HomepageSectionConfig[]): Promise<HomepageSectionConfig[]> {
    if (typeof window !== "undefined") {
      await IdbStorage.set(SECTIONS_KEY, sections);
      IdbStorage.safeLocalSet(SECTIONS_KEY, JSON.stringify(sections));
      window.dispatchEvent(new Event("lp_sections_updated"));
    }

    try {
      await setDoc(doc(db, "homepageSections", "config"), { sections }, { merge: true });
    } catch (err) {
      console.warn("Firestore updateHomepageSections sync:", err);
    }

    return sections;
  },
};
