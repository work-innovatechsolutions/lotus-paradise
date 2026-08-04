"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { EXPERIENCES } from "@/lib/data";
import { Clock, Calendar, ArrowRight, CheckCircle2 } from "lucide-react";

export default function ExperienceStoryCard() {
  return (
    <section className="py-24 bg-[#FBF8F3] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-20">
          <span className="text-xs font-accent uppercase tracking-widest text-[#C62828] font-bold">
            Curated Himalayan Moments
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#1F1F1F]">
            Signature Experiences
          </h2>
          <p className="font-display text-lg text-gray-600 italic">
            Don&apos;t just visit Latpanchar—immerse yourself in stories, rare flora & fauna, local harvests, and starlit bonfires.
          </p>
        </div>

        {/* ALTERNATING STORY CARDS */}
        <div className="space-y-24">
          {EXPERIENCES.map((exp, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={exp.id}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-center ${
                  isEven ? "" : "lg:flex-row-reverse"
                }`}
              >
                {/* LARGE FULL-WIDTH IMAGE CANVAS */}
                <div
                  className={`lg:col-span-7 relative rounded-3xl overflow-hidden shadow-2xl border border-[#C89D45]/30 group h-[420px] sm:h-[480px] ${
                    isEven ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <Image
                    src={exp.image}
                    alt={exp.title}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-[0.9]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                  <div className="absolute top-6 left-6 flex items-center gap-2">
                    <span className="bg-[#2C2473] text-white text-xs font-accent font-semibold px-3 py-1 rounded-full border border-[#C89D45]/50 shadow-md">
                      Signature Story #{index + 1}
                    </span>
                  </div>
                </div>

                {/* STORY CONTENT */}
                <div
                  className={`lg:col-span-5 space-y-6 ${
                    isEven ? "lg:order-2" : "lg:order-1"
                  }`}
                >
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

                  <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#1F1F1F] leading-tight">
                    {exp.title}
                  </h3>

                  <p className="font-display text-lg text-[#C62828] italic">
                    &quot;{exp.shortDesc}&quot;
                  </p>

                  <p className="font-sans text-sm text-gray-700 leading-relaxed">
                    {exp.fullDesc}
                  </p>

                  {/* HIGHLIGHTS */}
                  <div className="space-y-2 pt-2">
                    {exp.highlights.map((item, hIdx) => (
                      <div key={hIdx} className="flex items-center gap-2 text-xs font-sans text-[#1F1F1F] font-medium">
                        <CheckCircle2 className="w-4 h-4 text-[#C89D45] shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4">
                    <Link
                      href={`/experiences/${exp.slug}`}
                      className="inline-flex items-center gap-2 bg-[#2C2473] hover:bg-[#1F1F1F] text-white px-7 py-3 rounded-full font-accent text-xs font-bold uppercase tracking-widest transition-all shadow-md border border-[#C89D45]/40"
                    >
                      <span>Discover Story</span>
                      <ArrowRight className="w-4 h-4 text-[#C89D45]" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
