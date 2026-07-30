import type { ReactNode } from "react";
import { Callout, StepList } from "@/components/admin/docs-kit";

/** External link that opens in a new tab — the admin will be juggling this page and the service's dashboard side by side. */
function Ext({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="font-semibold text-maroon-admin underline-offset-2 hover:underline"
    >
      {children}
    </a>
  );
}

function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-[#eef3fb] px-1.5 py-0.5 font-mono text-[13px] text-[#1A0A53]">
      {children}
    </code>
  );
}

type Guide = {
  id: string;
  title: string;
  lead: string;
  steps: { title: string; detail: ReactNode }[];
  after?: ReactNode;
};

const GUIDES: Guide[] = [
  {
    id: "guide-ga4",
    title: "Google Analytics 4",
    lead: "Shows who visits the site: daily visitors, most-read pages, countries, and which channels (Google, social, direct) bring people in.",
    steps: [
      {
        title: "Create an Analytics account",
        detail: (
          <>
            Go to <Ext href="https://analytics.google.com">analytics.google.com</Ext>, sign in with the
            company Google account, and click <strong>Start measuring</strong>.
          </>
        ),
      },
      {
        title: "Create a property",
        detail: (
          <>
            Name it <Code>aws overseas</Code>, set your timezone and currency, and answer the short
            business questions.
          </>
        ),
      },
      {
        title: "Add a web data stream",
        detail: (
          <>
            When asked to choose a platform, pick <strong>Web</strong>. Enter{" "}
            <Code>https://awsoverseas.com</Code> as the URL and any stream name.
          </>
        ),
      },
      {
        title: "Copy the Measurement ID",
        detail: (
          <>
            It's at the top right of the stream details screen and starts with <Code>G-</Code>.
          </>
        ),
      },
      {
        title: "Paste it above and save",
        detail: "Tracking is live on the very next page load — nothing to install.",
      },
    ],
    after: (
      <Callout>
        To confirm it works: open the website in another tab, then check{" "}
        <strong>Reports → Realtime</strong> in Analytics — you should see yourself as an active user
        within a minute.
      </Callout>
    ),
  },
  {
    id: "guide-gtm",
    title: "Google Tag Manager",
    lead: "A container that lets you (or an agency) add future marketing tags — remarketing, LinkedIn, TikTok — from Tag Manager's dashboard, without ever editing the website again.",
    steps: [
      {
        title: "Create an account and container",
        detail: (
          <>
            Go to <Ext href="https://tagmanager.google.com">tagmanager.google.com</Ext> and click{" "}
            <strong>Create Account</strong>. Account name: your company. Container name:{" "}
            <Code>awsoverseas.com</Code>. Platform: <strong>Web</strong>.
          </>
        ),
      },
      {
        title: "Copy the container ID",
        detail: (
          <>
            After accepting the terms you land in the workspace — the ID starting with{" "}
            <Code>GTM-</Code> is in the top bar.
          </>
        ),
      },
      {
        title: "Paste it above and save",
        detail: "The container snippet is now on every public page.",
      },
      {
        title: "Manage tags inside Tag Manager",
        detail: (
          <>
            Anything you add there goes live when you press <strong>Submit</strong> in Tag Manager —
            this website needs no further changes.
          </>
        ),
      },
    ],
    after: (
      <Callout kind="warning">
        Avoid double counting: if you connect Google Analytics directly above <em>and</em> also add a
        GA4 tag inside Tag Manager, every visit counts twice. Pick one home for each tag — the direct
        fields above are the simplest choice.
      </Callout>
    ),
  },
  {
    id: "guide-gsc",
    title: "Google Search Console",
    lead: "Google's own report on your search presence: which keywords show the site, how often people click, and any indexing problems. Essential for SEO.",
    steps: [
      {
        title: "Add the site as a property",
        detail: (
          <>
            Go to <Ext href="https://search.google.com/search-console">search.google.com/search-console</Ext>,
            choose <strong>URL prefix</strong>, and enter <Code>https://awsoverseas.com</Code>.
          </>
        ),
      },
      {
        title: "Pick the HTML tag verification method",
        detail: (
          <>
            Under "Other verification methods" choose <strong>HTML tag</strong>. Google shows a line
            like{" "}
            <Code>&lt;meta name="google-site-verification" content="…" /&gt;</Code>.
          </>
        ),
      },
      {
        title: "Paste it above and save — first",
        detail:
          "Copy the whole tag or just the long code inside content=\"…\" (both work) and save on this page before going back to Google.",
      },
      {
        title: "Click Verify in Search Console",
        detail: "Google checks the site's homepage, finds the tag, and confirms ownership.",
      },
      {
        title: "Submit the sitemap",
        detail: (
          <>
            In Search Console open <strong>Sitemaps</strong> and submit{" "}
            <Code>https://awsoverseas.com/sitemap.xml</Code> — it lists every page so Google indexes
            them faster.
          </>
        ),
      },
    ],
    after: (
      <Callout>
        Already connected Google Analytics above? Search Console can often verify automatically
        through it — if Verify succeeds without the tag, you can leave the field above empty.
      </Callout>
    ),
  },
  {
    id: "guide-bing",
    title: "Bing Webmaster Tools",
    lead: "The Search Console equivalent for Bing — which also powers DuckDuckGo and Yahoo results, and matters for buyers in some overseas markets.",
    steps: [
      {
        title: "Sign in",
        detail: (
          <>
            Go to <Ext href="https://www.bing.com/webmasters">bing.com/webmasters</Ext> with a
            Microsoft account.
          </>
        ),
      },
      {
        title: "Easiest path: import from Google",
        detail: (
          <>
            If Search Console is already verified, choose <strong>Import from Google Search
            Console</strong> — Bing copies the site and sitemap across and the verification field
            above can stay empty.
          </>
        ),
      },
      {
        title: "Manual path: HTML Meta Tag",
        detail: (
          <>
            Otherwise add the site manually and pick the <strong>HTML Meta Tag</strong> method. Copy
            the <Code>msvalidate.01</Code> tag or its content code, paste above, save, then click{" "}
            <strong>Verify</strong> in Bing.
          </>
        ),
      },
      {
        title: "Submit the sitemap",
        detail: (
          <>
            Under <strong>Sitemaps</strong>, submit <Code>https://awsoverseas.com/sitemap.xml</Code>.
          </>
        ),
      },
    ],
  },
  {
    id: "guide-clarity",
    title: "Microsoft Clarity",
    lead: "Free, unlimited session recordings and heatmaps — watch real visitors scroll, click, and hesitate, to see where the site loses them.",
    steps: [
      {
        title: "Create a project",
        detail: (
          <>
            Go to <Ext href="https://clarity.microsoft.com">clarity.microsoft.com</Ext>, sign in
            (Microsoft or Google account), click <strong>Add new project</strong>, and enter the site
            name and <Code>https://awsoverseas.com</Code>.
          </>
        ),
      },
      {
        title: "Find the Project ID",
        detail: (
          <>
            Open <strong>Settings → Overview</strong> — the Project ID is the short code shown there
            (it's also the code at the end of <Code>clarity.ms/tag/…</Code> in the install snippet).
          </>
        ),
      },
      {
        title: "Paste it above and save",
        detail:
          "Skip Clarity's own install instructions — the site already loads the tag once the ID is saved.",
      },
    ],
    after: (
      <Callout>
        Recordings and heatmaps typically start appearing in the Clarity dashboard within about two
        hours of the first tracked visits.
      </Callout>
    ),
  },
  {
    id: "guide-meta",
    title: "Meta Pixel",
    lead: "Required for running Facebook and Instagram ads properly: it measures what visitors do after clicking an ad and builds retargeting audiences.",
    steps: [
      {
        title: "Open Events Manager",
        detail: (
          <>
            Go to <Ext href="https://business.facebook.com/events_manager2">Meta Events Manager</Ext>{" "}
            (needs a Meta Business account — free to create at business.facebook.com).
          </>
        ),
      },
      {
        title: "Create a pixel",
        detail: (
          <>
            Click <strong>Connect data sources → Web</strong> and follow the prompts. Meta sometimes
            calls this a <em>dataset</em> now — it's the same thing.
          </>
        ),
      },
      {
        title: "Copy the Pixel ID",
        detail: "It's the long number shown directly under the pixel's name.",
      },
      {
        title: "Paste it above and save",
        detail:
          "Choose \"I'll install the code myself / do this later\" if Meta asks about installation — the site handles it.",
      },
    ],
    after: (
      <Callout>
        Every quote request, product enquiry, order, and contact message automatically fires a{" "}
        <strong>Lead</strong> event — in Ads Manager, optimize campaigns for Leads to make Meta find
        more buyers like the ones who actually enquire. Confirm it works under{" "}
        <strong>Events Manager → Test events</strong>.
      </Callout>
    ),
  },
  {
    id: "guide-ads",
    title: "Google Ads conversion tracking",
    lead: "Tells Google Ads which clicks turn into real enquiries, so campaigns optimize for leads instead of clicks — and you see cost per lead, not just cost per visit.",
    steps: [
      {
        title: "Create a conversion action",
        detail: (
          <>
            In <Ext href="https://ads.google.com">Google Ads</Ext>, open{" "}
            <strong>Goals → Conversions → Summary</strong> and click{" "}
            <strong>+ New conversion action → Website</strong>.
          </>
        ),
      },
      {
        title: "Add it manually",
        detail: (
          <>
            After the URL scan choose <strong>Add a conversion action manually</strong>. Category:{" "}
            <strong>Submit lead form</strong>. Name it something like <Code>Website lead</Code>.
          </>
        ),
      },
      {
        title: "Get the ID and label",
        detail: (
          <>
            On the tag setup step choose <strong>Install the tag yourself</strong>. Google shows a
            conversion ID starting with <Code>AW-</Code> and, in the event snippet's{" "}
            <Code>send_to</Code> line, a conversion <em>label</em> — the short code after the slash in{" "}
            <Code>AW-123456789/AbC-dEfGhIj</Code>.
          </>
        ),
      },
      {
        title: "Paste both above and save",
        detail:
          "Ignore Google's install instructions — the site already loads the tag and reports a conversion on every successful quote request, enquiry, order, and contact message.",
      },
    ],
    after: (
      <Callout>
        Test it by submitting an enquiry yourself — within a few hours the conversion action's status
        in Google Ads changes to <strong>Recording conversions</strong>. The AW- ID alone also enables
        remarketing audiences; the label is what makes lead conversions count.
      </Callout>
    ),
  },
];

export function IntegrationsGuide() {
  return (
    <section className="mt-14 max-w-3xl">
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">
        Setup Guide
      </p>
      <h2 className="mt-2 text-xl font-bold text-[#1A0A53] sm:text-2xl">
        How to connect each service
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-[#5b6b82]">
        Every connection works the same way: create the account on the service's website, copy one ID,
        paste it in the matching field above, and save. Nothing gets installed and no passwords are
        stored — these IDs are public by design. Removing an ID and saving disconnects that service
        just as instantly.
      </p>

      <div className="mt-8 flex flex-col gap-6">
        {GUIDES.map((guide) => (
          <article
            key={guide.id}
            id={guide.id}
            className="scroll-mt-24 rounded-2xl border border-[#e4e9f2] bg-white p-6 sm:p-7"
          >
            <h3 className="text-base font-bold text-[#1A0A53]">{guide.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-[#5b6b82]">{guide.lead}</p>
            <div className="mt-5">
              <StepList steps={guide.steps} />
            </div>
            {guide.after && <div className="mt-5">{guide.after}</div>}
          </article>
        ))}
      </div>
    </section>
  );
}
