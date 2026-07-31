"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin } from "lucide-react";
import { Section } from "@/components/ui/section";
import type { OfficeGroupWithOffices, OfficeLocation } from "@/lib/office-locations";

/**
 * The office directory under the Contact page map — one block per admin-created
 * group ("India Offices", "International Offices", or anything else they add),
 * each a three-column grid of office cards.
 */
export function OfficeLocations({ groups }: { groups: OfficeGroupWithOffices[] }) {
  if (groups.length === 0) return null;

  return (
    <Section spacing="lg">
      <div className="flex flex-col gap-20">
        {groups.map((group) => (
          <div key={group.id}>
            <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3 border-b border-[#e4e9f2] pb-5">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-bold text-[#1A0A53] sm:text-4xl">{group.title}</h2>
                {group.description && (
                  <p className="mt-3 text-base leading-relaxed text-[#5b6b82]">{group.description}</p>
                )}
              </div>
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">
                {group.offices.length} {group.offices.length === 1 ? "office" : "offices"}
              </p>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {group.offices.map((office, i) => (
                <OfficeCard key={office.id} office={office} index={i} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function OfficeCard({ office, index }: { office: OfficeLocation; index: number }) {
  const phones = [office.phone_1, office.phone_2].filter(Boolean);
  const hasContactRow = phones.length > 0 || Boolean(office.email) || Boolean(office.map_url);

  return (
    <motion.article
      className="flex flex-col rounded-3xl border border-[#e4e9f2] bg-white p-7 transition-colors hover:border-[#cfd9e8]"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: Math.min(index, 5) * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <h3 className="text-lg font-bold leading-snug text-[#1A0A53]">{office.name}</h3>
      <span
        aria-hidden
        className="mt-3 block h-[3px] w-10 rounded-full"
        style={{ background: "var(--text-maroon)" }}
      />

      {office.address && (
        <p className="mb-6 mt-4 text-sm leading-relaxed text-[#5b6b82]">{office.address}</p>
      )}

      {/* Pinned to the bottom so the divider lines up across every card in the row. */}
      {hasContactRow && (
        <ul className="mt-auto flex flex-col gap-3 border-t border-[#eef1f6] pt-5">
          {phones.map((phone) => (
            <ContactRow key={phone} icon={Phone} href={`tel:${phone.replace(/[^\d+]/g, "")}`}>
              {phone}
            </ContactRow>
          ))}
          {office.email && (
            <ContactRow icon={Mail} href={`mailto:${office.email}`}>
              {office.email}
            </ContactRow>
          )}
          {office.map_url && (
            <ContactRow icon={MapPin} href={office.map_url} external>
              View on map
            </ContactRow>
          )}
        </ul>
      )}
    </motion.article>
  );
}

function ContactRow({
  icon: Icon,
  href,
  external,
  children,
}: {
  icon: typeof Phone;
  href: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  return (
    <li>
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="group flex items-start gap-3 text-sm font-semibold text-[#1A0A53] transition-colors hover:text-maroon-admin"
      >
        <Icon
          className="mt-0.5 size-4 shrink-0 text-maroon-admin"
          aria-hidden
        />
        <span className="min-w-0 break-words">{children}</span>
      </a>
    </li>
  );
}
