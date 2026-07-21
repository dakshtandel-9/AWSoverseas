"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { MessageSquareText, ImageOff, ShoppingBag } from "lucide-react";
import { EnquiryModal, type EnquiryAuth } from "@/components/products/enquiry-modal";
import type { RequestType } from "@/app/actions/product-enquiry";
import type { PublicProduct } from "@/lib/product-data";

export function ProductCard({
  product,
  index,
  auth,
}: {
  product: PublicProduct;
  index: number;
  auth: EnquiryAuth;
}) {
  // null = modal closed; otherwise which flow the modal is showing.
  const [modalType, setModalType] = useState<RequestType | null>(null);
  // Bumped on each open so the modal remounts with fresh form/submit state —
  // otherwise a prior success screen would linger when reopening.
  const [openCount, setOpenCount] = useState(0);

  function openModal(type: RequestType) {
    setModalType(type);
    setOpenCount((n) => n + 1);
  }

  return (
    <>
      <motion.div
        className="group flex flex-col overflow-hidden rounded-2xl border border-[#e4e9f2] bg-white transition-colors duration-300 hover:border-[#9e4953]/50"
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
            <h3 className="mt-1 truncate text-base font-bold text-[#002144]">{product.name}</h3>
          </div>

          <div className="mt-auto flex gap-2">
            <button
              type="button"
              onClick={() => openModal("enquiry")}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-[#002144] px-3 py-2.5 text-sm font-semibold text-[#002144] transition-colors duration-200 hover:bg-[#eef3fb]"
            >
              <MessageSquareText className="size-4" />
              Enquiry
            </button>
            <button
              type="button"
              onClick={() => openModal("order")}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#02224C] px-3 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#011a38]"
            >
              <ShoppingBag className="size-4" />
              Order
            </button>
          </div>
        </div>
      </motion.div>

      <EnquiryModal
        key={openCount}
        productId={product.id}
        productName={product.name}
        auth={auth}
        requestType={modalType ?? "enquiry"}
        open={modalType !== null}
        onClose={() => setModalType(null)}
      />
    </>
  );
}
