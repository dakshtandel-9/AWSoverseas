"use client";

import { MessageCircle, List } from "lucide-react";
import { Section } from "@/components/ui/section";
import { SocialIcon, type SocialName } from "@/components/ui/social-icon";
import { slugify } from "@/lib/cn";

type ArticleSection = { heading: string; content: string };
type Share = { title: string; platforms: string[] };
type Article = { tableOfContents: string[]; sections: ArticleSection[]; tags: string[]; share: Share };

const SHARE_ICON: Record<string, SocialName | "whatsapp"> = {
  Facebook: "facebook",
  LinkedIn: "linkedin",
  X: "twitter",
  WhatsApp: "whatsapp",
};

export function ArticleBody({ data }: { data: Article }) {
  return (
    <Section spacing="lg">
      <div className="grid gap-14 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
        {/* Table of contents — sticky */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="flex items-center gap-2.5 text-[#5b6b82]">
            <List className="size-4" />
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em]">
              On This Page
            </p>
          </div>
          <nav className="mt-5 flex flex-col gap-1">
            {data.tableOfContents.map((item) => (
              <a
                key={item}
                href={`#${slugify(item)}`}
                className="rounded-lg px-3 py-2 text-sm text-[#5b6b82] transition-colors hover:bg-[#f6f8fc] hover:text-[#033e8d]"
              >
                {item}
              </a>
            ))}
          </nav>
        </aside>

        {/* Sections */}
        <div>
          <article className="prose-none flex flex-col gap-10">
            {data.sections.map((s) => (
              <div key={s.heading} id={slugify(s.heading)} className="scroll-mt-28">
                <h2 className="text-2xl font-bold text-[#06234d]">{s.heading}</h2>
                <p className="mt-3 text-[15px] leading-[1.85] text-[#5b6b82]">{s.content}</p>
              </div>
            ))}
          </article>

          {/* Tags */}
          <div className="mt-10 flex flex-wrap gap-2 border-t border-[#e4e9f2] pt-8">
            {data.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[#eef3fb] px-3 py-1.5 text-xs font-semibold text-[#033e8d]"
              >
                #{tag.replace(/\s+/g, "")}
              </span>
            ))}
          </div>

          {/* Share */}
          <div className="mt-8 flex items-center gap-4">
            <p className="text-sm font-semibold text-[#06234d]">{data.share.title}</p>
            <div className="flex items-center gap-2">
              {data.share.platforms.map((platform) => {
                const kind = SHARE_ICON[platform];
                return (
                  <span
                    key={platform}
                    aria-label={platform}
                    className="grid size-9 place-items-center rounded-full bg-[#eef3fb] text-[#033e8d] transition-colors hover:bg-[#033e8d] hover:text-white"
                  >
                    {kind === "whatsapp" || !kind ? (
                      <MessageCircle className="size-4" />
                    ) : (
                      <SocialIcon name={kind} className="size-4" />
                    )}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
