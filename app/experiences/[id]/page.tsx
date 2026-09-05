import React from "react";
import Image from "next/image";
import Link from "next/link";
import { EXPERIENCES } from "@/lib/data";
import { notFound } from "next/navigation";
import { Clock, Calendar, ArrowLeft, CheckCircle2, Compass } from "lucide-react";
import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return EXPERIENCES.map((exp) => ({
    id: exp.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const exp = EXPERIENCES.find((e) => e.slug === id || e.id === id);

  if (!exp) {
    return constructMetadata({ title: "Experience | The Cometas Homestays" });
  }

  return constructMetadata({
    title: `${exp.title} | The Cometas Homestays Experiences`,
    description: exp.shortDesc || exp.fullDesc?.slice(0, 160),
    image: exp.image,
    canonicalUrl: `https://thecometas.com/experiences/${exp.slug}`,
    keywords: [exp.title, "Latpanchar Activities", "Himalayan Experiences", "The Cometas"],
  });
}

export default async function ExperienceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const exp = EXPERIENCES.find((e) => e.slug === id || e.id === id);

  if (!exp) {
    notFound();
  }

  return (
    <div className="pt-28 pb-20 max-w-5xl mx-auto px-4 space-y-10">
      <Link
        href="/experiences"
        className="inline-flex items-center gap-2 text-xs font-accent uppercase font-bold text-[#C62828] hover:text-[#2C2473]"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Experiences</span>
      </Link>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-4 text-xs font-accent text-[#C62828] font-bold">
          <span className="flex items-center gap-1.5 bg-[#C62828]/10 px-3 py-1 rounded-full">
            <Clock className="w-3.5 h-3.5 text-[#C89D45]" />
            <span>{exp.duration}</span>
          </span>
          <span className="flex items-center gap-1.5 bg-[#2C2473]/10 px-3 py-1 rounded-full text-[#2C2473]">
            <Calendar className="w-3.5 h-3.5 text-[#C89D45]" />
            <span>{exp.bestTime}</span>
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1F1F1F]">
          {exp.title}
        </h1>

        <p className="font-display text-xl text-[#C62828] italic">
          &quot;{exp.shortDesc}&quot;
        </p>
      </div>

      <div className="relative h-96 sm:h-[450px] rounded-3xl overflow-hidden shadow-2xl border border-[#C89D45]/40">
        <Image
          src={exp.image}
          alt={exp.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="glass-ivory rounded-3xl p-8 border border-[#C89D45] space-y-6">
        <h3 className="font-serif text-2xl font-bold text-[#1F1F1F]">
          Experience Journey & Highlights
        </h3>

        <p className="font-sans text-base text-gray-700 leading-relaxed">
          {exp.fullDesc}
        </p>

        <div className="space-y-2 pt-2 border-t border-[#C89D45]/20">
          <h4 className="text-xs font-accent uppercase text-[#C89D45] font-bold mb-3">Included Highlights</h4>
          {exp.highlights.map((h, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs font-sans font-medium text-[#1F1F1F]">
              <CheckCircle2 className="w-4 h-4 text-[#C62828]" />
              <span>{h}</span>
            </div>
          ))}
        </div>

        <div className="pt-4 flex justify-between items-center">
          <Link
            href="/booking"
            className="bg-[#C62828] hover:bg-[#8B1E1E] text-white px-8 py-3.5 rounded-full font-accent text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg"
          >
            <Compass className="w-4 h-4 text-[#C89D45]" />
            <span>Book Experience Stay</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
