import type { Metadata } from "next";

export const siteConfig = {
  name: "The Cometas Homestays",
  description: "A luxury boutique Himalayan retreat and collection of mountain homestays in Latpanchar, North Bengal. Experience colonial Darjeeling charm, monastery-inspired calm, authentic regional hospitality, and breathtaking Kanchenjunga views.",
  url: "https://thecometas.com",
  ogImage: "/images/hero/bengal-latpanchar.jpg.jpeg",
  telephone: "+91 98320 12345",
  telephones: ["+91 98320 12345", "+91 97323 00111", "+91 92427 96931", "+91 76999 93099"],
  email: "stay@lotusparadisehomestay.com",
  address: {
    street: "Upper Latpanchar Forest Road",
    locality: "Latpanchar, Kurseong",
    region: "West Bengal",
    postalCode: "734008",
    country: "India",
  },
  geo: {
    latitude: 26.918,
    longitude: 88.415,
  },
};

export function constructMetadata({
  title = "The Cometas Homestays",
  description = siteConfig.description,
  image = siteConfig.ogImage,
  canonicalUrl = siteConfig.url,
  keywords = [],
}: {
  title?: string;
  description?: string;
  image?: string;
  canonicalUrl?: string;
  keywords?: string[];
} = {}): Metadata {
  const fullKeywords = Array.from(
    new Set([
      "The Cometas Homestays",
      "The Cometas",
      "Lotus Paradise Homestay",
      "Chu & Isultim Homestay",
      "Latpanchar Homestay",
      "Luxury Homestay North Bengal",
      "Kanchenjunga View Homestay",
      "Rufous-necked Hornbill Latpanchar",
      "Mahananda Wildlife Sanctuary Stays",
      "Sittong Orange Village Homestay",
      "Kurseong Hill Station Retreat",
      "Darjeeling Offbeat Homestay",
      "Fooding and Lodging Homestay North Bengal",
      "Himalayan Eco Tourism Bengal",
      ...keywords,
    ])
  );

  return {
    title,
    description,
    keywords: fullKeywords,
    authors: [{ name: "The Cometas Homestays" }],
    creator: "The Cometas Homestays",
    publisher: "The Cometas Himalayan Retreats",
    applicationName: "The Cometas Homestays",
    category: "Travel & Hospitality",
    classification: "Luxury Boutique Homestay & Himalayan Retreat",
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: canonicalUrl,
    },
    formatDetection: {
      email: true,
      address: true,
      telephone: true,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@TheCometas",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    other: {
      "geo.region": "IN-WB",
      "geo.placename": "Latpanchar, Kurseong, Darjeeling District, West Bengal",
      "geo.position": "26.918;88.415",
      "ICBM": "26.918, 88.415",
      "rating": "General",
      "revisit-after": "7 days",
      "distribution": "Global",
    },
  };
}

export function generateHotelSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: siteConfig.name,
    description: siteConfig.description,
    image: siteConfig.ogImage,
    telephone: siteConfig.telephone,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.locality,
      addressRegion: siteConfig.address.region,
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.geo.latitude,
      longitude: siteConfig.geo.longitude,
    },
    url: siteConfig.url,
    priceRange: "₹3,900 - ₹6,500",
    starRating: {
      "@type": "Rating",
      ratingValue: "4.9",
    },
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Kanchenjunga Mountain View" },
      { "@type": "LocationFeatureSpecification", name: "Guided Birdwatching Tours" },
      { "@type": "LocationFeatureSpecification", name: "High-Speed WiFi" },
      { "@type": "LocationFeatureSpecification", name: "Bonfire & Barbecue" },
      { "@type": "LocationFeatureSpecification", name: "Organic Bengali Dining" },
    ],
  };
}
