"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { HeroService } from "@/services/hero.service";
import type { HeroSlide } from "@/types/hero";
import { Plus, Edit3, Trash2, Eye, EyeOff, Save, Layers, X, Sparkles } from "lucide-react";
import ImageDropbox from "@/components/image-dropbox";

export default function AdminHeroSlidesPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSlides();

    const handleUpdate = () => {
      loadSlides();
    };

    window.addEventListener("lp_hero_slides_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("lp_hero_slides_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const loadSlides = async () => {
    const data = await HeroService.getAllSlides();
    setSlides(data);
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    await HeroService.updateSlide(id, { active: !currentStatus });
    await loadSlides();
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingSlide) return;
    try {
      setSaving(true);
      const exists = slides.some((s) => s.id === editingSlide.id);
      if (exists) {
        await HeroService.updateSlide(editingSlide.id, editingSlide);
      } else {
        await HeroService.createSlide(editingSlide);
      }
      setEditingSlide(null);
      await loadSlides();
    } catch (err) {
      console.error("Error saving hero slide:", err);
    } finally {
      setSaving(false);
    }
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
                  src={slide.desktopImage || "/images/hero/bengal-latpanchar.jpg.jpeg"}
                  alt={slide.title || "Hero banner"}
                  fill
                  className="object-cover"
                  unoptimized={slide.desktopImage?.startsWith("data:") || slide.desktopImage?.startsWith("blob:")}
                />
                <div
                  className="absolute inset-0 bg-black"
                  style={{ opacity: slide.overlayOpacity }}
                />
                <div className="absolute top-3 left-3 bg-[#C62828] text-white text-[10px] font-accent uppercase font-bold px-3 py-1 rounded-full border border-[#C89D45]/50">
                  {slide.badge}
                </div>
                <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-sm text-[#F3D27A] font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-lg border border-[#C89D45]/40 shadow flex items-center gap-1">
                  <span className="text-[9px] uppercase tracking-wider text-gray-300 font-accent">Order</span>
                  <span>#{slide.displayOrder}</span>
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
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          data-lenis-prevent
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingSlide(null);
          }}
        >
          <form 
            onSubmit={handleSave}
            className="relative w-full max-w-lg bg-[#2C2473] rounded-3xl border border-[#C89D45] shadow-2xl flex flex-col max-h-[90vh] my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#2C2473]">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#C89D45]" />
                <h3 className="font-serif text-2xl font-bold text-white">
                  {slides.some((s) => s.id === editingSlide.id)
                    ? "Edit Hero Slide Banner"
                    : "Add Hero Slide Banner"}
                </h3>
              </div>
              <button 
                type="button" 
                onClick={() => setEditingSlide(null)} 
                className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 custom-scrollbar overscroll-contain">
              <div>
                <label className="text-[10px] font-accent uppercase text-[#C89D45] font-bold block mb-1">
                  Main Headline Title *
                </label>
                <input
                  required
                  type="text"
                  value={editingSlide.title}
                  onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                  placeholder="e.g. Wake Up to Kanchenjunga"
                  className="w-full bg-black/40 border border-[#C89D45]/30 rounded-xl p-2.5 text-xs text-white placeholder-gray-500 focus:border-[#C89D45] focus:outline-none transition-colors"
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
                  placeholder="e.g. Uninterrupted Himalayan vistas at 4,500 ft elevation"
                  className="w-full bg-black/40 border border-[#C89D45]/30 rounded-xl p-2.5 text-xs text-white placeholder-gray-500 focus:border-[#C89D45] focus:outline-none transition-colors"
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
                    placeholder="e.g. Latpanchar, Kurseong"
                    className="w-full bg-black/40 border border-[#C89D45]/30 rounded-xl p-2.5 text-xs text-white placeholder-gray-500 focus:border-[#C89D45] focus:outline-none transition-colors"
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
                    placeholder="e.g. Kanchenjunga View"
                    className="w-full bg-black/40 border border-[#C89D45]/30 rounded-xl p-2.5 text-xs text-white placeholder-gray-500 focus:border-[#C89D45] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Background Image — Drag & Drop + URL */}
              <div className="space-y-2">
                <label className="text-[10px] font-accent uppercase text-[#C89D45] font-bold block">
                  Desktop Background Image *
                </label>

                {/* Drag and Drop Image Box */}
                <ImageDropbox
                  images={editingSlide.desktopImage ? [editingSlide.desktopImage] : []}
                  onChange={(imgs) =>
                    setEditingSlide({ ...editingSlide, desktopImage: imgs[0] || "" })
                  }
                  multiple={false}
                  label="Drop hero slide image here or click to browse"
                />

                {/* Direct Image URL fallback/manual input */}
                <div className="pt-1">
                  <span className="text-[10px] text-gray-400 font-accent block mb-1">
                    Or enter custom Image URL / Path:
                  </span>
                  <input
                    required
                    type="text"
                    value={editingSlide.desktopImage}
                    onChange={(e) =>
                      setEditingSlide({ ...editingSlide, desktopImage: e.target.value })
                    }
                    placeholder="/images/hero/bengal-latpanchar.jpg.jpeg or https://..."
                    className="w-full bg-black/40 border border-[#C89D45]/30 rounded-xl p-2.5 text-xs text-white font-mono placeholder-gray-500 focus:border-[#C89D45] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Dark Overlay Opacity & Live Contrast Preview */}
              <div className="bg-black/30 p-4 rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-accent uppercase text-[#C89D45] font-bold block">
                    Dark Overlay Darkness / Opacity
                  </label>
                  <span className="font-mono text-xs font-bold text-white bg-[#C62828] px-2.5 py-0.5 rounded-lg border border-[#C89D45]/30 shadow">
                    {Math.round((editingSlide.overlayOpacity ?? 0.5) * 100)}% Darkness
                  </span>
                </div>

                {/* Range Slider */}
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={editingSlide.overlayOpacity ?? 0.5}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setEditingSlide({ ...editingSlide, overlayOpacity: val });
                  }}
                  className="w-full h-2.5 bg-black/60 rounded-lg appearance-none cursor-pointer accent-[#C62828]"
                />

                {/* Quick Presets */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-accent uppercase text-gray-400 font-bold mr-1">Presets:</span>
                  {[0.1, 0.3, 0.5, 0.7, 0.85].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setEditingSlide({ ...editingSlide, overlayOpacity: val })}
                      className={`flex-1 py-1 rounded-lg text-[10px] font-accent font-bold transition-all ${
                        Math.abs((editingSlide.overlayOpacity ?? 0.5) - val) < 0.04
                          ? "bg-[#C89D45] text-[#1F1F1F] shadow"
                          : "bg-black/40 text-gray-300 hover:text-white hover:bg-white/10 border border-white/5"
                      }`}
                    >
                      {Math.round(val * 100)}%
                    </button>
                  ))}
                </div>

                {/* Live Mini Preview Box */}
                <div className="relative h-20 rounded-xl overflow-hidden border border-[#C89D45]/30 shadow-inner">
                  {editingSlide.desktopImage && (
                    <Image
                      src={editingSlide.desktopImage}
                      alt="Overlay Preview"
                      fill
                      className="object-cover"
                      unoptimized={editingSlide.desktopImage?.startsWith("data:") || editingSlide.desktopImage?.startsWith("blob:")}
                    />
                  )}
                  <div
                    className="absolute inset-0 bg-black transition-opacity duration-100"
                    style={{ opacity: editingSlide.overlayOpacity ?? 0.5 }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
                    <p className="text-xs font-serif font-bold text-white drop-shadow">
                      {editingSlide.title || "Headline Text Contrast Preview"}
                    </p>
                    <span className="text-[9px] text-[#F3D27A] font-accent mt-0.5">
                      Opacity: {Math.round((editingSlide.overlayOpacity ?? 0.5) * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Number & Text Alignment */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-accent uppercase text-[#C89D45] font-bold block mb-1">
                    Display Order Number *
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    max="99"
                    value={editingSlide.displayOrder ?? 1}
                    onChange={(e) =>
                      setEditingSlide({
                        ...editingSlide,
                        displayOrder: parseInt(e.target.value, 10) || 1,
                      })
                    }
                    placeholder="e.g. 1"
                    className="w-full bg-black/40 border border-[#C89D45]/30 rounded-xl p-2.5 text-xs text-white focus:border-[#C89D45] focus:outline-none transition-colors"
                  />
                  <p className="text-[9px] text-gray-400 mt-1">
                    Slide position order (1 = 1st slide)
                  </p>
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
                    className="w-full bg-black/40 border border-[#C89D45]/30 rounded-xl p-2.5 text-xs text-white focus:border-[#C89D45] focus:outline-none transition-colors"
                  >
                    <option value="left">Left Aligned</option>
                    <option value="center">Centered</option>
                    <option value="right">Right Aligned</option>
                  </select>
                  <p className="text-[9px] text-gray-400 mt-1">
                    Headline & text placement
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-5 border-t border-white/10 flex justify-end gap-3 shrink-0 bg-[#241d61]">
              <button
                type="button"
                onClick={() => setEditingSlide(null)}
                className="px-5 py-2.5 rounded-xl border border-gray-400/50 font-accent text-xs font-bold uppercase text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="bg-[#C62828] hover:bg-[#8B1E1E] text-white px-6 py-2.5 rounded-xl font-accent text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg hover:shadow-red-900/40 disabled:opacity-50"
              >
                <Save className={`w-4 h-4 text-[#C89D45] ${saving ? "animate-spin" : ""}`} />
                <span>{saving ? "Saving Slide..." : "Save Slide"}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
