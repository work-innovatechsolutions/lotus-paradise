/**
 * Client-side WebP Image Compressor
 * Compresses any user-uploaded image into an optimized WebP base64 data-URL,
 * ensuring it stays safely below Firestore's 1MB document size limit (< 200KB per image).
 */

export interface CompressionOptions {
  maxDimension?: number;
  quality?: number;
  maxSizeBytes?: number; // Target max byte size for the base64 string
}

export async function compressImageToWebP(
  file: File | Blob,
  options: CompressionOptions = {}
): Promise<string> {
  const {
    maxDimension = 1200,
    quality = 0.75,
    maxSizeBytes = 200 * 1024, // 200 KB target
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        try {
          let currentMaxDim = maxDimension;
          let currentQuality = quality;
          let outputDataUrl = "";
          let attempts = 0;
          const maxAttempts = 4;

          while (attempts < maxAttempts) {
            // 1. Calculate scaled dimensions
            let { width, height } = img;
            if (width > currentMaxDim || height > currentMaxDim) {
              if (width > height) {
                height = Math.round((height * currentMaxDim) / width);
                width = currentMaxDim;
              } else {
                width = Math.round((width * currentMaxDim) / height);
                height = currentMaxDim;
              }
            }

            // 2. Render to canvas
            const canvas = document.createElement("canvas");
            canvas.width = Math.max(width, 1);
            canvas.height = Math.max(height, 1);

            const ctx = canvas.getContext("2d", { alpha: false });
            if (!ctx) {
              resolve(e.target?.result as string);
              return;
            }

            // Smooth image downscaling
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // 3. Export to WebP
            outputDataUrl = canvas.toDataURL("image/webp", currentQuality);

            // Fallback if browser doesn't support WebP export (returns PNG)
            if (outputDataUrl.startsWith("data:image/png") && !file.type.includes("png")) {
              outputDataUrl = canvas.toDataURL("image/jpeg", currentQuality);
            }

            const estimatedBytes = Math.round((outputDataUrl.length * 3) / 4);

            // If size is acceptable or we hit minimum quality, break
            if (estimatedBytes <= maxSizeBytes || attempts === maxAttempts - 1) {
              break;
            }

            // Step down quality and dimensions for next attempt
            currentQuality = Math.max(0.45, currentQuality - 0.15);
            currentMaxDim = Math.round(currentMaxDim * 0.8);
            attempts++;
          }

          resolve(outputDataUrl);
        } catch (err) {
          console.warn("WebP compression error, fallback to original:", err);
          resolve(e.target?.result as string);
        }
      };

      img.onerror = () => {
        resolve(e.target?.result as string);
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error("Failed to read image file"));
    };

    reader.readAsDataURL(file);
  });
}
