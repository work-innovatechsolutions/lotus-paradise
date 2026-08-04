import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BLOG_POSTS } from "@/lib/data";
import { Calendar, Clock, ArrowRight } from "lucide-react";

export default function BlogPage() {
  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-accent uppercase tracking-widest text-[#C62828] font-bold">
          Latpanchar Travel Guides & Stories
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#1F1F1F]">
          Himalayan Travel Articles
        </h1>
        <p className="font-display text-lg text-gray-600 italic">
          Insights on birdwatching, Kanchenjunga sunrise vantage points, corporate offsites, and seasonal guides.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {BLOG_POSTS.map((post) => (
          <div
            key={post.id}
            className="glass-ivory rounded-3xl overflow-hidden border border-[#C89D45]/30 hover:border-[#C89D45] transition-all duration-300 shadow-xl flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="relative h-52 w-full overflow-hidden">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-[#C62828] text-white text-[10px] font-accent uppercase font-bold px-3 py-1 rounded-full">
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

                <h3 className="font-serif text-xl font-bold text-[#1F1F1F] group-hover:text-[#C62828] transition-colors">
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
                className="inline-flex items-center gap-2 text-xs font-accent uppercase font-bold text-[#C62828] hover:text-[#2C2473]"
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
