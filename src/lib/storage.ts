import "server-only";
import sharp from "sharp";
import { supabaseAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/status";
import { isR2Configured, r2Put } from "@/lib/r2";

/** Single public bucket for every upload below, folder-namespaced per feature (mirrors the old Cloudinary folder layout). */
const BUCKET = "uploads";

/** Uploaded objects are immutable (random UUID path, never overwritten), so cache them at the edge for a year instead of Supabase's 1hr default — cuts repeat-fetch egress. */
const CACHE_CONTROL = "31536000";

/** Decorative photos (products, categories, city agents, enquiry references): shown only as small thumbnails, safe to compress hard. */
const PHOTO_PROFILE = { maxDimension: 1600, quality: 80 } as const;

export function isStorageConfigured(): boolean {
  return isR2Configured() || isSupabaseConfigured();
}

/**
 * Re-encodes an uploaded image to WebP, downscaled to fit maxDimension. Falls back to the
 * original bytes/type if sharp can't process the input (e.g. an unusual format) so an upload
 * never fails purely because compression did.
 */
async function compressImage(
  file: File,
  profile: { maxDimension: number; quality: number }
): Promise<{ bytes: Buffer | ArrayBuffer; contentType: string; extension: string }> {
  const original = Buffer.from(await file.arrayBuffer());
  try {
    const compressed = await sharp(original)
      .rotate() // apply EXIF orientation before stripping metadata
      .resize({
        width: profile.maxDimension,
        height: profile.maxDimension,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: profile.quality })
      .toBuffer();
    return { bytes: compressed, contentType: "image/webp", extension: "webp" };
  } catch (err) {
    console.error("[compressImage] falling back to original file:", err);
    return { bytes: original, contentType: file.type || "application/octet-stream", extension: extensionFor(file) };
  }
}

function extensionFor(file: File): string {
  const fromName = file.name.split(".").pop();
  if (fromName && fromName.length <= 5) return fromName.toLowerCase();
  return (file.type.split("/")[1] || "bin").toLowerCase();
}

/**
 * Writes to R2 when it's configured, otherwise falls back to the original
 * Supabase bucket. The fallback matters during rollout: the deploy can go out
 * before the R2 credentials are set in the hosting environment without
 * breaking admin uploads, and it's the escape hatch if R2 ever needs backing
 * out. Both paths use the same `<folder>/<uuid>.<ext>` key, so an object's
 * location is decided purely by which URL got stored on the row.
 */
async function uploadToStorage(
  file: File,
  folder: string,
  profile: { maxDimension: number; quality: number } = PHOTO_PROFILE
): Promise<string> {
  if (!isStorageConfigured()) {
    throw new Error(
      "Storage is not configured — set the R2_* variables (or NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY) in .env"
    );
  }

  const { bytes, contentType, extension } = await compressImage(file, profile);
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;

  if (isR2Configured()) {
    const body = Buffer.isBuffer(bytes) ? bytes : Buffer.from(bytes);
    return r2Put(path, body, contentType);
  }

  const db = supabaseAdmin();
  const { error } = await db.storage.from(BUCKET).upload(path, bytes, {
    contentType,
    cacheControl: CACHE_CONTROL,
    upsert: false,
  });
  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data } = db.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/** Uploads a product image and returns its public HTTPS URL. Server-only. */
export async function uploadProductImage(file: File): Promise<string> {
  return uploadToStorage(file, "products");
}

/** Uploads a category image and returns its public HTTPS URL. Server-only. */
export async function uploadCategoryImage(file: File): Promise<string> {
  return uploadToStorage(file, "categories");
}

/** Uploads a city agent's photo and returns its public HTTPS URL. Server-only. */
export async function uploadCityAgentImage(file: File): Promise<string> {
  return uploadToStorage(file, "city-agents");
}

/** Uploads an optional reference image attached to a product enquiry/quote and returns its HTTPS URL. Server-only. */
export async function uploadEnquiryAttachment(file: File): Promise<string> {
  return uploadToStorage(file, "enquiries");
}
