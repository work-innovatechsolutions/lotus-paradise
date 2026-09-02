"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { BlogService } from "@/services/blog.service";
import type { BlogArticle } from "@/lib/data";
import { Calendar, Clock, ArrowRight, BookOpen } from "lucide-react";
import SectionReveal from "@/components/section-reveal";

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogArticle[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  useEffect(() => {
    async function load() {
      const data = await BlogService.getAllBlogs();
      setBlogs(data);
    }
    load();

    const handleUpdate = () => {
      load();
    };

    window.addEventListener("lp_blogs_updated", handleUpdate);
    return () => window.removeEventListener("lp_blogs_updated", handleUpdate);
  }, []);

  const categories = [
    "All",
    ...Array.from(new Set(blogs.map((b) => b.category).filter(Boolean))),
  ];

  const filteredBlogs =
    activeCategory === "All"
      ? blogs
      : blogs.filter((b) => b.category === activeCategory);

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* HEADER */}
      <SectionReveal className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-accent uppercase tracking-widest text-[#C62828] font-bold">
          Latpanchar Travel Guides & Stories
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#1F1F1F]">
          Himalayan Travel Articles & Blogs
        </h1>
        <p className="font-display text-lg text-gray-600 italic">
          Insights on birdwatching, Kanchenjunga sunrise vantage points, corporate retreats, and seasonal guides.
        </p>
      </SectionReveal>

      {/* CATEGORY FILTER PILLS */}
      {categories.length > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-accent font-bold uppercase tracking-wider transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-[#C62828] text-white shadow-md shadow-[#C62828]/25"
                  : "glass-ivory text-[#555] hover:text-[#1F1F1F] hover:bg-white border border-[#C89D45]/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* BLOG ARTICLES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredBlogs.map((post) => (
          <div
            key={post.id}
            className="glass-ivory rounded-3xl overflow-hidden border border-[#C89D45]/30 hover:border-[#C89D45] transition-all duration-300 shadow-xl flex flex-col justify-between group hover:-translate-y-1.5"
          >
            <div className="space-y-4">
              <div className="relative h-52 w-full overflow-hidden">
                <Image
                  src={post.coverImage || "/images/hero/bengal-latpanchar.jpg.jpeg"}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized={post.coverImage?.startsWith("data:")}
                />
                <div className="absolute top-3 left-3 bg-[#C62828] text-white text-[10px] font-accent uppercase font-bold px-3 py-1 rounded-full shadow">
                  {post.category}
                </div>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-center gap-3 text-xs font-sans text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#C89D45]" />
                    {post.publishedAt}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#C89D45]" />
                    {post.readTime}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-[#1F1F1F] group-hover:text-[#C62828] transition-colors line-clamp-2">
                  {post.title}
                </h3>

                <p className="font-sans text-xs text-gray-600 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0">
              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center gap-2 text-xs font-accent uppercase font-bold text-[#C62828] hover:text-[#2C2473] transition-colors"
              >
                <span>Read Full Article</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
