import type { Metadata } from "next";
import { VoidManifest } from "@/components/not-found/void-manifest";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <VoidManifest />;
}
