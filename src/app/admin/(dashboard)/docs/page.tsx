import type { Metadata } from "next";
import {
  LayoutDashboard,
  Users,
  Boxes,
  ShoppingBag,
  MessageSquareText,
  Mail,
  FileText,
  Wallet,
  Settings,
  KeyRound,
  ImageIcon,
} from "lucide-react";
import { DocsToc, type DocSection } from "@/components/admin/docs-toc";
import { DocSection as Section, Callout, StepList, FieldTable, Badge, Kbd } from "@/components/admin/docs-kit";

export const metadata: Metadata = { title: "Documentation | Admin | aws overseas", robots: { index: false, follow: false } };

const SECTIONS: DocSection[] = [
  { id: "overview", label: "Overview" },
  { id: "dashboard", label: "Dashboard" },
  { id: "users", label: "Users" },
  { id: "products", label: "Products" },
  { id: "orders", label: "Orders" },
  { id: "enquiries", label: "Enquiries" },
  { id: "quotes", label: "Quote requests & tracking" },
  { id: "wallet", label: "Referral wallet & withdrawals" },
  { id: "messages", label: "Messages" },
  { id: "settings", label: "Site settings" },
  { id: "accounts", label: "Accounts & access" },
  { id: "data-model", label: "How data flows" },
  { id: "glossary", label: "Status glossary" },
];

