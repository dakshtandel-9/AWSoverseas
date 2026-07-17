"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Wheat,
  Shirt,
  Footprints,
  UtensilsCrossed,
  Tractor,
  Beaker,
  FlaskConical,
  LayoutGrid,
  BadgeCheck,
} from "lucide-react";
import { Section } from "@/components/ui/section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";

const ease = [0.16, 1, 0.3, 1] as const;

type Category = {
  title: string;
  subtitle: string;
  badge: string;
  image?: string;
};

const CATEGORIES: (Category & { Icon: React.ComponentType<{ className?: string }> })[] = [
  {
    title: "Rice",
    subtitle: "Premium Basmati & Non-Basmati",
    badge: "Export Ready",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=800&auto=format&fit=crop",
    Icon: Wheat,
  },
  {
    title: "Fabric",
    subtitle: "Cotton & Textile Materials",
    badge: "Bulk Orders",
    image: "https://images.unsplash.com/photo-1771098206650-81d713e2e2b9?q=80&w=800&auto=format&fit=crop",
    Icon: Shirt,
  },
  {
    title: "Shoes",
    subtitle: "Leather & Casual Footwear",
    badge: "Factory Direct",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop",
    Icon: Footprints,
  },
  {
    title: "Utensils",
    subtitle: "Kitchen & Stainless Steel Products",
    badge: "Quality Checked",
    image: "https://images.unsplash.com/photo-1511224931379-b4e4324ea7fc?q=80&w=800&auto=format&fit=crop",
    Icon: UtensilsCrossed,
  },
  {
    title: "Tractors",
    subtitle: "Agricultural Machinery",
    badge: "HS Certified",
    image: "https://images.unsplash.com/photo-1720273071277-190dd8f0a05a?q=80&w=800&auto=format&fit=crop",
    Icon: Tractor,
  },
  {
    title: "Activated Carbon",
    subtitle: "Industrial Filtration Solutions",
    badge: "Worldwide Supply",
    image: "https://images.unsplash.com/photo-1703359905472-069a5f573927?q=80&w=800&auto=format&fit=crop",
    Icon: Beaker,
  },
  {
    title: "Industrial Chemicals",
    subtitle: "Bulk Industrial Chemicals",
    badge: "Export Ready",
    image: "https://images.unsplash.com/photo-1513828170880-00eeeac21306?q=80&w=800&auto=format&fit=crop",
    Icon: FlaskConical,
  },
];

