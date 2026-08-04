"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowUpRight, ImageOff } from "lucide-react";
import { Section } from "@/components/ui/section";
import type { CityAgent } from "@/lib/city-agents";
import { CityAgentModal } from "@/components/contact/city-agent-modal";

const QUERY_KEY = "agent";

/**
 * City tiles below the enquiry form — each opens a card with that city's
 * agent, shareable via `?agent=<id>` (CityAgentModal builds that link, and
 * the effect below reopens the matching card when someone follows it).
 */
export function CityAgents({ agents }: { agents: CityAgent[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const fromUrl = searchParams.get(QUERY_KEY);
    if (fromUrl && agents.some((a) => a.id === fromUrl)) setActiveId(fromUrl);
    // Only reconcile on the initial load / external navigation to this URL —
    // openTile/close below own subsequent state changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setUrl(id: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (id) params.set(QUERY_KEY, id);
    else params.delete(QUERY_KEY);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function openTile(id: string) {
    setActiveId(id);
    setUrl(id);
  }

  function close() {
    setActiveId(null);
    setUrl(null);
  }

  const activeAgent = useMemo(() => agents.find((a) => a.id === activeId) ?? null, [agents, activeId]);
  const shareUrl = useMemo(() => {
    if (!activeAgent || typeof window === "undefined") return "";
    return `${window.location.origin}${pathname}?${QUERY_KEY}=${activeAgent.id}`;
  }, [activeAgent, pathname]);

  if (agents.length === 0) return null;

  return (
    <Section spacing="lg">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3 border-b border-[#e4e9f2] pb-5">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold text-[#1A0A53] sm:text-4xl">Find your agent</h2>
          <p className="mt-3 text-base leading-relaxed text-[#5b6b82]">
            Pick a city to see who&rsquo;s handling it on the ground — and share their card with
            anyone who needs it.
          </p>
        </div>
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">
          {agents.length} {agents.length === 1 ? "city" : "cities"}
        </p>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {agents.map((agent, i) => (
          <CityTile key={agent.id} agent={agent} index={i} onOpen={() => openTile(agent.id)} />
        ))}
      </div>

      <CityAgentModal agent={activeAgent} shareUrl={shareUrl} onClose={close} />
    </Section>
  );
}

function CityTile({ agent, index, onOpen }: { agent: CityAgent; index: number; onOpen: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-[#e4e9f2] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9e4953] focus-visible:ring-offset-2"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: Math.min(index, 7) * 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
      {agent.image_url ? (
        <Image
          src={agent.image_url}
          alt=""
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      ) : (
        <div className="grid h-full w-full place-items-center bg-[#eef3fb] text-[#94a3b8]">
          <ImageOff className="size-6" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" aria-hidden />

      <span className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors duration-300 group-hover:bg-white group-hover:text-[#1A0A53]">
        <ArrowUpRight className="size-4" />
      </span>

      <div className="absolute inset-x-0 bottom-0 p-4">
        <p className="text-lg font-bold leading-tight text-white">{agent.city}</p>
      </div>
    </motion.button>
  );
}
