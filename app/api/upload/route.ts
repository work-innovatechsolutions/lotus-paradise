import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "hero";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Clean filename preserving original extension
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${Date.now()}-${safeName}`;

    // Target upload folder in public
    const targetDir = path.join(process.cwd(), "public", "uploads", folder);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const filePath = path.join(targetDir, filename);
    await fs.promises.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${folder}/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      size: buffer.length,
      mimeType: file.type,
    });
  } catch (error: any) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload image" },
      { status: 500 }
    );
  }
}
