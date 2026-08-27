import Link from "next/link";
import { AlertTriangle, ArrowLeft, Reply } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/status";
import { isEmailConfigured } from "@/lib/email";
import { emailSenders } from "@/lib/email-senders";
import { getReplyDraft, isReplySource } from "@/lib/email-reply-draft";
import { adminPage } from "@/lib/admin-nav";
import { AdminPageHeader } from "@/components/admin/page-header";
import { SetupNotice } from "@/components/admin/setup-notice";
import { EmailComposer } from "@/components/admin/email-composer";
import { SentEmailRow, type SentEmail } from "@/components/admin/sent-email-row";

/** How many past sends the page keeps on screen before it stops being scannable. */
const HISTORY_LIMIT = 30;

export default async function AdminEmailPage({
  searchParams,
}: {
  /** Set by the Reply button on an inbox row. Absent for a blank compose. */
  searchParams: Promise<{ source?: string; id?: string }>;
}) {
  const { source, id } = await searchParams;
  const senders = emailSenders();
  const supabaseReady = isSupabaseConfigured();
  const emailReady = isEmailConfigured() && senders.length > 0;

  const [draft, history] = await Promise.all([
    isReplySource(source) && id ? getReplyDraft(source, id) : null,
    // `.data` is null rather than a throw when the table hasn't been created
    // yet, so the compose form still works before the migration is run.
    supabaseReady
      ? supabaseAdmin()
          .from("sent_emails")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(HISTORY_LIMIT)
      : null,
  ]);

  const sent: SentEmail[] = (history?.data as SentEmail[] | null) ?? [];

  return (
    <div>
      <AdminPageHeader href="/admin/email" />

      {!supabaseReady && (
        <div className="mt-6">
          <SetupNotice />
        </div>
      )}

      {!emailReady && (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-800">
          <AlertTriangle className="mt-0.5 size-5 shrink-0" />
          <div className="text-sm leading-relaxed">
            <p className="font-semibold">Sending isn&apos;t switched on yet.</p>
            <p className="mt-1">
              Add <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs">RESEND_API_KEY</code> and{" "}
              <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs">EMAIL_FROM</code> to your
              environment (see{" "}
              <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs">.env.example</code>), then reload
              this page.
            </p>
          </div>
        </div>
      )}

      {draft && (
        <div className="mt-6 flex max-w-3xl flex-wrap items-center gap-x-6 gap-y-3 rounded-2xl border border-[#e4e9f2] bg-white px-5 py-4">
          <div className="flex min-w-[18rem] flex-1 items-start gap-3">
            <Reply className="mt-0.5 size-4 shrink-0 text-[#94a3b8]" aria-hidden />
            <p className="min-w-0 text-sm leading-relaxed text-[#5b6b82]">
              Replying to <span className="font-semibold text-[#1A0A53]">{draft.who}</span>&rsquo;s {draft.what}. The
              draft below is a starting point — change anything, then send.
            </p>
          </div>
          <Link
            href={draft.backHref}
            className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-maroon-admin underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#002144]"
          >
            <ArrowLeft className="size-3.5" />
            Back to {adminPage(draft.backHref).item.label}
          </Link>
        </div>
      )}

      {emailReady && (
        <EmailComposer
          // Re-seeds the form when a second Reply link is opened from this page.
          key={draft ? `${source}-${id}` : "blank"}
          senders={senders}
          prefill={draft ?? undefined}
        />
      )}

      <section className="mt-12">
        <h2 className="text-sm font-bold text-[#1A0A53]">Sent from here</h2>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[#5b6b82]">
          Every email written on this page, newest first. Account and enquiry emails the site sends on its own
          aren&apos;t listed — those live in the Resend dashboard.
        </p>

        <div className="mt-4 flex flex-col gap-3">
          {sent.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-[#e4e9f2] px-5 py-10 text-center text-sm text-[#94a3b8]">
              Nothing sent from here yet.
            </p>
          ) : (
            sent.map((item) => <SentEmailRow key={item.id} item={item} />)
          )}
        </div>
      </section>
    </div>
  );
}
