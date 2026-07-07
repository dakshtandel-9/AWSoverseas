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
  Users,
} from "lucide-react";
import { getAccount, type AccountStatus } from "@/lib/account";
import { supabaseAdmin } from "@/lib/supabase/server";
import { AccountHero } from "@/components/account/account-hero";
import { ReferralCodeCard } from "@/components/account/referral-code-card";
import { SignOutButton } from "@/components/account/sign-out-button";
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

  const { data: referrals } = await supabaseAdmin()
    .from("user_profiles")
    .select("id, first_name, last_name, username, created_at")
    .eq("referred_by", profile.id)
    .order("created_at", { ascending: false });

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

            <div className="rounded-3xl border border-[#e4e9f2] bg-white p-7">
              <h2 className="inline-flex items-center gap-2 text-base font-bold text-[#06234d]">
                <Users className="size-4 text-[#0489c2]" />
                Your referrals
              </h2>
              <p className="mt-1 text-sm text-[#5b6b82]">People who signed up with your code.</p>

              {!referrals || referrals.length === 0 ? (
                <p className="mt-5 rounded-2xl border border-dashed border-[#e4e9f2] px-5 py-8 text-center text-sm text-[#94a3b8]">
                  No referrals yet — share your code to get started.
                </p>
              ) : (
                <ul className="mt-5 divide-y divide-[#eef3fb]">
                  {referrals.map((r) => (
                    <li key={r.id} className="flex items-center justify-between gap-3 py-3.5">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#06234d]">
                          {r.first_name} {r.last_name}
                        </p>
                        {r.username && <p className="truncate text-xs text-[#5b6b82]">@{r.username}</p>}
                      </div>
                      <span className="shrink-0 text-xs text-[#94a3b8]">Joined {formatDate(r.created_at)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-6">
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
