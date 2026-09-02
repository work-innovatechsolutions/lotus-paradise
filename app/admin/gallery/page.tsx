"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { GalleryService } from "@/services/gallery.service";
import type { GalleryItem } from "@/types/gallery";
import {
  Upload,
  Trash2,
  Edit3,
  Save,
  Tag,
  Check,
  X,
  Filter,
  Plus,
  Loader2,
} from "lucide-react";

const GALLERY_CATEGORIES: Array<GalleryItem["category"]> = [
  "Nature",
  "Birding",
  "Food",
  "Rooms",
  "Events",
  "Sunrise",
  "Guests",
];

const CATEGORY_COLORS: Record<string, string> = {
  Nature: "bg-emerald-600 border-emerald-400/50 text-white",
  Birding: "bg-amber-600 border-amber-400/50 text-white",
  Food: "bg-orange-600 border-orange-400/50 text-white",
  Rooms: "bg-blue-600 border-blue-400/50 text-white",
  Events: "bg-purple-600 border-purple-400/50 text-white",
  Sunrise: "bg-rose-600 border-rose-400/50 text-white",
  Guests: "bg-teal-600 border-teal-400/50 text-white",
};

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [uploadCategory, setUploadCategory] = useState<GalleryItem["category"]>("Nature");

  // Inline / Modal Edit State
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState<GalleryItem["category"]>("Nature");
  const [editAlt, setEditAlt] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  // Upload State
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await GalleryService.getAllItems();
      setItems(data);
    }
    load();

    const handleUpdate = () => {
      load();
    };

    window.addEventListener("lp_gallery_updated", handleUpdate);
    return () => window.removeEventListener("lp_gallery_updated", handleUpdate);
  }, []);

  const openEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setEditTitle(item.title);
    setEditCategory(item.category);
    setEditAlt(item.altText || "");
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setSavingEdit(true);

    try {
      await GalleryService.updateItem(editingItem.id, {
        title: editTitle,
        category: editCategory,
        altText: editAlt,
      });
      setEditingItem(null);
    } catch (err) {
      console.error("Failed to update gallery item:", err);
    } finally {
      setSavingEdit(false);
    }
  };

  const handleQuickCategoryChange = async (
    id: string,
    newCategory: GalleryItem["category"]
  ) => {
    try {
      await GalleryService.updateItemCategory(id, newCategory);
    } catch (err) {
      console.error("Failed to update category:", err);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      await GalleryService.deleteItem(id);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);

    try {
      const { compressImageToWebP } = await import("@/lib/image-compressor");
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        const webpUrl = await compressImageToWebP(file, {
          maxDimension: 1200,
          quality: 0.72,
          maxSizeBytes: 180 * 1024,
        });

        const nameWithoutExt = file.name
          .replace(/\.[^/.]+$/, "")
          .replace(/[-_]/g, " ");
        const title =
          nameWithoutExt.charAt(0).toUpperCase() + nameWithoutExt.slice(1);

        await GalleryService.createItem({
          title: title || `${uploadCategory} Photo`,
          category: uploadCategory,
          imageUrl: webpUrl,
          altText: title || `${uploadCategory} at Lotus Paradise Latpanchar`,
          width: 1200,
          height: 800,
          location: "Latpanchar, North Bengal",
          photographer: "Lotus Paradise Desk",
          tags: [uploadCategory.toLowerCase(), "latpanchar", "himalayas"],
          featured: true,
        });
      }
    } catch (err) {
      console.error("Gallery upload error:", err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const filteredItems =
    activeFilter === "All"
      ? items
      : items.filter(
          (item) => item.category.toLowerCase() === activeFilter.toLowerCase()
        );

  return (
    <div className="space-y-8 text-white">
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-accent uppercase tracking-widest text-[#C89D45] font-bold block">
            Media & Visual Asset Management
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            Gallery & Category Manager
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            {items.length} photo{items.length !== 1 ? "s" : ""} synced with Firestore
          </p>
        </div>

        {/* UPLOAD TRIGGER WITH CATEGORY SELECTOR */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-[#2C2473] px-3 py-2 rounded-xl border border-[#C89D45]/40">
            <span className="text-xs font-accent uppercase text-[#C89D45] font-bold">
              Upload As:
            </span>
            <select
              value={uploadCategory}
              onChange={(e) =>
                setUploadCategory(e.target.value as GalleryItem["category"])
              }
              className="bg-[#1B1647] text-white text-xs font-bold rounded-lg px-2.5 py-1 border border-white/20 focus:border-[#C89D45] outline-none cursor-pointer"
            >
              {GALLERY_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="bg-[#C62828] hover:bg-[#8B1E1E] text-white px-5 py-2.5 rounded-xl font-accent text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow border border-[#C89D45]/40 transition-colors"
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 text-[#C89D45] animate-spin" />
            ) : (
              <Upload className="w-4 h-4 text-[#C89D45]" />
            )}
            <span>{uploading ? "Compressing WebP..." : `Upload to ${uploadCategory}`}</span>
          </button>
        </div>
      </div>

      {/* ── DRAG & DROP UPLOAD ZONE ── */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="bg-[#2C2473] rounded-3xl p-8 border-2 border-dashed border-[#C89D45]/40 text-center space-y-3 cursor-pointer hover:border-[#C89D45] hover:bg-[#2C2473]/80 transition-all group"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileUpload}
        />
        <div className="w-12 h-12 rounded-full bg-[#C89D45]/15 border border-[#C89D45]/30 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
          {uploading ? (
            <Loader2 className="w-6 h-6 text-[#C89D45] animate-spin" />
          ) : (
            <Upload className="w-6 h-6 text-[#C89D45]" />
          )}
        </div>
        <h3 className="font-serif text-xl font-bold">
          {uploading
            ? "Processing & Compressing Images to WebP..."
            : `Click or Drop Images Here to Upload into "${uploadCategory}"`}
        </h3>
        <p className="text-xs text-gray-300">
          Auto WebP compression enabled · Keeps payload &lt; 200KB per image for instant Firestore load
        </p>
      </div>

      {/* ── CATEGORY FILTER TABS ── */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-b border-white/10 pb-4">
        <span className="text-xs font-accent uppercase tracking-wider text-[#C89D45] font-bold flex items-center gap-1 mr-2">
          <Filter className="w-3.5 h-3.5" /> Filter:
        </span>
        <button
          onClick={() => setActiveFilter("All")}
          className={`px-4 py-1.5 rounded-full text-xs font-accent font-bold uppercase transition-all ${
            activeFilter === "All"
              ? "bg-[#C89D45] text-[#1F1F1F] shadow-lg shadow-[#C89D45]/30 font-extrabold"
              : "bg-[#2C2473] text-gray-300 hover:text-white border border-white/10"
          }`}
        >
          All ({items.length})
        </button>

        {GALLERY_CATEGORIES.map((cat) => {
          const count = items.filter(
            (i) => i.category.toLowerCase() === cat.toLowerCase()
          ).length;
          return (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-accent font-bold uppercase transition-all flex items-center gap-1.5 ${
                activeFilter === cat
                  ? `${CATEGORY_COLORS[cat] || "bg-[#C62828]"} shadow-lg font-extrabold border`
                  : "bg-[#2C2473] text-gray-300 hover:text-white border border-white/10"
              }`}
            >
              <span>{cat}</span>
              <span className="text-[10px] opacity-75">({count})</span>
            </button>
          );
        })}
      </div>

      {/* ── GALLERY GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const badgeColor =
            CATEGORY_COLORS[item.category] || "bg-[#C62828] text-white";

          return (
            <div
              key={item.id}
              className="bg-[#2C2473] rounded-2xl overflow-hidden border border-[#C89D45]/30 space-y-4 p-4 shadow-xl flex flex-col justify-between group hover:border-[#C89D45] transition-all"
            >
              <div className="space-y-3">
                {/* IMAGE & CATEGORY SELECTOR BADGE */}
                <div className="relative h-52 rounded-xl overflow-hidden border border-[#C89D45]/30">
                  <Image
                    src={item.imageUrl}
                    alt={item.altText || item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized={item.imageUrl?.startsWith("data:")}
                  />

                  {/* QUICK INLINE CATEGORY SELECTOR BADGE */}
                  <div className="absolute top-2.5 left-2.5 z-10">
                    <select
                      value={item.category}
                      onChange={(e) =>
                        handleQuickCategoryChange(
                          item.id,
                          e.target.value as GalleryItem["category"]
                        )
                      }
                      title="Click to change image category"
                      className={`text-[11px] font-accent uppercase font-bold px-3 py-1 rounded-full border shadow-md cursor-pointer outline-none transition-all ${badgeColor}`}
                    >
                      {GALLERY_CATEGORIES.map((c) => (
                        <option
                          key={c}
                          value={c}
                          className="bg-[#1F1F1F] text-white"
                        >
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* TITLE & ALT TAG */}
                <div>
                  <h4 className="font-serif text-lg font-bold text-white line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-[11px] font-sans text-gray-300 bg-black/40 p-2 rounded-lg border border-white/10 mt-2 line-clamp-2">
                    <strong className="text-[#C89D45]">Alt Tag:</strong> &quot;
                    {item.altText || "No alt text set"}&quot;
                  </p>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <button
                  onClick={() => openEdit(item)}
                  className="text-xs font-accent text-[#C89D45] hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/30 hover:bg-black/60 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit Details
                </button>

                <button
                  onClick={() => handleDelete(item.id, item.title)}
                  className="text-xs font-accent text-red-400 hover:text-red-200 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-900/20 hover:bg-red-900/50 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── EDIT MODAL ── */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E194D] border border-[#C89D45]/40 rounded-3xl w-full max-w-lg p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#C89D45]" />
                <h3 className="font-serif text-xl font-bold text-white">
                  Edit Gallery Image & Category
                </h3>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1 rounded-full text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              {/* IMAGE PREVIEW */}
              <div className="relative h-44 rounded-2xl overflow-hidden border border-[#C89D45]/30">
                <Image
                  src={editingItem.imageUrl}
                  alt={editingItem.title}
                  fill
                  className="object-cover"
                  unoptimized={editingItem.imageUrl?.startsWith("data:")}
                />
              </div>

              {/* TITLE */}
              <div>
                <label className="text-xs font-accent uppercase text-[#C89D45] font-bold block mb-1">
                  Image Title
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#C89D45] outline-none"
                />
              </div>

              {/* CATEGORY DROPDOWN */}
              <div>
                <label className="text-xs font-accent uppercase text-[#C89D45] font-bold block mb-1">
                  Category
                </label>
                <select
                  value={editCategory}
                  onChange={(e) =>
                    setEditCategory(e.target.value as GalleryItem["category"])
                  }
                  className="w-full bg-[#16123D] border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#C89D45] outline-none cursor-pointer"
                >
                  {GALLERY_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* SEO ALT TEXT */}
              <div>
                <label className="text-xs font-accent uppercase text-[#C89D45] font-bold block mb-1">
                  SEO Alt Text Tag
                </label>
                <input
                  type="text"
                  required
                  value={editAlt}
                  onChange={(e) => setEditAlt(e.target.value)}
                  placeholder="e.g. Delicious Bengali Egg Curry & Rice at Lotus Paradise Homestay"
                  className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#C89D45] outline-none"
                />
              </div>

              {/* ACTIONS */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-5 py-2.5 rounded-xl border border-white/20 text-gray-300 hover:text-white font-accent text-xs uppercase font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="bg-[#C62828] hover:bg-[#8B1E1E] text-white px-6 py-2.5 rounded-xl font-accent text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow border border-[#C89D45]/40"
                >
                  <Save className="w-4 h-4 text-[#C89D45]" />
                  <span>{savingEdit ? "Saving Changes..." : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
