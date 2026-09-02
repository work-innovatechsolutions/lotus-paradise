import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BLOG_POSTS, type BlogArticle } from "@/lib/data";
import { notFound } from "next/navigation";
import { Calendar, Clock, ArrowLeft } from "lucide-react";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="pt-28 pb-20 max-w-4xl mx-auto px-4 space-y-8">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-xs font-accent uppercase font-bold text-[#C62828] hover:text-[#2C2473]"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Articles</span>
      </Link>

      <div className="space-y-4">
        <span className="bg-[#C62828] text-white text-[10px] font-accent uppercase font-bold px-3.5 py-1 rounded-full border border-[#C89D45]/50">
          {post.category}
        </span>

        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1F1F1F] leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center gap-4 text-xs font-sans text-gray-500">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#C89D45]" />
            Published: {post.publishedAt}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#C89D45]" />
            {post.readTime}
          </span>
        </div>
      </div>

      <div className="relative h-80 sm:h-96 rounded-3xl overflow-hidden shadow-2xl border border-[#C89D45]/40">
        <Image
          src={post.coverImage || "/images/hero/bengal-latpanchar.jpg.jpeg"}
          alt={post.title}
          fill
          className="object-cover"
          unoptimized={post.coverImage?.startsWith("data:")}
        />
      </div>

      <div className="font-sans text-base text-gray-700 leading-relaxed space-y-4 pt-4">
        <p className="font-display text-lg italic text-[#C62828]">
          &quot;{post.excerpt}&quot;
        </p>
        <div className="whitespace-pre-line leading-relaxed">
          {post.content}
        </div>
        <p>
          Visiting Latpanchar during this season offers unmatched tranquility, birdwatching, and mountain hospitality. Reserve your stay at Lotus Paradise Homestay to experience nature firsthand.
        </p>
      </div>

      <div className="pt-8 border-t border-gray-200 flex justify-between items-center">
        <Link
          href="/booking"
          className="bg-[#C62828] hover:bg-[#8B1E1E] text-white px-8 py-3 rounded-full font-accent text-xs font-bold uppercase tracking-widest shadow-lg"
        >
          Book Your Stay Now
        </Link>
      </div>
    </article>
  );
}
