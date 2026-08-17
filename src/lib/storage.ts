import "server-only";
import { supabaseAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/status";

/** Single public bucket for every upload below, folder-namespaced per feature (mirrors the old Cloudinary folder layout). */
const BUCKET = "uploads";

export function isStorageConfigured(): boolean {
  return isSupabaseConfigured();
}

function extensionFor(file: File): string {
  const fromName = file.name.split(".").pop();
  if (fromName && fromName.length <= 5) return fromName.toLowerCase();
  return (file.type.split("/")[1] || "bin").toLowerCase();
}

async function uploadToStorage(file: File, folder: string): Promise<string> {
  if (!isStorageConfigured()) {
    throw new Error("Storage is not configured — set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env");
  }

  const path = `${folder}/${crypto.randomUUID()}.${extensionFor(file)}`;
  const db = supabaseAdmin();
  const { error } = await db.storage.from(BUCKET).upload(path, file, {
    contentType: file.type || undefined,
    upsert: false,
  });
  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data } = db.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/** Uploads a government ID photo (passport/Aadhaar/PAN, front/back) for account verification and returns its HTTPS URL. Server-only. */
export async function uploadIdDocumentImage(file: File): Promise<string> {
  return uploadToStorage(file, "id-documents");
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