function ProductCard({
  category,
  index,
}: {
  category: Category & { Icon: React.ComponentType<{ className?: string }> };
  index: number;
}) {
  const { title, subtitle, badge, image, Icon } = category;

  return (
    <StaggerItem>
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-[#e4e9f2] bg-white shadow-[0_1px_2px_rgba(4,22,47,0.04),0_8px_24px_-8px_rgba(4,22,47,0.10)] transition-shadow duration-300 hover:shadow-[0_16px_48px_-12px_rgba(4,22,47,0.22)]"
      >
        {/* Red gradient border wash — fades in on hover */}
        <span
          className="pointer-events-none absolute inset-0 rounded-[28px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            padding: 1,
            background: "linear-gradient(135deg, rgba(215,40,70,0.55), rgba(224,92,114,0.15) 40%, transparent 70%)",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
          aria-hidden
        />

        {/* Image */}
        <div className="relative h-[190px] w-full shrink-0 overflow-hidden sm:h-[210px]">
          {image ? (
            <Image
              src={image}
              alt={`${title} — ${subtitle}`}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#eef3fb]">
              <Icon className="size-10 text-[#01214a]/30" />
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0" />

          {/* Top-right arrow button */}
          <span className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/90 text-[#01214a] shadow-[0_2px_8px_rgba(4,22,47,0.18)] backdrop-blur-sm transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            <ArrowUpRight className="size-4" aria-hidden />
          </span>

          {/* Category icon chip */}
          <span className="absolute left-3 top-3 grid size-9 place-items-center rounded-full bg-white/90 text-[#01214a] shadow-[0_2px_8px_rgba(4,22,47,0.18)] backdrop-blur-sm">
            <Icon className="size-4" aria-hidden />
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-2 p-5">
          <h3 className="text-base font-bold text-[#01214a]">{title}</h3>
          <p className="text-sm leading-relaxed text-[#5b6b82]">{subtitle}</p>

          <span className="mt-auto inline-flex w-fit items-center gap-1.5 rounded-full bg-[#eef3fb] px-3 py-1 text-[11px] font-semibold text-[#01214a]">
            <span className="size-1.5 rounded-full bg-[#d72846]" aria-hidden />
            <BadgeCheck className="size-3" aria-hidden />
            {badge}
          </span>
        </div>
      </motion.div>
    </StaggerItem>
  );
}

function ViewAllCard({ index }: { index: number }) {
  return (
    <StaggerItem>
      <motion.div whileHover={{ y: -8 }} transition={{ type: "spring", stiffness: 280, damping: 22 }} className="h-full">
        <Link
          href="/products"
          aria-label="View all exportable products in the full catalog"
          className="group relative flex h-full min-h-[300px] flex-col justify-between overflow-hidden rounded-[28px] bg-gradient-to-br from-[#01214a] via-[#054ba8] to-[#0a3580] p-6 text-white shadow-[0_12px_40px_-12px_rgba(3,62,141,0.5)] transition-shadow duration-300 hover:shadow-[0_16px_48px_-8px_rgba(3,62,141,0.6)] sm:min-h-[340px]"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
            aria-hidden
          />
          <div className="pointer-events-none absolute -right-14 -top-14 size-56 rounded-full bg-[#d72846]/30 blur-3xl" aria-hidden />

          <span className="relative grid size-14 place-items-center rounded-2xl bg-white/12 ring-1 ring-white/20 backdrop-blur-sm transition-transform duration-300 group-hover:scale-105">
            <LayoutGrid className="size-6 text-[#e05c72]" aria-hidden />
          </span>

          <div className="relative">
            <h3 className="text-lg font-bold" style={{ color: "#ffffff" }}>
              View All Products
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              Explore the complete export-ready catalog, category by category.
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#e05c72]">
              Browse catalog
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
      </motion.div>
    </StaggerItem>
  );
}

export function ProductsWeExport() {
  return (
    <Section spacing="lg" tone="default" id="products-we-export" className="relative overflow-hidden">
      {/* Subtle grid texture, matching WhyChooseUs */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(4,22,47,0.028) 1px, transparent 1px), linear-gradient(to bottom, rgba(4,22,47,0.028) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Header */}
      <div className="relative mb-14 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <Reveal direction="up">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-700 ring-1 ring-brand-100">
              <span className="size-1.5 rounded-full bg-[#d72846]" aria-hidden />
              Export Catalog
            </span>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-[#01214a] sm:text-4xl lg:text-[2.6rem]">
              Products We Export
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-[#5b6b82]">
              Browse our export-ready catalog of premium Indian products. Every product is quality checked, export
              documented, and shipped worldwide.
            </p>
          </div>
        </Reveal>

        <Reveal direction="up" delay={0.1}>
          <Link
            href="/products"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-[#01214a]/15 px-6 py-3 text-sm font-semibold text-[#01214a] transition-all duration-300 hover:border-[#d72846]/40 hover:bg-[#eef3fb]"
          >
            View Complete Catalog
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      </div>

      {/* Grid: 4 cols desktop (4x2), 2 cols tablet, 1 col mobile */}
      <Stagger className="relative grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map((category, i) => (
          <ProductCard key={category.title} category={category} index={i} />
        ))}
        <ViewAllCard index={CATEGORIES.length} />
      </Stagger>

      {/* Bottom CTA strip */}
      <motion.div
        className="relative mt-16 overflow-hidden rounded-[28px] bg-gradient-to-br from-[#01214a] via-[#04234f] to-[#0a3580] p-8 shadow-[0_20px_60px_-16px_rgba(1,33,74,0.55)] sm:p-10 lg:p-14"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.65, ease }}
      >
        {/* Dot-grid texture, matching the ServicesGrid featured card */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
          aria-hidden
        />
        {/* Glows */}
        <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-[#d72846]/30 blur-[100px]" aria-hidden />
        <div className="pointer-events-none absolute -bottom-16 -left-16 size-64 rounded-full bg-[#0a3580]/40 blur-[90px]" aria-hidden />

        <div className="relative flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-center">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#e05c72] ring-1 ring-white/15">
              <span className="size-1.5 rounded-full bg-[#e05c72]" aria-hidden />
              Start Sourcing
            </span>
            <h3
              className="mt-4 text-2xl font-bold leading-tight sm:text-[1.85rem]"
              style={{ color: "#ffffff" }}
            >
              Ready to source products directly from India?
            </h3>
            <p className="mt-3 text-base leading-relaxed text-white/70">
              We help businesses worldwide source, inspect, document, and export premium Indian products.
            </p>
          </div>

          <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/quote"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#d72846] to-[#e05c72] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_-6px_rgba(215,40,70,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-6px_rgba(215,40,70,0.65)]"
            >
              Request Product Quote
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/8 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:bg-white/14"
            >
              Browse Catalog
            </Link>
          </div>
        </div>
      </motion.div>
    </Section>
  );
}
