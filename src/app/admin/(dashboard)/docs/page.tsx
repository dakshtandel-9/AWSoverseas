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
import { AdminPageHeader } from "@/components/admin/page-header";

export const metadata: Metadata = { title: "Documentation | Admin | AWS OVERSEAS impex", robots: { index: false, follow: false } };

const SECTIONS: DocSection[] = [
  { group: "Start here", id: "overview", label: "What this panel is for" },
  { group: "Start here", id: "finding-your-way", label: "Finding your way around" },
  { group: "Start here", id: "dashboard", label: "Dashboard" },
  { group: "Inbox", id: "orders", label: "Orders" },
  { group: "Inbox", id: "enquiries", label: "Product enquiries" },
  { group: "Inbox", id: "quotes", label: "Quote enquiries" },
  { group: "Inbox", id: "warehouse-bookings", label: "Warehouse bookings" },
  { group: "Inbox", id: "messages", label: "Contact messages" },
  { group: "Outbox", id: "send-email", label: "Send email" },
  { group: "Customers", id: "users", label: "Users" },
  { group: "Customers", id: "referrals", label: "Referrals" },
  { group: "Customers", id: "wallets", label: "Wallets" },
  { group: "Customers", id: "newsletter", label: "Subscribers" },
  { group: "Catalog", id: "categories", label: "Categories" },
  { group: "Catalog", id: "products", label: "Products" },
  { group: "Website content", id: "offices", label: "Offices" },
  { group: "Website content", id: "associates", label: "Associates" },
  { group: "Website content", id: "footer-contacts", label: "Footer contacts" },
  { group: "Setup", id: "settings", label: "Site settings" },
  { group: "Setup", id: "seo", label: "SEO & analytics" },
  { group: "Setup", id: "accounts", label: "Accounts & access" },
  { group: "Reference", id: "data-model", label: "How data flows" },
  { group: "Reference", id: "glossary", label: "Status glossary" },
];

