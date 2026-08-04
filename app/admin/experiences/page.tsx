"use client";

import React, { useState } from "react";
import Image from "next/image";
import { EXPERIENCES } from "@/lib/data";
import { Plus, Edit3, Trash2, Compass } from "lucide-react";

export default function AdminExperiencesPage() {
  const [experiences, setExperiences] = useState(EXPERIENCES);

  const toggleFeatured = (id: string) => {
    setExperiences(
      experiences.map((exp) => (exp.id === id ? { ...exp, featured: !exp.featured } : exp))
    );
  };

  return (
    <div className="space-y-8 text-white">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-accent uppercase tracking-widest text-[#C89D45] font-bold block">
            Guest Experience Management
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            Signature Experience CRUD Manager
          </h1>
        </div>

        <button
          onClick={() => alert("Add Experience Modal")}
          className="bg-[#C62828] hover:bg-[#8B1E1E] text-white px-5 py-2.5 rounded-xl font-accent text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow border border-[#C89D45]/40"
        >
          <Plus className="w-4 h-4 text-[#C89D45]" />
          <span>Add New Experience</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="bg-[#2C2473] rounded-3xl p-6 border border-[#C89D45]/30 shadow-xl space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="relative h-44 rounded-2xl overflow-hidden border border-[#C89D45]/30">
                <Image
                  src={exp.image}
                  alt={exp.title}
                  fill
                  className="object-cover"
                />
                <span className="absolute top-3 left-3 bg-[#2C2473] text-[#C89D45] text-xs font-accent font-bold px-3 py-1 rounded-full border border-[#C89D45]/50">
                  {exp.duration}
                </span>
              </div>

              <h3 className="font-serif text-xl font-bold text-white">{exp.title}</h3>
              <p className="text-xs font-sans text-gray-300">{exp.fullDesc}</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <button
                onClick={() => toggleFeatured(exp.id)}
                className={`px-3 py-1 rounded-full text-[10px] font-accent font-bold uppercase ${
                  exp.featured ? "bg-emerald-600 text-white" : "bg-gray-600 text-white"
                }`}
              >
                {exp.featured ? "Featured Active" : "Hidden"}
              </button>

              <div className="flex items-center gap-2">
                <button className="p-1.5 rounded-lg bg-indigo-600/40 text-indigo-200 hover:bg-indigo-600">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setExperiences(experiences.filter((e) => e.id !== exp.id))}
                  className="p-1.5 rounded-lg bg-red-600/40 text-red-200 hover:bg-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
