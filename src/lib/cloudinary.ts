import "server-only";
import { v2 as cloudinary } from "cloudinary";

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET,
  );
}

function configure() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  return cloudinary;
}

/** Uploads a blog image and returns its public HTTPS URL. Server-only — never expose the API secret to the client. */
export async function uploadBlogImage(file: File): Promise<string> {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary is not configured — set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in .env");
  }

  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");
  const dataUri = `data:${file.type};base64,${base64}`;

  const result = await configure().uploader.upload(dataUri, {
    folder: "awsoversea/blog",
    resource_type: "image",
  });

  return result.secure_url;
}

/** Uploads a passport photo (front/back) for account verification and returns its HTTPS URL. Server-only. */
export async function uploadPassportImage(file: File): Promise<string> {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary is not configured — set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in .env");
  }

  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");
  const dataUri = `data:${file.type};base64,${base64}`;

  const result = await configure().uploader.upload(dataUri, {
    folder: "awsoversea/passports",
    resource_type: "image",
  });

  return result.secure_url;
}

/** Uploads a product image and returns its public HTTPS URL. Server-only — never expose the API secret to the client. */
export async function uploadProductImage(file: File): Promise<string> {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary is not configured — set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in .env");
  }

  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");
  const dataUri = `data:${file.type};base64,${base64}`;

  const result = await configure().uploader.upload(dataUri, {
    folder: "awsoversea/products",
    resource_type: "image",
  });

  return result.secure_url;
}
