import type { Metadata } from "next";

export const siteConfig = {
  name: "Lotus Paradise Homestay",
  description: "A luxury boutique Himalayan homestay in Latpanchar, North Bengal. Experience colonial Darjeeling charm, monastery-inspired calm, authentic Bengali hospitality, and breathtaking Kanchenjunga views.",
  url: "https://lotusparadisehomestay.com",
  ogImage: "/images/hero/bengal-latpanchar.jpg.jpeg",
  telephone: "+91 98320 12345",
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
  title = "Lotus Paradise Homestay | Luxury Himalayan Retreat in Latpanchar",
  description = siteConfig.description,
  image = siteConfig.ogImage,
  canonicalUrl = siteConfig.url,
}: {
  title?: string;
  description?: string;
  image?: string;
  canonicalUrl?: string;
} = {}): Metadata {
  return {
    title,
    description,
    keywords: [
      "Latpanchar Homestay",
      "Luxury Homestay North Bengal",
      "Kanchenjunga View Homestay",
      "Rufous Necked Hornbill Latpanchar",
      "Sittong Orange Village Stay",
      "Boutique Mountain Resort Darjeeling",
      "Corporate Retreat North Bengal",
    ],
    authors: [{ name: "Lotus Paradise Homestay" }],
    creator: "Lotus Paradise Homestay",
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
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