export default function AdminDocsPage() {
  return (
    <div>
      <AdminPageHeader href="/admin/docs" />

      <div className="mt-8 flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12">
        <aside className="top-24 shrink-0 lg:sticky lg:w-56">
          <DocsToc sections={SECTIONS} />
        </aside>

        <div className="min-w-0 flex-1 rounded-2xl border border-[#e4e9f2] bg-white px-6 sm:px-8">
          <Section
            id="overview"
            eyebrow="Start here"
            title="What this panel is for"
            intro="This is the control room for the AWS OVERSEAS impex website. Everything a visitor sees or submits on the public site — the product catalog, contact details, quote and enquiry forms — is managed from here. Nothing on the public site is hardcoded; it all reads from what's entered in this panel."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: Boxes, title: "Catalog & content", detail: "Products shown on the public site are created and edited here." },
                { icon: MessageSquareText, title: "Customer enquiries", detail: "Orders, product enquiries, quote enquiries and contact messages all land in an inbox here to action." },
                { icon: Users, title: "Customer accounts", detail: "New sign-ups wait for approval before they can place an order or request a quote." },
                { icon: Wallet, title: "Referral wallet", detail: "Customers earn wallet credit for referrals; you grant and adjust that credit here." },
              ].map(({ icon: Icon, title, detail }) => (
                <div key={title} className="flex gap-3 rounded-2xl border border-[#e4e9f2] p-4">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#eef3fb] text-[#1A0A53]">
                    <Icon className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#1A0A53]">{title}</p>
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
            id="finding-your-way"
            eyebrow="Start here"
            title="Finding your way around"
            intro="The sidebar is grouped by the job you came to do, and every page is titled with the exact words on the link you clicked. The eyebrow above each page title names the group it belongs to, so you always know where you are."
          >
            <FieldTable
              columns={["Sidebar group", "What lives there"]}
              rows={[
                ["Inbox", "Everything a customer sent you: orders, product enquiries, quote enquiries, warehouse bookings and contact messages. These are the pages that carry a number badge when something is waiting."],
                ["Customers", "The people behind those enquiries — accounts to approve, who referred whom, wallet balances, and newsletter subscribers."],
                ["Catalog", "The categories and products shown on the public site."],
                ["Website content", "Blocks of the public site you edit directly: offices and associates on the Contact page, and the footer's contact columns."],
                ["Setup", "Configuration rather than day-to-day work: site settings, tracking IDs, and this documentation."],
              ]}
            />
            <Callout>
              A red number beside a sidebar link is the count of items on that page you haven&rsquo;t opened yet.
              The count clears as you read each item, so an empty sidebar means an empty desk.
            </Callout>
          </Section>

          <Section
            id="dashboard"
            eyebrow="/admin"
            title="Dashboard"
            intro="The landing page after login, and the fastest way to see what needs doing. Every count is live from the database — nothing here is cached or delayed."
          >
            <FieldTable
              columns={["Section", "What it shows"]}
              rows={[
                ["Needs you now", "One card per queue that has unopened items. Queues with nothing in them are left out entirely, so a clear desk looks clear instead of showing six zeros."],
                ["Latest arrivals", "The eight most recent unopened items across every queue, newest first, with who sent it and what it was about. Click a row to open that queue."],
                ["All clear", "The queues with nothing waiting, kept as small links so you can still reach them."],
              ]}
            />
            <p className="text-sm leading-relaxed text-[#5b6b82]">
              A good habit is to start every session here — it tells you exactly what&rsquo;s waiting without
              opening every page.
            </p>
          </Section>

          <Section
            id="orders"
            eyebrow="/admin/orders"
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
                  title: "“New order” button",
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
            eyebrow="/admin/enquiries"
            title="Product enquiries"
            intro="Submitted from the Enquiry button on a product card — open to anyone, no account required. This is a lightweight lead inbox, not a pricing workflow: no quote/approve/reject panel, just contact details and a message."
          >
            <p className="text-sm leading-relaxed text-[#5b6b82]">
              Open a row and press <strong>Reply by email</strong> to answer from the panel — the draft arrives
              addressed to them, naming the product they asked about. The phone number is on the row too. Since
              guests can submit these, some rows may have no linked customer account at all.
            </p>
          </Section>

          <Section
            id="quotes"
            eyebrow="/admin/quotes"
            title="Quote enquiries"
            intro="Shipping enquiries sent from the public Enquiry now page (requires an approved account, same gate as Orders). Every quote enquiry is also the seed record for the public shipment tracker."
          >
            <StepList
              steps={[
                { title: "Review the enquiry", detail: "Service type, shipment type, origin/destination country, and contact details." },
                {
                  title: "Reply by email",
                  detail: (
                    <>
                      Opens the compose page with the quote half-written — addressed to the customer, subject naming
                      the route, and the enquiry quoted underneath. Fill in the rate and transit time, then send.
                    </>
                  ),
                },
                {
                  title: "“New quote enquiry” button",
                  detail: "Logs a quote enquiry on behalf of an existing customer, same idea as Orders' manual-entry button.",
                },
                {
                  title: "Tracking number",
                  detail: "Every quote enquiry is issued a tracking number automatically at submission. The customer (or anyone with the number) can look up progress at the public /tracking page — no login needed there.",
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
            id="warehouse-bookings"
            eyebrow="/admin/warehouse-bookings"
            title="Warehouse bookings"
            intro="Storage requests from the “Book a Warehouse” popup on the Enquiry now page. This is a separate ask from a shipping enquiry — someone wants space, not freight."
          >
            <FieldTable
              rows={[
                ["Warehouse type", "The kind of storage the customer picked in the popup."],
                ["Address", "Where the goods are coming from or going to."],
                ["Notes", "Anything else they typed. Often the size or duration they need."],
              ]}
            />
            <p className="text-sm leading-relaxed text-[#5b6b82]">
              There&rsquo;s no status workflow here beyond read/unread — confirm availability with{" "}
              <strong>Reply by email</strong> or by phone, then mark the request read so it drops off the dashboard.
            </p>
          </Section>

          <Section
            id="messages"
            eyebrow="/admin/messages"
            title="Contact messages"
            intro="Submissions from the general Contact page form — name, company, email, phone, the service they're asking about, and their message. No account or approval needed to send one."
          >
            <p className="text-sm leading-relaxed text-[#5b6b82]">
              This is the simplest inbox in the panel — read, then answer. Open a message and press{" "}
              <strong>Reply by email</strong> to write back from the panel with the reply already drafted, or use the
              phone number to call. There&rsquo;s no status workflow beyond read/unread.
            </p>
          </Section>

          <Section
            id="send-email"
            eyebrow="/admin/email"
            title="Send email"
            intro="A compose box that sends from the company's own addresses. The email leaves as admin@awsoverseas.com or sales@awsoverseas.com — not from a personal account — and the recipient's Reply goes back to that mailbox in Hostinger webmail."
          >
            <StepList
              steps={[
                {
                  title: "Start from an enquiry, or from a blank page",
                  detail: (
                    <>
                      Open a row in Contact messages, Product enquiries, Quote enquiries or Warehouse bookings and
                      press <strong>Reply by email</strong>. It brings you here with the reply already addressed and
                      written — a subject, an opening, and a quote of what they sent, so you don&rsquo;t need their
                      enquiry open in another tab. Nothing is sent by pressing it. Everything is editable, and the
                      email only goes when you press Send here.
                    </>
                  ),
                },
                {
                  title: "Pick who it comes from",
                  detail: (
                    <>
                      The <strong>From</strong> strip at the top of the form lists every mailbox the panel may send as.
                      Choose the one that fits the message — a quote goes out from sales@, an account or billing
                      matter from admin@. Whichever you pick is the address the customer replies to.
                    </>
                  ),
                },
                {
                  title: "Address it",
                  detail: (
                    <>
                      Several addresses in <strong>To</strong> are fine — separate them with commas, and everyone sees
                      everyone. Use <strong>BCC</strong> when the recipients shouldn&rsquo;t see each other, which is
                      what an announcement to a list needs. One email can carry 50 addresses in total.
                    </>
                  ),
                },
                {
                  title: "Sign it",
                  detail: (
                    <>
                      <strong>Signed by</strong> puts your name and job title above the company name in the
                      signature. Fill it in once — the panel remembers it on this computer for the next email. Leave
                      both blank and the signature leads with AWS OVERSEAS impex, which is what an announcement to a
                      list wants. The logo, office address and phone number are added for you; the address and phone
                      come from Site settings, so correcting them there fixes every email sent afterwards.
                    </>
                  ),
                },
                {
                  title: "Choose branded or plain",
                  detail: (
                    <>
                      <strong>Branded</strong> wraps the message in the masthead, route strip and banner — the same
                      shell as the automatic account emails, right for announcements. <strong>Plain</strong> sends the
                      words with the same details set as small text and no logo, which is what a reply to one
                      customer should look like: a masthead and a logo card over two sentences reads as marketing,
                      and marketing is what gets filtered.
                    </>
                  ),
                },
                {
                  title: "Send, then check the list below",
                  detail: (
                    <>
                      Every send is recorded under <strong>Sent from here</strong> with the full message. A send the
                      provider refused is recorded too, marked <Badge tone="red">Not sent</Badge> with the reason —
                      open it, fix what it names, and send again.
                    </>
                  ),
                },
              ]}
            />

            <Callout kind="warning">
              Sending is not the same as arriving. The panel reports that the email provider accepted the message; the
              recipient&rsquo;s mail server can still bounce it afterwards or drop it in spam. Delivery itself is
              visible in the Resend dashboard, not here.
            </Callout>

            <p className="text-sm leading-relaxed text-[#5b6b82]">
              Replies don&rsquo;t come back to this panel — they land in the Hostinger inbox for whichever address
              sent the message. This page sends; webmail receives.
            </p>

            <p className="text-sm leading-relaxed text-[#5b6b82]">
              To add another address to the From list, a developer sets{" "}
              <code className="rounded bg-[#eef3fb] px-1.5 py-0.5 font-mono text-xs text-[#1A0A53]">
                EMAIL_FROM_EXTRA
              </code>{" "}
              in the site&rsquo;s environment. The mailbox has to exist in Hostinger first, or replies to it bounce.
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
                  detail: "Name, email, phone, company, country, and the ID number (passport, Aadhaar, or national ID) they entered during profile setup.",
                },
                {
                  title: "Approve or reject",
                  detail: (
                    <>
                      Approving unlocks <strong>Order</strong> and <strong>Enquiry now</strong> for that customer —
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
                ["Referred by", "If this customer signed up using someone else's referral link, that referrer's name shows here. See Referral wallet for how referrals turn into wallet credit."],
                ["Username", "Auto-generated from their name at sign-up (e.g. john-doe), used in referral lists elsewhere in the panel."],
              ]}
            />
          </Section>

          <Section
            id="referrals"
            eyebrow="/admin/referrals"
            title="Referrals"
            intro="Every sign-up that used someone else's referral code, grouped under the customer who sent them. Read-only: this page shows you who earned what, and you pay it out from Wallets."
          >
            <p className="text-sm leading-relaxed text-[#5b6b82]">
              Each customer gets a referral code at sign-up. When a new customer enters that code, they appear
              under the referrer here. Use it to check a claim before crediting anyone.
            </p>
          </Section>

          <Section
            id="wallets"
            eyebrow="/admin/wallets"
            title="Wallets"
            intro="Customers get a personal referral code and link at sign-up. When someone they referred gets an order or quote approved, you can credit the referrer's wallet. Customers see that balance on their own wallet page."
          >
            <StepList
              steps={[
                {
                  title: "Crediting a referral",
                  detail: "From an approved Order or Quote enquiry row, if the customer was referred, you'll see who referred them and can grant a wallet credit tied to that specific order/quote — this ties the credit to a source so it's traceable and can't be double-counted by accident.",
                },
                {
                  title: "Adjusting a balance by hand",
                  detail: "Wallets lists every customer with their balance. Open one to add credit (a goodwill bonus, a reward that didn't come from a booking) or deduct it (reversing a mistaken credit, a reward paid out elsewhere). A reason is required on both — the customer reads it.",
                },
                {
                  title: "The customer sees it",
                  detail: "Credits and deductions show up on their profile wallet page as activity, with the balance recalculated from the ledger.",
                },
              ]}
            />
            <p className="text-sm leading-relaxed text-[#5b6b82]">
              A customer&rsquo;s wallet balance is always the sum of their credit history — there&rsquo;s no single
              &ldquo;balance&rdquo; number that can drift out of sync; it&rsquo;s recalculated from the ledger every time.
              A deduction is added as its own negative line rather than erasing an earlier credit, so the history
              always explains how the balance got where it is.
            </p>
          </Section>

          <Section
            id="newsletter"
            eyebrow="/admin/newsletter"
            title="Subscribers"
            intro="Everyone who entered their email in the newsletter form in the site footer. Listed newest first, with the date they signed up."
          >
            <p className="text-sm leading-relaxed text-[#5b6b82]">
              This panel doesn&rsquo;t send newsletters — it collects the list. Export or copy the addresses into
              whichever mailing tool you use.
            </p>
          </Section>

          <Section
            id="categories"
            eyebrow="/admin/categories"
            title="Categories"
            intro="The category tree customers browse. Categories are the grid on the public Products page and the Products dropdown in the site header, and every product must sit in one."
          >
            <StepList
              steps={[
                { title: "Create a category", detail: "Give it a name and an image. The image is what visitors see in the grid, so use something representative." },
                { title: "Nest as deep as you need", detail: "Open a category and add a subcategory inside it. A subcategory behaves exactly like a category — it can hold products or more subcategories." },
                { title: "Add products to it", detail: "Open the category and add products from there, or set the category on the product itself." },
              ]}
            />
            <Callout kind="warning">
              Deleting a category does not delete the products inside it — they become unfiled, which means they
              show nowhere on the public site. Check <strong>Products</strong> after deleting a category.
            </Callout>
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
                  detail: "The image field uploads to Cloudflare R2 on its own — wait until the thumbnail appears before saving the rest of the form, otherwise the product saves with no image.",
                },
                { title: "Save", detail: "The product appears on the public catalog immediately — no rebuild or redeploy needed." },
                {
                  title: "Active vs. inactive",
                  detail: "Turning a product inactive hides it from the public catalog without deleting it, so historical orders and product enquiries that reference it still show correctly.",
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
            id="offices"
            eyebrow="/admin/offices"
            title="Offices"
            intro="The office directory below the map on the Contact page. A group is a heading — “India Offices”, “International Offices”, or anything else you name — and every office card sits under one group."
          >
            <StepList
              steps={[
                {
                  title: "Create a group",
                  detail:
                    "Click New group and give it a heading, an optional description, and an order number — lower numbers appear higher on the page.",
                },
                {
                  title: "Add offices to it",
                  detail:
                    "Click Add office on that group, then fill in the office name, address, up to two phone numbers, an email, and optionally a Google Maps link.",
                },
                {
                  title: "Save",
                  detail:
                    "The card appears on the Contact page straight away, three to a row on desktop and stacked on mobile.",
                },
              ]}
            />
            <FieldTable
              rows={[
                ["Office name", "The card heading, e.g. “Mumbai Office”."],
                ["Address", "Shown under the name. Written exactly as you type it."],
                ["Phone number / Alternative", "Both are optional and both become tap-to-call links. Leave the second blank if there is only one line."],
                ["Email address", "Becomes a tap-to-email link on the card."],
                ["Google Maps link", "Optional. Adds a “View on map” link; leave blank to hide it."],
                ["Order", "Position within the group — lower numbers come first."],
                ["Visibility", "Hidden keeps the office in the panel but off the public site."],
              ]}
            />
            <Callout kind="warning">
              Deleting a group deletes every office inside it. Hide the group instead if you only want it off
              the site for now. A group with no offices is skipped on the Contact page.
            </Callout>
          </Section>

          <Section
            id="associates"
            eyebrow="/admin/associates"
            title="Associates"
            intro="The photo tiles below the enquiry form on the Contact page. Each tile is a city, and opens a card with the local associate's name, address, phone and email."
          >
            <FieldTable
              rows={[
                ["City", "The name shown across the bottom of the photo tile."],
                ["Photo", "The tile image. Portrait or square images sit best in the grid."],
                ["Associate name, address, phone, email", "The details inside the card that opens when a visitor taps the tile."],
                ["Visible", "Hides the tile from the Contact page without deleting the record."],
              ]}
            />
            <p className="text-sm leading-relaxed text-[#5b6b82]">
              Every card has its own shareable link, so a visitor can send one associate&rsquo;s details straight to
              someone else.
            </p>
          </Section>

          <Section
            id="footer-contacts"
            eyebrow="/admin/footer-contacts"
            title="Footer contacts"
            intro="The contact columns in the site footer, sitting below the nav links and above the copyright line on every page."
          >
            <FieldTable
              rows={[
                ["Headline", "The column's heading, e.g. a city or department name."],
                ["Address, phone, email", "The lines under the heading. Leave any of them blank to omit that line."],
                ["Visible", "Hides the column from the footer without deleting it."],
              ]}
            />
            <p className="text-sm leading-relaxed text-[#5b6b82]">
              Add as many columns as you like — the footer lays out four per row on desktop and wraps the rest
              onto a new row.
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
            <p className="text-sm leading-relaxed text-[#5b6b82]">
              The first phone number and the address are also the ones printed in the signature of every email sent
              from <strong>Send email</strong>. Correcting them here corrects every email sent afterwards.
            </p>
            <Callout kind="warning">
              Changes here go live immediately on the public site — there&rsquo;s no draft/preview step, so double-check
              a phone number or the WhatsApp digit format before saving.
            </Callout>
          </Section>

          <Section
            id="seo"
            eyebrow="/admin/seo"
            title="SEO & analytics"
            intro="Connects the website to Google Analytics 4, Google Tag Manager, Google Search Console, Bing Webmaster Tools, Microsoft Clarity, Meta Pixel, and Google Ads conversion tracking. Each service needs exactly one ID pasted in — the site injects the right tracking code automatically, and saving takes effect on the next page load."
          >
            <FieldTable
              rows={[
                ["Analytics & recordings", "GA4 (visitor stats), Microsoft Clarity (session recordings and heatmaps)."],
                ["Search engines", "Search Console and Bing verification codes, so both engines report how the site ranks. The sitemap to submit is /sitemap.xml."],
                ["Advertising", "Meta Pixel and Google Ads conversion ID + label. Every quote enquiry, product enquiry, order, and contact message is reported as a lead/conversion automatically."],
                ["Tag Manager", "A container for adding any future marketing tag without code changes."],
              ]}
            />
            <Callout>
              The full step-by-step instructions for creating each account and finding each ID live on
              the SEO &amp; Analytics page itself, under the form. Admin pages are excluded from
              tracking, so your own dashboard visits never skew the numbers.
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
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#eef3fb] text-[#1A0A53]">
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
                { icon: MessageSquareText, text: "Enquiry button on a product (anyone) → Product enquiries inbox, a simple lead." },
                { icon: FileText, text: "Enquiry now page (approved customers only) → Quote enquiries, which also issues a public tracking number." },
                { icon: Mail, text: "Contact page form (anyone) → Messages inbox." },
                { icon: Users, text: "Public sign-up + profile → Users, gated pending → approved before Orders/Quotes unlock." },
                { icon: Wallet, text: "Approved Order/Quote from a referred customer → credit the referrer's wallet → they see the balance on their wallet page." },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex gap-3 rounded-2xl border border-[#e4e9f2] p-4">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#eef3fb] text-[#1A0A53]">
                    <Icon className="size-4" />
                  </span>
                  <p className="text-sm leading-relaxed text-[#5b6b82]">{text}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-3 rounded-2xl border border-[#e4e9f2] p-4">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#eef3fb] text-[#1A0A53]">
                <ImageIcon className="size-4" />
              </span>
              <p className="text-sm leading-relaxed text-[#5b6b82]">
                Product, category, and city agent photos are all stored with the same image
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
