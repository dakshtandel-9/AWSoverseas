"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { MessageSquareText, ImageOff } from "lucide-react";
import { EnquiryModal } from "@/components/products/enquiry-modal";
import type { PublicProduct } from "@/lib/product-data";

export function ProductCard({ product, index }: { product: PublicProduct; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.div
        className="group flex flex-col overflow-hidden rounded-2xl border border-[#e4e9f2] bg-white transition-colors duration-300 hover:border-[#0fade8]/50"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.45, delay: (index % 9) * 0.05, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="relative aspect-square w-full overflow-hidden bg-[#eef3fb]">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[#94a3b8]">
              <ImageOff className="size-8" />
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="min-w-0">
            {product.category && (
              <p className="truncate font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#94a3b8]">
                {product.category}
              </p>
            )}
            <h3 className="mt-1 truncate text-base font-bold text-[#06234d]">{product.name}</h3>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-auto inline-flex items-center justify-center gap-1.5 rounded-full bg-[#033e8d] px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#052f69]"
          >
            <MessageSquareText className="size-4" />
            Enquiry
          </button>
        </div>
      </motion.div>

      <EnquiryModal
        productId={product.id}
        productName={product.name}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
