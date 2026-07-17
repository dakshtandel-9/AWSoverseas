import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAccount, suggestAvailableUsername } from "@/lib/account";
import { supabaseAdmin } from "@/lib/supabase/server";
import { AccountHero } from "@/components/account/account-hero";
import { ProfileSetupForm } from "@/components/account/profile-setup-form";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Complete your profile — AWSOverseas",
  robots: { index: false },
};

export default async function ProfileSetupPage() {
  const account = await getAccount();
  if (!account) redirect("/login?next=/profile/setup");

  const { profile } = account;
  const firstTime = profile.status === "incomplete";

  const suggestedUsername =
    profile.username ??
    (profile.first_name && profile.last_name
      ? await suggestAvailableUsername(profile.first_name, profile.last_name, profile.id)
      : "");

  let referrerLabel: string | undefined;
  if (profile.referred_by) {
    const { data: referrer } = await supabaseAdmin()
      .from("user_profiles")
      .select("first_name, last_name, username")
      .eq("id", profile.referred_by)
      .maybeSingle();
    if (referrer) {
      referrerLabel = `${referrer.first_name} ${referrer.last_name}${referrer.username ? ` (@${referrer.username})` : ""}`;
    }
  }

  return (
    <>
      <AccountHero
        eyebrow="Account"
        title={firstTime ? "Complete your profile" : "Edit your details"}
        subtitle={
          firstTime
            ? "A few details and a passport photo — then our team verifies your account for quoting."
            : "Update your contact or verification details. Your referral code stays the same."
        }
        right={firstTime ? "STEP 2 OF 2" : "ACCOUNT"}
      />

      <Section spacing="md" tone="soft">
        <ProfileSetupForm
          profile={profile}
          suggestedUsername={suggestedUsername}
          referrerLabel={referrerLabel}
        />
      </Section>
    </>
  );
}
