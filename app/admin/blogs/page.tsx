"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { BlogService } from "@/services/blog.service";
import type { BlogArticle } from "@/lib/data";
import ImageDropbox from "@/components/image-dropbox";
import {
  Plus,
  Edit3,
  Trash2,
  BookOpen,
  Calendar,
  Clock,
  ExternalLink,
  X,
  Save,
  Tag,
  FileText,
} from "lucide-react";

const BLANK_BLOG: Omit<BlogArticle, "id"> = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  category: "Birding Guide",
  readTime: "5 min read",
  publishedAt: new Date().toISOString().slice(0, 10),
};

const CATEGORIES = [
  "Birding Guide",
  "Travel Tips",
  "Corporate Retreats",
  "Nature & Wildlife",
  "Local Culture",
  "Seasonal Guides",
];

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogArticle[]>([]);
  const [modalOpen, setModalOpen] = useState<"create" | "edit" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<BlogArticle, "id">>(BLANK_BLOG);
  const [coverImages, setCoverImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    const data = await BlogService.getAllBlogs();
    setBlogs(data);
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => {
      loadData();
    };

    window.addEventListener("lp_blogs_updated", handleUpdate);
    return () => window.removeEventListener("lp_blogs_updated", handleUpdate);
  }, []);

  const openCreate = () => {
    setForm(BLANK_BLOG);
    setCoverImages([]);
    setEditingId(null);
    setModalOpen("create");
  };

  const openEdit = (blog: BlogArticle) => {
    setEditingId(blog.id);
    setForm({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      coverImage: blog.coverImage,
      category: blog.category,
      readTime: blog.readTime,
      publishedAt: blog.publishedAt,
    });
    setCoverImages(blog.coverImage ? [blog.coverImage] : []);
    setModalOpen("edit");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const finalData: Omit<BlogArticle, "id"> = {
        ...form,
        coverImage:
          coverImages[0] ||
          form.coverImage ||
          "/images/hero/bengal-latpanchar.jpg.jpeg",
      };

      if (modalOpen === "create") {
        await BlogService.createBlog(finalData);
      } else if (modalOpen === "edit" && editingId) {
        await BlogService.updateBlog(editingId, finalData);
      }
      setModalOpen(null);
    } catch (err) {
      console.error("Failed to save blog:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      await BlogService.deleteBlog(id);
    }
  };

  return (
    <div className="space-y-8 text-white">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-accent uppercase tracking-widest text-[#C89D45] font-bold block">
            Content & Editorial Management
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            Blog & Article Manager
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            {blogs.length} article{blogs.length !== 1 ? "s" : ""} published to Firestore
          </p>
        </div>

        <button
          onClick={openCreate}
          className="bg-[#C62828] hover:bg-[#8B1E1E] text-white px-5 py-2.5 rounded-xl font-accent text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow border border-[#C89D45]/40 transition-colors"
        >
          <Plus className="w-4 h-4 text-[#C89D45]" />
          <span>Write New Article</span>
        </button>
      </div>

      {/* BLOGS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-[#2C2473] rounded-3xl p-6 border border-[#C89D45]/30 shadow-xl space-y-4 flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="relative h-44 rounded-2xl overflow-hidden border border-[#C89D45]/30">
                <Image
                  src={blog.coverImage || "/images/hero/bengal-latpanchar.jpg.jpeg"}
                  alt={blog.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized={blog.coverImage?.startsWith("data:")}
                />
                <span className="absolute top-3 left-3 bg-[#C62828] text-white text-[10px] font-accent uppercase font-bold px-2.5 py-1 rounded-full shadow">
                  {blog.category}
                </span>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-gray-300">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#C89D45]" />
                  {blog.publishedAt}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#C89D45]" />
                  {blog.readTime}
                </span>
              </div>

              <h3 className="font-serif text-lg font-bold text-white line-clamp-2">
                {blog.title}
              </h3>
              <p className="text-xs font-sans text-gray-300 line-clamp-3">
                {blog.excerpt}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <Link
                href={`/blog/${blog.slug}`}
                target="_blank"
                className="text-xs font-accent text-[#C89D45] hover:text-white flex items-center gap-1"
              >
                <span>View Live</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEdit(blog)}
                  className="p-2 rounded-xl bg-indigo-600/40 text-indigo-200 hover:bg-indigo-600 transition-colors"
                  title="Edit Article"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(blog.id, blog.title)}
                  className="p-2 rounded-xl bg-red-600/40 text-red-200 hover:bg-red-600 transition-colors"
                  title="Delete Article"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#1E194D] border border-[#C89D45]/40 rounded-3xl w-full max-w-2xl p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#C89D45]" />
                <h3 className="font-serif text-xl font-bold text-white">
                  {modalOpen === "create" ? "Write New Article" : "Edit Article"}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(null)}
                className="p-1 rounded-full text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-accent uppercase text-[#C89D45] font-bold block mb-1">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: e.target.value,
                      slug:
                        modalOpen === "create"
                          ? e.target.value
                              .toLowerCase()
                              .replace(/[^a-z0-9]+/g, "-")
                              .replace(/^-+|-+$/g, "")
                          : form.slug,
                    })
                  }
                  placeholder="e.g. The Rufous-necked Hornbill Nesting Secrets of Latpanchar"
                  className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#C89D45] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-accent uppercase text-[#C89D45] font-bold block mb-1">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-[#16123D] border border-white/20 rounded-xl px-3 py-2.5 text-sm text-white focus:border-[#C89D45] outline-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-accent uppercase text-[#C89D45] font-bold block mb-1">
                    Read Time
                  </label>
                  <input
                    type="text"
                    value={form.readTime}
                    onChange={(e) => setForm({ ...form, readTime: e.target.value })}
                    placeholder="5 min read"
                    className="w-full bg-black/40 border border-white/20 rounded-xl px-3 py-2.5 text-sm text-white focus:border-[#C89D45] outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-accent uppercase text-[#C89D45] font-bold block mb-1">
                    Publish Date
                  </label>
                  <input
                    type="date"
                    value={form.publishedAt}
                    onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
                    className="w-full bg-black/40 border border-white/20 rounded-xl px-3 py-2.5 text-sm text-white focus:border-[#C89D45] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-accent uppercase text-[#C89D45] font-bold block mb-1">
                  Cover Photo (Auto WebP Compressed)
                </label>
                <ImageDropbox
                  images={coverImages}
                  onChange={setCoverImages}
                  multiple={false}
                  label="Upload article cover image"
                />
              </div>

              <div>
                <label className="text-xs font-accent uppercase text-[#C89D45] font-bold block mb-1">
                  Short Excerpt *
                </label>
                <textarea
                  required
                  rows={2}
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  placeholder="A compelling 2-line summary displayed on article cards..."
                  className="w-full bg-black/40 border border-white/20 rounded-xl p-3 text-sm text-white focus:border-[#C89D45] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-accent uppercase text-[#C89D45] font-bold block mb-1">
                  Full Article Content *
                </label>
                <textarea
                  required
                  rows={6}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Write the full story, travel tips, birding location guides..."
                  className="w-full bg-black/40 border border-white/20 rounded-xl p-3 text-sm text-white focus:border-[#C89D45] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(null)}
                  className="px-5 py-2.5 rounded-xl border border-white/20 text-gray-300 hover:text-white font-accent text-xs uppercase font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#C62828] hover:bg-[#8B1E1E] text-white px-6 py-2.5 rounded-xl font-accent text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow border border-[#C89D45]/40"
                >
                  <Save className="w-4 h-4 text-[#C89D45]" />
                  <span>{saving ? "Publishing to Firestore..." : "Publish Article"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
