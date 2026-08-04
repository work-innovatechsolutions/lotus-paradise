"use client";

import React, { useState } from "react";
import Image from "next/image";
import { GALLERY_ITEMS } from "@/lib/data";
import { Upload, Trash2, Edit3, Save, Plus, Tag } from "lucide-react";

export default function AdminGalleryPage() {
  const [items, setItems] = useState(GALLERY_ITEMS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingAlt, setEditingAlt] = useState("");

  const handleSaveAlt = (id: string) => {
    setItems(items.map((item) => (item.id === id ? { ...item, altText: editingAlt } : item)));
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-8 text-white">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-accent uppercase tracking-widest text-[#C89D45] font-bold block">
            Cloudinary & Media Asset Manager
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            Gallery Manager & SEO Alt Text
          </h1>
        </div>

        <button
          onClick={() => alert("Cloudinary / Local Drag & Drop Upload Triggered!")}
          className="bg-[#C62828] hover:bg-[#8B1E1E] text-white px-5 py-2.5 rounded-xl font-accent text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow border border-[#C89D45]/40"
        >
          <Upload className="w-4 h-4 text-[#C89D45]" />
          <span>Upload New Image</span>
        </button>
      </div>

      {/* DRAG & DROP ZONE SIMULATION */}
      <div className="bg-[#2C2473] rounded-3xl p-8 border-2 border-dashed border-[#C89D45]/40 text-center space-y-3 cursor-pointer hover:border-[#C89D45] transition-colors">
        <Upload className="w-10 h-10 text-[#C89D45] mx-auto" />
        <h3 className="font-serif text-xl font-bold">Drag & Drop Media Files Here</h3>
        <p className="text-xs text-gray-300">Supports WebP, AVIF, JPEG, PNG (Auto WebP compression enabled)</p>
      </div>

      {/* GALLERY GRID WITH SEO ALT TEXT EDITORS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-[#2C2473] rounded-2xl overflow-hidden border border-[#C89D45]/30 space-y-4 p-4 shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="relative h-48 rounded-xl overflow-hidden border border-[#C89D45]/30">
                <Image
                  src={item.imageUrl}
                  alt={item.altText || item.title}
                  fill
                  className="object-cover"
                />
                <span className="absolute top-2 left-2 bg-[#C62828] text-white text-[10px] font-accent uppercase font-bold px-2.5 py-0.5 rounded-full">
                  {item.category}
                </span>
              </div>

              <h4 className="font-serif text-lg font-bold text-white">{item.title}</h4>

              {editingId === item.id ? (
                <div className="space-y-2">
                  <label className="text-[10px] font-accent uppercase text-[#C89D45] font-bold block">
                    SEO Alt Text Tag
                  </label>
                  <input
                    type="text"
                    value={editingAlt}
                    onChange={(e) => setEditingAlt(e.target.value)}
                    className="w-full bg-black/40 border border-[#C89D45] rounded-xl p-2 text-xs font-sans text-white"
                  />
                  <button
                    onClick={() => handleSaveAlt(item.id)}
                    className="bg-emerald-600 text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Alt Text
                  </button>
                </div>
              ) : (
                <p className="text-xs font-sans text-gray-300 bg-black/30 p-2.5 rounded-xl border border-white/10 italic">
                  <strong>Alt Tag:</strong> &quot;{item.altText || "No alt text set"}&quot;
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <button
                onClick={() => {
                  setEditingId(item.id);
                  setEditingAlt(item.altText);
                }}
                className="text-xs font-accent text-[#C89D45] hover:text-white flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit Alt Text
              </button>

              <button
                onClick={() => handleDelete(item.id)}
                className="text-xs font-accent text-red-400 hover:text-red-200 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
