import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  BadgeCheck,
  Building2,
  Clock3,
  FileText,
  Mail,
  MessageSquareText,
  Pencil,
  Phone,
  ShieldAlert,
} from "lucide-react";
import { getAccount, type AccountStatus } from "@/lib/account";
import { supabaseAdmin } from "@/lib/supabase/server";
import { getWalletSummary } from "@/lib/wallet";
import { AccountHero } from "@/components/account/account-hero";
import { ReferralCodeCard } from "@/components/account/referral-code-card";
import { WalletCard } from "@/components/account/wallet-card";
import { SignOutButton } from "@/components/account/sign-out-button";
import { ActivityList, type ActivityItem } from "@/components/account/activity-list";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Your profile — AWSoversea",
  robots: { index: false },
};

const STATUS_BANNER: Record<
  Exclude<AccountStatus, "incomplete">,
  { icon: typeof Clock3; classes: string; title: string; body: string }
> = {
  pending: {
    icon: Clock3,
    classes: "border-amber-200 bg-amber-50 text-amber-800",
    title: "Verification pending",
    body: "Our team is reviewing your details. You'll be able to request quotes and send product enquiries once your account is approved.",
  },
  approved: {
    icon: BadgeCheck,
    classes: "border-emerald-200 bg-emerald-50 text-emerald-800",
    title: "Account verified",
    body: "You're all set — request quotes and send product enquiries any time.",
  },
  rejected: {
    icon: ShieldAlert,
    classes: "border-red-200 bg-red-50 text-red-700",
    title: "Verification declined",
    body: "We couldn't verify your details. Check your passport information, update it, and resubmit for review.",
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function ProfilePage() {
  const account = await getAccount();
  if (!account) redirect("/login?next=/profile");
  if (account.profile.status === "incomplete") redirect("/profile/setup");

  const { profile } = account;
  const banner = STATUS_BANNER[profile.status as Exclude<AccountStatus, "incomplete">];
  const BannerIcon = banner.icon;

  const db = supabaseAdmin();

  const [{ data: quotes }, { data: enquiries }, walletSummary] = await Promise.all([
    db
      .from("quote_submissions")
      .select("id, service_type, origin_country, destination_country, created_at")
      .eq("user_id", account.user.id)
      .order("created_at", { ascending: false }),
    db
      .from("product_enquiries")
      .select(
        "id, product_name, message, created_at, quote_status, quoted_price, quoted_quantity, quoted_weight_kg, delivery_date, rejection_reason",
      )
      .eq("user_id", account.user.id)
      .order("created_at", { ascending: false }),
    getWalletSummary(profile.id),
  ]);

  const quoteItems: ActivityItem[] = (quotes ?? []).map((q) => ({
    id: q.id,
    title: q.service_type || "Shipping quote",
    subtitle:
      q.origin_country && q.destination_country ? `${q.origin_country} → ${q.destination_country}` : undefined,
    createdAt: formatDate(q.created_at),
  }));

  const enquiryItems: ActivityItem[] = (enquiries ?? []).map((e) => {
    if (e.quote_status === "quoted") {
      return {
        id: e.id,
        title: e.product_name,
        subtitle: e.message || undefined,
        createdAt: formatDate(e.created_at),
        badgeTone: "positive" as const,
        badge: [
          `₹${Number(e.quoted_price).toLocaleString("en-IN")}`,
          e.quoted_quantity && `Qty ${e.quoted_quantity}`,
          e.quoted_weight_kg != null && `${e.quoted_weight_kg} kg`,
          e.delivery_date && `Delivery by ${formatDate(e.delivery_date)}`,
        ]
          .filter(Boolean)
          .join(" · "),
      };
    }
    if (e.quote_status === "rejected") {
      return {
        id: e.id,
        title: e.product_name,
        subtitle: e.message || undefined,
        createdAt: formatDate(e.created_at),
        badgeTone: "negative" as const,
        badge: e.rejection_reason ? `Rejected — ${e.rejection_reason}` : "Rejected",
      };
    }
    return {
      id: e.id,
      title: e.product_name,
      subtitle: e.message || undefined,
      createdAt: formatDate(e.created_at),
      badgeTone: "neutral" as const,
      badge: "Awaiting review",
    };
  });

  const details = [
    { icon: Mail, label: "Email", value: profile.email },
    { icon: Phone, label: "Phone", value: profile.phone },
    { icon: Building2, label: "Company", value: profile.company_name || "—" },
    { icon: FileText, label: "Passport number", value: profile.passport_number },
  ];

  return (
    <>
      <AccountHero
        eyebrow="Account"
        title={`${profile.first_name} ${profile.last_name}`}
        subtitle={profile.username ? `@${profile.username}` : undefined}
        right={`MEMBER SINCE ${formatDate(profile.created_at).toUpperCase()}`}
      />

      <Section spacing="md" tone="soft">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="flex flex-col gap-6">
            <div className={`flex items-start gap-3.5 rounded-2xl border px-6 py-5 ${banner.classes}`}>
              <BannerIcon className="mt-0.5 size-5 shrink-0" />
              <div>
                <p className="font-bold">{banner.title}</p>
                <p className="mt-1 text-sm leading-relaxed opacity-90">{banner.body}</p>
              </div>
            </div>

            {profile.status === "approved" && (
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/quote"
                  className="inline-flex items-center gap-2 rounded-full bg-[#033e8d] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#052f69]"
                >
                  <FileText className="size-4" /> Request a quote
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-full border border-[#e4e9f2] bg-white px-5 py-2.5 text-sm font-semibold text-[#06234d] transition-colors hover:border-[#0fade8]"
                >
                  <MessageSquareText className="size-4" /> Browse products
                </Link>
              </div>
            )}

            <div className="rounded-3xl border border-[#e4e9f2] bg-white p-7">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-[#06234d]">Your details</h2>
                <Link
                  href="/profile/setup"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0489c2] hover:underline"
                >
                  <Pencil className="size-3.5" /> Edit
                </Link>
              </div>

              <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                {details.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#eef3fb] text-[#033e8d]">
                      <Icon className="size-4" />
                    </span>
                    <div className="min-w-0">
                      <dt className="text-xs font-medium uppercase tracking-wide text-[#94a3b8]">{label}</dt>
                      <dd className="mt-0.5 truncate text-sm font-semibold text-[#06234d]">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>

            <ActivityList
              icon={FileText}
              title="Your quote requests"
              description="Shipping quotes you've requested."
              emptyLabel="No quote requests yet."
              items={quoteItems}
            />

            <ActivityList
              icon={MessageSquareText}
              title="Your product enquiries"
              description="Enquiries you've sent from the catalog."
              emptyLabel="No product enquiries yet."
              items={enquiryItems}
            />

          </div>

          <div className="flex flex-col gap-6">
            <WalletCard summary={walletSummary} />
            <ReferralCodeCard code={profile.referral_code} />
            <div className="flex justify-start">
              <SignOutButton />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