export default function AdminDocsPage() {
  return (
    <div>
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">Reference</p>
      <h1 className="mt-2 text-2xl font-bold text-[#002144] sm:text-3xl">Documentation</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#5b6b82]">
        Everything this admin panel does and how to run it day to day — written for whoever is operating
        aws overseas, not for a developer. Every page in the sidebar has a matching section below.
      </p>

      <div className="mt-8 flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12">
        <aside className="top-24 shrink-0 lg:sticky lg:w-56">
          <DocsToc sections={SECTIONS} />
        </aside>

        <div className="min-w-0 flex-1 rounded-2xl border border-[#e4e9f2] bg-white px-6 sm:px-8">
          <Section
            id="overview"
            eyebrow="Start here"
            title="What this panel is for"
            intro="This is the control room for the aws overseas website. Everything a visitor sees or submits on the public site — the product catalog, contact details, quote and enquiry forms — is managed from here. Nothing on the public site is hardcoded; it all reads from what's entered in this panel."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: Boxes, title: "Catalog & content", detail: "Products shown on the public site are created and edited here." },
                { icon: MessageSquareText, title: "Customer requests", detail: "Orders, enquiries, quote requests and contact messages all land in an inbox here to action." },
                { icon: Users, title: "Customer accounts", detail: "New sign-ups wait for approval before they can place an order or request a quote." },
                { icon: Wallet, title: "Referral payouts", detail: "Customers earn wallet credit for referrals; payout requests are approved here." },
              ].map(({ icon: Icon, title, detail }) => (
                <div key={title} className="flex gap-3 rounded-2xl border border-[#e4e9f2] p-4">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#eef3fb] text-[#002144]">
                    <Icon className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#002144]">{title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-[#5b6b82]">{detail}</p>
                  </div>
                </div>
              ))}
            </div>

            <Callout>
              A banner reading <strong>&ldquo;Supabase isn&rsquo;t connected yet&rdquo;</strong> on any page means the
              database keys are missing from the server&rsquo;s environment variables. Every list will show empty and
              every form will fail to save until that&rsquo;s fixed — see{" "}
              <a href="#accounts" className="font-semibold underline underline-offset-2">
                Accounts &amp; access
              </a>
              .
            </Callout>
          </Section>

          <Section
            id="dashboard"
            eyebrow="/admin"
            title="Dashboard"
            intro="The landing page after login. Six tiles, each a live count pulled straight from the database — nothing here is cached or delayed."
          >
            <FieldTable
              columns={["Tile", "What it counts"]}
              rows={[
                ["Users awaiting approval", "Sign-ups with status pending — see Users."],
                ["Unread orders", "Order requests not yet opened — see Orders."],
                ["Unread enquiries", "Open enquiries not yet opened — see Enquiries."],
                ["Unread messages", "Contact form submissions not yet opened — see Messages."],
                ["Unread quote requests", "Quote form submissions not yet opened — see Quote requests."],
                ["Pending withdrawals", "Wallet payout requests awaiting a decision — see Referral wallet."],
              ]}
            />
            <p className="text-sm leading-relaxed text-[#5b6b82]">
              Click any tile (or its <strong>View</strong> link) to jump straight to that inbox. A good habit is to
              start every session here — it tells you exactly what&rsquo;s waiting without opening every page.
            </p>
          </Section>

          <Section
            id="users"
            eyebrow="/admin/users"
            title="Users"
            intro="Every customer account created on the public site, newest first. A customer signs up with email and password, then fills in a profile (name, phone, company, country, passport details) before they can be approved."
          >
            <StepList
              steps={[
                {
                  title: "A new sign-up appears under “Awaiting review”",
                  detail: "Only once they've completed their profile — an account that signed up but never finished the profile form stays invisible here (status incomplete) until they do.",
                },
                {
                  title: "Open the row to review their details",
                  detail: "Name, email, phone, company, country, and the passport front/back images they uploaded during profile setup.",
                },
                {
                  title: "Approve or reject",
                  detail: (
                    <>
                      Approving unlocks <strong>Order</strong> and <strong>Request a Quote</strong> for that customer —
                      both require an approved account. Rejecting blocks them from those two actions but does not
                      delete the account.
                    </>
                  ),
                },
              ]}
            />
            <Callout>
              Anyone — including a guest with no account — can still send a product <strong>Enquiry</strong> or fill out
              the public contact form. Approval only gates the two &ldquo;paid transaction&rdquo; paths: placing an
              order and requesting a shipping quote.
            </Callout>
            <FieldTable
              rows={[
                ["Referred by", "If this customer signed up using someone else's referral link, that referrer's name shows here. See Referral wallet for how referrals turn into payouts."],
                ["Username", "Auto-generated from their name at sign-up (e.g. john-doe), used in referral lists elsewhere in the panel."],
              ]}
            />
          </Section>

          <Section
            id="products"
            eyebrow="/admin/products"
            title="Products"
            intro="The catalog shown on the public /products page, displayed as an image grid. No prices are shown anywhere on the site by design — visitors send an Enquiry or Order instead of seeing a price."
          >
            <StepList
              steps={[
                { title: "Click “Add product”", detail: "Opens a form for name, category, description, and an image." },
                {
                  title: "Upload the product image first",
                  detail: "The image field uploads to Cloudinary on its own — wait until the thumbnail appears before saving the rest of the form, otherwise the product saves with no image.",
                },
                { title: "Save", detail: "The product appears on the public catalog immediately — no rebuild or redeploy needed." },
                {
                  title: "Active vs. inactive",
                  detail: "Turning a product inactive hides it from the public catalog without deleting it, so historical orders/enquiries that reference it still show correctly.",
                },
                {
                  title: "Sort order",
                  detail: "Controls the display order on the public grid — lower numbers show first.",
                },
              ]}
            />
            <Callout kind="warning">
              Deleting a product does not delete past orders or enquiries for it — those keep a snapshot of the
              product&rsquo;s name so the history stays readable even after the product is gone.
            </Callout>
          </Section>

          <Section
            id="orders"
            eyebrow="/admin/enquiries — labeled Orders"
            title="Orders"
            intro="Submitted from the Order button on a product card, which only signed-in, approved customers can use. This is the pricing workflow — an order isn't final until you quote it."
          >
            <StepList
              steps={[
                { title: "A new order lands unread", detail: "Contains the customer's contact details, the product, and any message they left." },
                {
                  title: "Price it out",
                  detail: "Enter a quoted price, quantity, weight, and an expected delivery date, then mark it Quoted. The customer sees this quote reflected on their own profile.",
                },
                {
                  title: "Or reject it",
                  detail: "Add a rejection reason — it's shown back to the customer so they understand why.",
                },
                {
                  title: "“Create order” button",
                  detail: "Lets you log an order on a customer's behalf — useful for phone or WhatsApp orders that didn't come through the website. Pick the customer and product from the dropdowns.",
                },
              ]}
            />
            <FieldTable
              rows={[
                ["Referred by", "If the ordering customer was referred by someone, that referrer's name shows here — relevant when deciding whether to credit a referral reward."],
                ["Quote status", "awaiting_quote → quoted or rejected. Drives what the customer sees on their profile."],
              ]}
            />
          </Section>

          <Section
            id="enquiries"
            eyebrow="/admin/enquiries-open — labeled Enquiries"
            title="Enquiries"
            intro="Submitted from the Enquiry button on a product card — open to anyone, no account required. This is a lightweight lead inbox, not a pricing workflow: no quote/approve/reject panel, just contact details and a message."
          >
            <p className="text-sm leading-relaxed text-[#5b6b82]">
              Follow up directly by email or phone using the contact details on the row. Since guests can submit
              these, some rows may have no linked customer account at all.
            </p>
          </Section>

          <Section
            id="quotes"
            eyebrow="/admin/quotes"
            title="Quote requests & shipment tracking"
            intro="Submitted from the public Request a Quote form (requires an approved account, same gate as Orders). Every quote request is also the seed record for the public shipment tracker."
          >
            <StepList
              steps={[
                { title: "Review the request", detail: "Service type, shipment type, origin/destination country, and contact details." },
                {
                  title: "“Create quote” button",
                  detail: "Logs a quote request on behalf of an existing customer, same idea as Orders' manual-entry button.",
                },
                {
                  title: "Tracking number",
                  detail: "Every quote request is issued a tracking number automatically at submission. The customer (or anyone with the number) can look up progress at the public /tracking page — no login needed there.",
                },
                {
                  title: "Update shipment status",
                  detail: "Move the shipment through its stages — Pending → Collected → Customs cleared → In transit → Delivered — and add milestones (a location + note) that build up the timeline the customer sees on the tracker.",
                },
              ]}
            />
            <Callout>
              Updating the shipment status here is what customers see when they check their tracking number on the
              public site — treat it as the source of truth for &ldquo;where is my shipment right now.&rdquo;
            </Callout>
          </Section>

          <Section
            id="wallet"
            eyebrow="/admin/withdrawals"
            title="Referral wallet & withdrawals"
            intro="Customers get a personal referral code and link at sign-up. When someone they referred gets an order or quote approved, you can credit the referrer's wallet. Customers then request to withdraw (cash out) that balance."
          >
            <StepList
              steps={[
                {
                  title: "Crediting a referral",
                  detail: "From an approved Order or Quote request row, if the customer was referred, you'll see who referred them and can grant a wallet credit tied to that specific order/quote — this ties the credit to a source so it's traceable and can't be double-counted by accident.",
                },
                {
                  title: "Customer requests a withdrawal",
                  detail: "They do this from their own profile/wallet page once they have a balance. It appears here under “Awaiting review.”",
                },
                { title: "Approve or reject", detail: "Approving means you've paid them outside the site (bank transfer, etc.) and are confirming it here." },
              ]}
            />
            <p className="text-sm leading-relaxed text-[#5b6b82]">
              A customer&rsquo;s wallet balance is always the sum of their credit history — there&rsquo;s no single
              &ldquo;balance&rdquo; number that can drift out of sync; it&rsquo;s recalculated from the ledger every time.
            </p>
          </Section>

          <Section
            id="messages"
            eyebrow="/admin/messages"
            title="Messages"
            intro="Submissions from the general Contact page form — name, company, email, phone, the service they're asking about, and their message. No account or approval needed to send one."
          >
            <p className="text-sm leading-relaxed text-[#5b6b82]">
              This is the simplest inbox in the panel — read, then follow up by email or phone directly. There&rsquo;s
              no status workflow beyond read/unread.
            </p>
          </Section>

          <Section
            id="settings"
            eyebrow="/admin/settings"
            title="Site settings"
            intro="The single source of truth for contact details shown across the live site — the footer, the Contact page, and every WhatsApp link on the site all pull from here."
          >
            <FieldTable
              rows={[
                ["Primary / secondary phone", "Shown in the footer and Contact page. Secondary is optional."],
                ["Email address", "Shown in the footer and Contact page."],
                ["WhatsApp number", "Digits only, with country code and no plus sign or spaces (e.g. 919876543210) — this is inserted directly into WhatsApp “click to chat” links across the site."],
                ["Address", "Shown on the Contact page."],
              ]}
            />
            <Callout kind="warning">
              Changes here go live immediately on the public site — there&rsquo;s no draft/preview step, so double-check
              a phone number or the WhatsApp digit format before saving.
            </Callout>
          </Section>

          <Section
            id="accounts"
            eyebrow="Access"
            title="Accounts & access"
            intro="This admin panel uses a single shared password — it is not tied to an individual admin account, and there is no separate login per staff member."
          >
            <FieldTable
              columns={["Concept", "Detail"]}
              rows={[
                ["Admin login", "One shared password (set by whoever manages the server's environment variables). Logging in sets a signed session cookie in your browser."],
                ["Log out", "Bottom-left of the sidebar — ends your session on this device only."],
                ["Customer accounts", "Entirely separate system — customers sign up themselves on the public site with their own email and password. See Users."],
                ["“Supabase isn't connected” banner", "Means the site's database connection isn't configured on the server. This is a hosting/environment issue, not something fixed from within the panel — it needs the database keys added to the server configuration."],
              ]}
            />
            <div className="flex gap-3 rounded-2xl border border-[#e4e9f2] p-4">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#eef3fb] text-[#002144]">
                <KeyRound className="size-4" />
              </span>
              <p className="text-sm leading-relaxed text-[#5b6b82]">
                If the shared admin password needs to change, or if the panel shows the &ldquo;not connected&rdquo;
                banner, that requires updating server configuration values — pass this along to whoever manages the
                site&rsquo;s hosting rather than looking for a setting inside the panel.
              </p>
            </div>
          </Section>

          <Section
            id="data-model"
            eyebrow="Behind the scenes"
            title="How the pieces connect"
            intro="A quick mental model of how public-site actions turn into things you see in this panel."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: Boxes, text: "A product created in Products appears on the public catalog instantly." },
                { icon: ShoppingBag, text: "Order button on a product (signed-in, approved customers only) → Orders inbox, priced or rejected there." },
                { icon: MessageSquareText, text: "Enquiry button on a product (anyone) → Enquiries inbox, a simple lead." },
                { icon: FileText, text: "Request a Quote form (approved customers only) → Quote requests, which also issues a public tracking number." },
                { icon: Mail, text: "Contact page form (anyone) → Messages inbox." },
                { icon: Users, text: "Public sign-up + profile → Users, gated pending → approved before Orders/Quotes unlock." },
                { icon: Wallet, text: "Approved Order/Quote from a referred customer → credit the referrer's wallet → they request a Withdrawal." },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex gap-3 rounded-2xl border border-[#e4e9f2] p-4">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#eef3fb] text-[#002144]">
                    <Icon className="size-4" />
                  </span>
                  <p className="text-sm leading-relaxed text-[#5b6b82]">{text}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-3 rounded-2xl border border-[#e4e9f2] p-4">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#eef3fb] text-[#002144]">
                <ImageIcon className="size-4" />
              </span>
              <p className="text-sm leading-relaxed text-[#5b6b82]">
                Product photos and customer passport uploads are all stored with the same image
                hosting service, separate from the main database — which is why an image upload always finishes
                (and shows a thumbnail) as its own step before the rest of a form can be saved.
              </p>
            </div>
          </Section>

          <Section
            id="glossary"
            eyebrow="Reference"
            title="Status glossary"
            intro="The status words used consistently across the panel."
          >
            <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#5b6b82]">Users</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge tone="neutral">Incomplete</Badge>
                  <Badge tone="amber">Pending</Badge>
                  <Badge tone="green">Approved</Badge>
                  <Badge tone="red">Rejected</Badge>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#5b6b82]">Orders</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge tone="amber">Awaiting quote</Badge>
                  <Badge tone="green">Quoted</Badge>
                  <Badge tone="red">Rejected</Badge>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#5b6b82]">Shipment tracking</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge>Pending</Badge>
                  <Badge>Collected</Badge>
                  <Badge>Customs cleared</Badge>
                  <Badge>In transit</Badge>
                  <Badge tone="green">Delivered</Badge>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#5b6b82]">Withdrawals</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge tone="amber">Pending</Badge>
                  <Badge tone="green">Approved</Badge>
                  <Badge tone="red">Rejected</Badge>
                </div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-[#5b6b82]">
              Unread counts (the numbers on the Dashboard tiles) are separate from these statuses — a row can be
              read and still be, for example, awaiting quote.
            </p>
          </Section>

          <div className="flex items-center gap-2 border-t border-[#e4e9f2] py-6 text-xs text-[#94a3b8]">
            <LayoutDashboard className="size-3.5" />
            <span>
              Use <Kbd>Cmd/Ctrl+F</Kbd> to search this page for a specific term.
            </span>
            <span className="ml-auto inline-flex items-center gap-1">
              <Settings className="size-3.5" /> Docs live at /admin/docs
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
