"use client";

import Link from "next/link";
import Image from "next/image";
import { useTransition } from "react";
import { Pencil, Plus, Trash2, Phone, Mail, ImageOff } from "lucide-react";
import { cn } from "@/lib/cn";
import type { CityAgent } from "@/lib/city-agents";
import { deleteCityAgentAction, toggleCityAgentActiveAction } from "@/app/admin/(dashboard)/city-agents/actions";

/** Every city tile, plus the control to add another. */
export function CityAgentsBoard({ agents }: { agents: CityAgent[] }) {
  return (
    <div className="mt-8">
      {agents.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[#e4e9f2] px-5 py-8 text-center text-sm text-[#94a3b8]">
          No city tiles yet — the section stays hidden on the Contact page until you add one.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <CityAgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      )}

      <Link
        href="/admin/city-agents/new"
        className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-dashed border-[#cfd9e8] px-5 py-6 text-sm font-semibold text-[#5b6b82] transition-colors hover:border-[#9e4953] hover:text-maroon-admin"
      >
        <Plus className="size-4" />
        Add city
      </Link>
    </div>
  );
}

function CityAgentCard({ agent }: { agent: CityAgent }) {
  const [pending, startTransition] = useTransition();

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-[#e4e9f2] bg-[#f9fbfe]",
        !agent.is_active && "opacity-60",
      )}
    >
      <div className="relative h-32 w-full shrink-0 bg-[#eef3fb]">
        {agent.image_url ? (
          <Image src={agent.image_url} alt="" fill sizes="320px" className="object-cover" />
        ) : (
          <div className="grid h-full w-full place-items-center text-[#94a3b8]">
            <ImageOff className="size-6" />
          </div>
        )}
        <button
          type="button"
          disabled={pending}
          onClick={() => startTransition(() => toggleCityAgentActiveAction(agent.id, !agent.is_active))}
          className={cn(
            "absolute right-2.5 top-2.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold shadow-sm backdrop-blur-sm transition-colors disabled:opacity-50",
            agent.is_active ? "bg-white/90 text-maroon-admin" : "bg-black/60 text-white",
          )}
        >
          {agent.is_active ? "Visible" : "Hidden"}
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-sm font-bold leading-snug text-[#1A0A53]">{agent.city || "Untitled"}</h3>
        <p className="mt-0.5 text-xs text-[#5b6b82]">{agent.agent_name || "No associate name yet"}</p>

        <ul className="mt-3 flex flex-col gap-1.5 text-xs text-[#5b6b82]">
          {agent.phone && (
            <li className="flex items-center gap-2">
              <Phone className="size-3 shrink-0 text-[#94a3b8]" />
              <span className="truncate">{agent.phone}</span>
            </li>
          )}
          {agent.email && (
            <li className="flex items-center gap-2">
              <Mail className="size-3 shrink-0 text-[#94a3b8]" />
              <span className="truncate">{agent.email}</span>
            </li>
          )}
        </ul>

        <div className="mt-auto flex items-center gap-2 border-t border-[#e4e9f2] pt-3">
          <Link
            href={`/admin/city-agents/${agent.id}/edit`}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#5b6b82] transition-colors hover:bg-white hover:text-[#1A0A53]"
          >
            <Pencil className="size-3.5" />
            Edit
          </Link>
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              if (confirm(`Delete "${agent.city || "this city"}"? This can't be undone.`)) {
                startTransition(() => deleteCityAgentAction(agent.id));
              }
            }}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#5b6b82] transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
          >
            <Trash2 className="size-3.5" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
