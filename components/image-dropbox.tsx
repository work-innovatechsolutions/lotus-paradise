"use client";

import React, { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { Upload, X, ImagePlus, Loader2 } from "lucide-react";
import { compressImageToWebP } from "@/lib/image-compressor";

interface ImageDropboxProps {
  /** Already-saved image URLs/base64 to display */
  images: string[];
  /** Called whenever the list changes */
  onChange: (images: string[]) => void;
  /** Allow uploading multiple images (default false = single) */
  multiple?: boolean;
  label?: string;
  /** If true, skips all compression and uploads the pristine full-resolution file */
  noCompress?: boolean;
  /** Upload target subfolder in public/uploads (e.g. "hero", "rooms", "blogs") */
  folder?: string;
}

export default function ImageDropbox({
  images,
  onChange,
  multiple = false,
  label = "Drop image here or click to browse",
  noCompress = false,
  folder = "uploads",
}: ImageDropboxProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ── Process accepted files (Raw Original or Compressed) ──────────────────────
  const processFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      setLoading(true);
      setErrorMessage(null);

      const accepted = Array.from(files).filter((f) =>
        f.type.startsWith("image/")
      );

      if (accepted.length === 0) {
        setLoading(false);
        return;
      }

      try {
        let urls: string[] = [];

        if (noCompress) {
          // DIRECT RAW UPLOAD: 0% compression, 100% original quality & dimensions
          urls = await Promise.all(
            accepted.map(async (file) => {
              const formData = new FormData();
              formData.append("file", file);
              formData.append("folder", folder);

              const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
              });

              if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || `Upload failed with status ${res.status}`);
              }

              const data = await res.json();
              return data.url as string;
            })
          );
        } else {
          // Fallback WebP compressor with high quality ceiling
          urls = (
            await Promise.all(
              accepted.map((file) =>
                compressImageToWebP(file, {
                  maxDimension: multiple ? 1200 : 2560,
                  quality: multiple ? 0.75 : 0.85,
                  maxSizeBytes: multiple ? 150 * 1024 : 350 * 1024,
                })
              )
            )
          ).filter(Boolean);
        }

        if (multiple) {
          onChange([...images, ...urls]);
        } else {
          onChange(urls.slice(0, 1)); // single mode — replace
        }
      } catch (err: any) {
        console.error("Image processing error:", err);
        setErrorMessage(err.message || "Failed to process image");
      } finally {
        setLoading(false);
      }
    },
    [images, multiple, noCompress, folder, onChange]
  );

  // ── Drag events ──────────────────────────────────────────────────────────────
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };
  const onDragLeave = () => setDragging(false);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const removeImage = (idx: number) => {
    onChange(images.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-3">
      {/* ── Drop Zone ── */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 py-8 px-4 ${
          dragging
            ? "border-[#C89D45] bg-[#C89D45]/10 scale-[1.01]"
            : "border-[#C89D45]/30 hover:border-[#C89D45]/70 hover:bg-white/5"
        }`}
      >
        {loading ? (
          <Loader2 className="w-8 h-8 text-[#C89D45] animate-spin" />
        ) : (
          <>
            <div className="p-3 rounded-full bg-[#C89D45]/15 border border-[#C89D45]/30">
              {dragging ? (
                <Upload className="w-6 h-6 text-[#C89D45]" />
              ) : (
                <ImagePlus className="w-6 h-6 text-[#C89D45]" />
              )}
            </div>
            <div className="text-center">
              <p className="text-xs font-accent font-bold text-gray-300">
                {dragging ? "Release to upload" : label}
              </p>
              <p className="text-[10px] text-gray-500 mt-0.5">
                PNG, JPG, WEBP · {multiple ? "Multiple files allowed" : "Single image"}
              </p>
            </div>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          onChange={(e) => processFiles(e.target.files)}
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* ── Error Message ── */}
      {errorMessage && (
        <div className="p-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-accent flex items-center justify-between">
          <span>{errorMessage}</span>
          <button type="button" onClick={() => setErrorMessage(null)} className="text-red-300 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ── Image Previews ── */}
      {images.length > 0 && (
        <div className={`grid gap-2 ${multiple ? "grid-cols-3 sm:grid-cols-4" : "grid-cols-1"}`}>
          {images.map((src, idx) => (
            <div
              key={idx}
              className={`relative rounded-xl overflow-hidden border border-[#C89D45]/20 group ${
                multiple ? "h-20" : "h-40"
              }`}
            >
              <Image
                src={src}
                alt={`Upload ${idx + 1}`}
                fill
                className="object-cover"
                unoptimized={true}
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-red-600 rounded-full text-white hover:bg-red-700"
                  title="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              {/* Primary badge */}
              {idx === 0 && (
                <span className="absolute top-1.5 left-1.5 text-[8px] font-accent font-bold uppercase tracking-wider bg-[#C89D45] text-[#1F1F1F] px-1.5 py-0.5 rounded-full">
                  Cover
                </span>
              )}
            </div>
          ))}

          {/* Add more tile (multi mode) */}
          {multiple && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
              className="h-20 rounded-xl border-2 border-dashed border-[#C89D45]/30 hover:border-[#C89D45]/60 flex items-center justify-center text-[#C89D45]/50 hover:text-[#C89D45] transition-all"
            >
              <ImagePlus className="w-5 h-5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
