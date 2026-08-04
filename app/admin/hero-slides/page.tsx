"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { HeroService } from "@/services/hero.service";
import type { HeroSlide } from "@/types/hero";
import { Plus, Edit3, Trash2, Eye, EyeOff, Save, Layers } from "lucide-react";

export default function AdminHeroSlidesPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);

  useEffect(() => {
    loadSlides();
  }, []);

  const loadSlides = async () => {
    const data = await HeroService.getAllSlides();
    setSlides(data);
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    await HeroService.updateSlide(id, { active: !currentStatus });
    await loadSlides();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlide) return;
    await HeroService.updateSlide(editingSlide.id, editingSlide);
    setEditingSlide(null);
    await loadSlides();
  };

  const handleDelete = async (id: string) => {
    await HeroService.deleteSlide(id);
    await loadSlides();
  };

  return (
    <div className="space-y-8 text-white">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-accent uppercase tracking-widest text-[#C89D45] font-bold block">
            Homepage Visual Manager
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            Cinematic Hero Banner Manager
          </h1>
        </div>

        <button
          onClick={() =>
            setEditingSlide({
              id: `slide-${Date.now()}`,
              title: "New Himalayan Horizon",
              subtitle: "A luxury boutique homestay experience",
              location: "Latpanchar, Kurseong",
              badge: "Colonial Charm",
              desktopImage: "/images/hero/bengal-latpanchar.jpg.jpeg",
              overlayOpacity: 0.5,
              textAlignment: "left",
              buttonText: "Book Your Stay",
              buttonLink: "/booking",
              active: true,
              displayOrder: slides.length + 1,
            })
          }
          className="bg-[#C62828] hover:bg-[#8B1E1E] text-white px-5 py-2.5 rounded-xl font-accent text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow border border-[#C89D45]/40"
        >
          <Plus className="w-4 h-4 text-[#C89D45]" />
          <span>Add Hero Slide</span>
        </button>
      </div>

      {/* SLIDES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {slides.map((slide) => (
          <div
            key={slide.id}
            className={`bg-[#2C2473] rounded-3xl p-6 border shadow-2xl space-y-4 flex flex-col justify-between transition-all ${
              slide.active ? "border-[#C89D45]/40" : "border-gray-700 opacity-60"
            }`}
          >
            <div className="space-y-3">
              <div className="relative h-48 rounded-2xl overflow-hidden border border-[#C89D45]/30">
                <Image
                  src={slide.desktopImage}
                  alt={slide.title}
                  fill
                  className="object-cover"
                />
                <div
                  className="absolute inset-0 bg-black"
                  style={{ opacity: slide.overlayOpacity }}
                />
                <div className="absolute top-3 left-3 bg-[#C62828] text-white text-[10px] font-accent uppercase font-bold px-3 py-1 rounded-full border border-[#C89D45]/50">
                  {slide.badge}
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-serif font-bold truncate">
                  {slide.title}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-accent uppercase text-[#C89D45] block font-bold">
                  Subtitle & Location
                </span>
                <p className="text-xs font-sans text-gray-200 line-clamp-1">{slide.subtitle}</p>
                <p className="text-[11px] font-sans text-gray-400 mt-0.5">{slide.location}</p>
              </div>

              <div className="flex items-center gap-4 text-xs font-accent text-gray-300">
                <span>Overlay: {slide.overlayOpacity * 100}%</span>
                <span>Align: {slide.textAlignment}</span>
                <span>Order: #{slide.displayOrder}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <button
                onClick={() => toggleActive(slide.id, slide.active)}
                className={`px-3 py-1 rounded-full text-[10px] font-accent font-bold uppercase flex items-center gap-1.5 ${
                  slide.active ? "bg-emerald-600 text-white" : "bg-gray-600 text-white"
                }`}
              >
                {slide.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{slide.active ? "Active" : "Hidden"}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingSlide(slide)}
                  className="p-2 rounded-xl bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(slide.id)}
                  className="p-2 rounded-xl bg-red-600/30 text-red-300 hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT SLIDE MODAL */}
      {editingSlide && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSave}
            className="bg-[#2C2473] rounded-3xl p-6 md:p-8 max-w-lg w-full border border-[#C89D45] space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <h3 className="font-serif text-2xl font-bold text-white">
              Edit Hero Slide Banner
            </h3>

            <div>
              <label className="text-[10px] font-accent uppercase text-[#C89D45] font-bold block mb-1">
                Main Headline Title *
              </label>
              <input
                required
                type="text"
                value={editingSlide.title}
                onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                className="w-full bg-black/40 border border-[#C89D45]/30 rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-[10px] font-accent uppercase text-[#C89D45] font-bold block mb-1">
                Subtitle Description *
              </label>
              <input
                required
                type="text"
                value={editingSlide.subtitle}
                onChange={(e) => setEditingSlide({ ...editingSlide, subtitle: e.target.value })}
                className="w-full bg-black/40 border border-[#C89D45]/30 rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-accent uppercase text-[#C89D45] font-bold block mb-1">
                  Location Sub-Tag
                </label>
                <input
                  type="text"
                  value={editingSlide.location}
                  onChange={(e) => setEditingSlide({ ...editingSlide, location: e.target.value })}
                  className="w-full bg-black/40 border border-[#C89D45]/30 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-accent uppercase text-[#C89D45] font-bold block mb-1">
                  Badge Text
                </label>
                <input
                  type="text"
                  value={editingSlide.badge}
                  onChange={(e) => setEditingSlide({ ...editingSlide, badge: e.target.value })}
                  className="w-full bg-black/40 border border-[#C89D45]/30 rounded-xl p-2.5 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-accent uppercase text-[#C89D45] font-bold block mb-1">
                Desktop Background Image URL *
              </label>
              <input
                required
                type="text"
                value={editingSlide.desktopImage}
                onChange={(e) => setEditingSlide({ ...editingSlide, desktopImage: e.target.value })}
                className="w-full bg-black/40 border border-[#C89D45]/30 rounded-xl p-2.5 text-xs text-white font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-accent uppercase text-[#C89D45] font-bold block mb-1">
                  Dark Overlay Opacity ({Math.round(editingSlide.overlayOpacity * 100)}%)
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="0.9"
                  step="0.05"
                  value={editingSlide.overlayOpacity}
                  onChange={(e) =>
                    setEditingSlide({ ...editingSlide, overlayOpacity: parseFloat(e.target.value) })
                  }
                  className="w-full accent-[#C62828]"
                />
              </div>

              <div>
                <label className="text-[10px] font-accent uppercase text-[#C89D45] font-bold block mb-1">
                  Text Alignment
                </label>
                <select
                  value={editingSlide.textAlignment}
                  onChange={(e) =>
                    setEditingSlide({
                      ...editingSlide,
                      textAlignment: e.target.value as "left" | "center" | "right",
                    })
                  }
                  className="w-full bg-black/40 border border-[#C89D45]/30 rounded-xl p-2.5 text-xs text-white"
                >
                  <option value="left">Left Aligned</option>
                  <option value="center">Centered</option>
                  <option value="right">Right Aligned</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setEditingSlide(null)}
                className="px-4 py-2 rounded-xl border border-gray-400 font-accent text-xs font-bold uppercase"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="bg-[#C62828] hover:bg-[#8B1E1E] text-white px-6 py-2 rounded-xl font-accent text-xs font-bold uppercase tracking-widest flex items-center gap-2"
              >
                <Save className="w-4 h-4 text-[#C89D45]" />
                <span>Save Slide</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
