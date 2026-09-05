import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Himalayan Travel & Birding Journal | The Cometas Homestays Blog",
  description:
    "Guides, seasonal travel tips, birdwatching itineraries, and culture journals from Latpanchar (4,500 ft), Kurseong, and North Bengal.",
  canonicalUrl: "https://thecometas.com/blog",
  keywords: [
    "Latpanchar Travel Guide",
    "Birding in Latpanchar",
    "The Cometas Blog",
    "North Bengal Homestay Guide",
    "Darjeeling Offbeat Travel Stories",
  ],
});

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
