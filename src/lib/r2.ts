import "server-only";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

/**
 * Cloudflare R2 holds every public media file (product/category photos, city
 * agent tiles, enquiry attachments, hero videos). Supabase stays the database
 * and auth layer only.
 *
 * The reason for the split is egress, not storage: 167MB of media costs
 * nothing to *hold* anywhere, but Supabase's free tier allows 5GB/month of
 * downloads and a single hero video is ~6MB. R2 bills $0 for egress at any
 * volume, so serving media stops being a metered cost.
 *
 * R2 speaks the S3 API, so this is the AWS SDK pointed at an R2 endpoint.
 */

const ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const BUCKET = process.env.R2_BUCKET;

/**
 * Origin that serves the bucket publicly — either the r2.dev development URL
 * (`https://pub-<hash>.r2.dev`) or, once the domain moves to Cloudflare DNS, a
 * custom domain like `https://cdn.awsoverseas.com`. Swapping this one value
 * repoints every newly written URL; run scripts/migrate-media-to-r2.mjs to
 * rewrite the ones already in the database.
 */
const PUBLIC_URL = process.env.R2_PUBLIC_URL;

export function isR2Configured(): boolean {
  return Boolean(ACCOUNT_ID && ACCESS_KEY_ID && SECRET_ACCESS_KEY && BUCKET && PUBLIC_URL);
}

let client: S3Client | null = null;

function r2(): S3Client {
  if (!client) {
    client = new S3Client({
      region: "auto",
      endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: ACCESS_KEY_ID as string,
        secretAccessKey: SECRET_ACCESS_KEY as string,
      },
    });
  }
  return client;
}

/** Public HTTPS URL for an object path, e.g. `products/<uuid>.webp`. */
export function r2PublicUrl(objectPath: string): string {
  return `${(PUBLIC_URL as string).replace(/\/+$/, "")}/${objectPath}`;
}

/**
 * Writes an object and returns its public URL. Objects are immutable (random
 * UUID paths, never overwritten), so they carry a one-year cache header.
 */
export async function r2Put(
  objectPath: string,
  bytes: Buffer | Uint8Array,
  contentType: string,
  cacheControl = "public, max-age=31536000, immutable"
): Promise<string> {
  await r2().send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: objectPath,
      Body: bytes,
      ContentType: contentType,
      CacheControl: cacheControl,
    })
  );
  return r2PublicUrl(objectPath);
}
