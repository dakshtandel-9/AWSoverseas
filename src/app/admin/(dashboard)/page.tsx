import Link from "next/link";
import { Mail, FileText, Newspaper, ArrowRight, MessageSquareText } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/status";
import { SetupNotice } from "@/components/admin/setup-notice";

async function getCounts() {
  const db = supabaseAdmin();
  const [messages, quotes, posts, enquiries] = await Promise.all([
    db.from("contact_submissions").select("id", { count: "exact", head: true }).eq("is_read", false),
    db.from("quote_submissions").select("id", { count: "exact", head: true }).eq("is_read", false),
    db.from("blog_posts").select("id", { count: "exact", head: true }).eq("published", true),
    db.from("product_enquiries").select("id", { count: "exact", head: true }).eq("is_read", false),
  ]);
  return {
    unreadMessages: messages.count ?? 0,
    unreadQuotes: quotes.count ?? 0,
    publishedPosts: posts.count ?? 0,
    unreadEnquiries: enquiries.count ?? 0,
  };
}

export default async function AdminDashboardPage() {
  const configured = isSupabaseConfigured();
  const counts = configured
    ? await getCounts()
    : { unreadMessages: 0, unreadQuotes: 0, publishedPosts: 0, unreadEnquiries: 0 };

  const cards = [
    {
      href: "/admin/enquiries",
      label: "Unread product enquiries",
      value: counts.unreadEnquiries,
      icon: MessageSquareText,
    },
    {
      href: "/admin/messages",
      label: "Unread messages",
      value: counts.unreadMessages,
      icon: Mail,
    },
    {
      href: "/admin/quotes",
      label: "Unread quote requests",
      value: counts.unreadQuotes,
      icon: FileText,
    },
    {
      href: "/admin/blog",
      label: "Published blog posts",
      value: counts.publishedPosts,
      icon: Newspaper,
    },
  ];

  return (
    <div>
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">Overview</p>
      <h1 className="mt-2 text-2xl font-bold text-[#06234d] sm:text-3xl">Dashboard</h1>

      {!configured && (
        <div className="mt-6">
          <SetupNotice />
        </div>
      )}

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ href, label, value, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-col gap-4 rounded-2xl border border-[#e4e9f2] bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-16px_rgba(4,22,47,0.14)]"
          >
            <span className="grid size-11 place-items-center rounded-xl bg-[#eef3fb] text-[#033e8d]">
              <Icon className="size-5" />
            </span>
            <div>
              <p className="text-3xl font-bold text-[#06234d]">{value}</p>
              <p className="mt-1 text-sm text-[#5b6b82]">{label}</p>
            </div>
            <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-[#0489c2]">
              View
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
