# daksh.md — AWS OVERSEAS impex: Complete Project Record

A full record of what has been built on this project: the stack, the deployment pipeline, every page, every admin function, every database table, every library module, and the design system behind it. Written as a personal reference for Daksh Tandel — everything below reflects the current state of the codebase as of **2026-08-03**.

---

## 1. What this project is

**AWS OVERSEAS impex** is a full production website + back-office system for an international logistics / freight-forwarding company. It has two halves:

1. **The public marketing + customer site** — every page a visitor or customer sees: Home, About, Services, Industries, Products (full e-commerce-style catalog), Quote requests, Shipment tracking, customer accounts with a referral/wallet system, and all legal pages.
2. **The admin back office** (`/admin`) — a private, password-gated control panel where the business runs day-to-day operations: approving customers, managing the product catalog, pricing orders, tracking shipments, reading contact/enquiry inboxes, managing office locations, and configuring SEO/marketing integrations.

Nothing about this project is a template or a boilerplate starter — every page, every table, every Server Action, and the entire design system was built from scratch inside this repository.

---

## 2. Tech stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | **Next.js 16.2.9** (App Router, Turbopack) | `params`/`searchParams` are Promises in this version (must `await`). `next build` no longer runs lint as part of the build. |
| UI library | **React 19.2.7** | Server Components by default; Client Components (`"use client"`) only where interactivity is needed. |
| Language | **TypeScript 6.0.3** | Strict typing throughout, `@/*` path alias → `src/*`, `@/content/*` → `Content/*`. |
| Styling | **Tailwind CSS v4** | CSS-first `@theme` token system defined in `src/app/globals.css` (no `tailwind.config.js` — v4 style). |
| Animation | **Framer Motion 12** | Page-load sequences, scroll-triggered reveals (`whileInView`), hover micro-interactions. |
| Icons | **lucide-react v1** | Note: v1 dropped all brand/social icons (Facebook, Twitter, etc.) — those are hand-built inline SVGs in `src/components/ui/social-icon.tsx`. |
| Database / Backend | **Supabase** (managed PostgreSQL + Auth) | All live data (products, orders, users, wallets, tracking) lives here. Row Level Security (RLS) enforced on every table. |
| File/image hosting | **Cloudinary** | Every uploaded image (products, categories, ID documents, hero media) is stored here — never committed to the git repo. |
| Auth | **@supabase/ssr** for customers, custom HMAC-signed cookie for the admin panel | Two entirely separate auth systems (see §7). |
| Deployment | **AWS**, source pushed to **GitHub** | Repo: `github.com/dakshtandel-9/AWSoverseas`. Next.js is Node-server-based — hosting runs it as a Node/SSR service on AWS (not a static export); no AWS-specific IaC files (no Amplify config, no Dockerfile, no buildspec) are checked into this repo, so the AWS build/deploy step lives in the hosting configuration outside the codebase. |
| Package manager | npm (`package-lock.json` committed) | |

### Why these choices
- **Next.js App Router + Server Actions** — lets every admin form (`create product`, `approve user`, `update shipment status`) run as server-side logic colocated with its page, with no separate REST/GraphQL API layer to maintain.
- **Supabase over a hand-rolled backend** — got a production Postgres database, row-level security, and (initially) auth in one hosted service, reachable from Server Components via a service-role key for admin writes and an anon key for public reads.
- **Cloudinary over Supabase Storage** — a deliberate choice (documented in memory) to keep all media off the git repo and off the app server, and to get automatic image transformation URLs (e.g. thumbnail generation for a video poster frame via `so_1`).
- **Tailwind v4's CSS-first `@theme`** — the whole brand palette (navy/maroon/ink) is defined as CSS variables once, rather than a JS config object, and is consumed identically by every component.

---

## 3. Repository layout

```
AWS.Overseas/
├── Content/                  # Static marketing copy (JSON), source of truth for page text
├── public/                   # Static assets: logos, favicons, brand images
├── scripts/                  # One-off maintenance scripts (seed-products.mjs, fix-catalog.mjs)
├── supabase/
│   ├── schema.sql             # Full, idempotent schema — the canonical DB definition
│   └── migrations/            # Dated, incremental SQL files run by hand in Supabase's SQL editor
├── src/
│   ├── app/                   # Next.js App Router — every route lives here
│   │   ├── (public routes)    # /, /about, /services, /products, /quote, /tracking, /profile, ...
│   │   ├── admin/              # Admin panel (login + protected dashboard route group)
│   │   ├── actions/            # Public-facing Server Actions (contact, quote, enquiry, newsletter, warehouse booking)
│   │   ├── api/                 # Route handlers: /api/translate, /api/captcha
│   │   └── auth/callback/      # Supabase auth callback route
│   ├── components/             # All React components, organized by page/feature area
│   ├── lib/                    # Business logic, Supabase clients, auth, content loaders, utilities
│   └── proxy.ts                 # Next 16's renamed middleware — auth gate + session refresh
├── documentation.md            # Plain-English admin manual for the business owner
├── CLAUDE.md                    # Design-system instructions for AI-assisted development
└── daksh.md                     # This file
```

---

## 4. Database schema (Supabase / PostgreSQL)

Defined in `supabase/schema.sql`, evolved through 18 dated migration files in `supabase/migrations/`. Every table has RLS enabled; public tables get an explicit "read active rows only" policy, and anything containing sensitive or write-only data (submissions, user profiles, wallet ledger) has **no public policy at all** — every read/write on those goes through the service-role client inside a Server Action.

### Tables

| Table | Purpose |
|---|---|
| `site_settings` | Singleton row (id fixed to 1). Up to 5 phone numbers, 5 emails, WhatsApp number, address, and the admin-editable brand button colors (navy/maroon + hover shades) and maroon text color. |
| `contact_submissions` | Contact-page form submissions. |
| `newsletter_subscribers` | Footer newsletter sign-up emails. |
| `quote_submissions` | Every "Request a Quote" submission — service type, shipment type, origin/destination, direction (export/import), a generated unique `tracking_number`, and `shipment_status`. Has a `raw` JSONB catch-all so no submitted field is ever lost even if the form's field set drifts from the promoted columns. |
| `shipment_milestones` | Timeline entries (status/location/note) attached to a `quote_submissions` row — this is what builds the public tracking page's history. |
| `warehouse_bookings` | "Book a Warehouse" requests from the `/quote` page popup — open to guests and signed-in customers. |
| `categories` | The product catalog's category **tree** — self-referencing via `parent_id`, nests to any depth. Each category is either a branch (holds subcategories) or a leaf (holds products), never both — enforced by two database triggers (`assert_category_is_leaf`, `assert_parent_is_branch`) that also block cycles. Has a `child_layout` column (`'cards'` or `'inline'`) controlling how its children render on the public site. |
| `products` | The catalog itself — name, description, category (FK), image, active flag, sort order. **Deliberately has no price column** — pricing is never published, customers submit an enquiry/order instead. |
| `product_enquiries` | Every "Enquiry" (open to anyone) and "Order" (requires an approved account) submitted from a product page. Carries `request_type` (`enquiry`/`order`), admin-entered pricing fields (`quoted_price`, `quoted_quantity`, `quoted_weight_kg`, `delivery_date`), a `quote_status` (`awaiting_quote`/`quoted`/`rejected`), and an optional attachment/reference image. `requested_quantity` supports the separate "Request a Product" flow where the product doesn't exist in the catalog at all (`product_id` stays null). |
| `user_profiles` | One row per customer, keyed to `auth.users`. Name, phone, company, country, a generated unique `referral_code`, `referred_by` (self-referencing), identity verification (`id_type`: passport/Aadhaar/PAN + document image URLs), and `status` (`incomplete → pending → approved/rejected`). |
| `wallet_transactions` | Append-only reward ledger. Every row is `quote`, `enquiry`, `signup`, or `adjustment` sourced; balance is always *derived* by summing this table, never stored separately, so it can't drift. Only `adjustment` rows may be negative (a manual admin correction). A partial unique index caps the `signup` welcome bonus at one per user. |
| `marketing_integrations` | Singleton row holding GA4, GTM, Search Console, Bing verification, Microsoft Clarity, Meta Pixel, and Google Ads IDs — injected into the public site's `<head>`/scripts. |
| `office_groups` / `office_locations` | The Contact page's office directory — groups (e.g. "India Offices") each containing named office cards (address, two phone numbers, email, optional Google Maps link). |
| `footer_contacts` | Open-ended list of contact cards shown in the footer's contact band (headline/address/phone/email) — a flat list, not grouped, wraps automatically at 4 per row. |

### Notable schema design decisions
- **Wallet balance has no stored total** — it's always summed live from `wallet_transactions`, so there's no way for a cached balance to disagree with its own history.
- **Category tree enforces branch-XOR-leaf at the database level**, not just in application code, via `before insert/update` triggers — so no code path (including a future one) can accidentally create a category that's both a parent and a product holder.
- **`product_enquiries.product_name` is a snapshot**, not a live join — so an enquiry's history is legible even after the referenced product is renamed or deleted.
- **Every submission table keeps a `raw` JSONB catch-all** where the form's exact field set matters (`quote_submissions`) — protects against the promoted-columns list falling out of sync with the live form JSON.

---

## 5. Authentication — two completely separate systems

### 5a. Admin auth (`/admin`)
- **One shared password** (env var `ADMIN_PASSWORD`), not per-staff accounts.
- Login issues a **signed HMAC cookie session** (`src/lib/auth/session.ts` / `src/lib/auth/actions.ts`), using Web Crypto — no Supabase Auth involved for admins at all.
- Session lasts 7 days.
- `src/proxy.ts` (Next 16's renamed `middleware.ts`) gates every `/admin/*` route except `/admin/login`, redirecting to login if the cookie is missing or invalid.

### 5b. Customer auth (public site)
- Built on **`@supabase/ssr`**, using Supabase's own email/password auth (originally built as Google OAuth, switched same-day to email/password because Google's OAuth provider wasn't configured in the Supabase project).
- `EmailAuthForm` (`src/components/auth/email-auth-form.tsx`) handles sign-in and sign-up in one component with a tab toggle (`/login?mode=sign-up` deep-links to the sign-up tab).
- Password rules centralized in `src/lib/password.ts`: 8+ characters, 1 uppercase, 1 number, 1 special character.
- Forgot/reset password flow exists end-to-end (`/forgot-password`, `/reset-password`, `/auth/callback`), always showing the same "check your inbox" message regardless of whether the email is registered, to avoid leaking which emails have accounts.
- `src/proxy.ts` also refreshes the Supabase session cookie on every relevant request (Server Components can't write cookies themselves) and enforces two extra session-age limits beyond Supabase's own token lifetime: a signed-in user with an **incomplete profile is force-signed-out after 30 minutes**, and **any session expires after 3 days** regardless of activity.
- On first login, `createProfileForUser` (`src/lib/account.ts`) creates the `user_profiles` row and generates a unique referral code (format `AWS-XXXXXX`).
- Customer then completes a profile (name, phone, company, country, ID document type + upload) — this moves their status from `incomplete` to `pending`, awaiting admin approval.
- **Only approved accounts** can place product Orders or submit shipping quote requests; open Enquiries and the quote/contact forms themselves remain available to anyone.

---

## 6. Every public page, and what it does

| Route | Page | What it is |
|---|---|---|
| `/` | Home | 14+ sections: dual hero sliders (content-rich + photo-driven), services grid, industries strip, "how it works," global coverage, warehouse consolidation, products teaser, certifications wall (11 real licensing/registration logos), trusted partners, testimonials, tracking preview, app-download CTA, FAQ section, referral popup. |
| `/about` | About | Company story (staged Origin/Method/Today timeline), mission/vision, values, certifications, global network (route-line map), "why choose us." Framed under a "manifest"/bill-of-lading design concept (see §8). |
| `/services` | Services (list) | "Tariff schedule" of the 6 top-level service lines (Air/Sea Freight, Import/Export Services, Warehousing, Customs Clearance), each linking to its detail page. |
| `/services/[slug]` | Service detail (×8) | One shared template drives all 8 slugs (air-freight, sea-freight, import-services, export-services, fcl-shipping, lcl-shipping, customs-clearance, warehousing) — hero, overview, feature checklist, numbered process steps, credentials, FAQ, CTA. |
| `/industries` | Industries | 8 industries rendered as a numbered classification schedule; the 5 with full copy expand into a single-open accordion of detailed profiles, the other 3 show an honest "custom quote" badge instead of fabricated copy. |
| `/products` | Products catalog | Category grid (image + name + description + "Explore"), sourced live from the `categories` table. |
| `/products/[slug]` | Category detail | Recursive — shows either subcategory cards or a live product grid depending on that category's `child_layout`. Product cards open an `EnquiryModal` (Enquiry for anyone, Order gated to approved accounts). |
| `/request-product` | Request a Product | Standalone form for a product that doesn't exist in the catalog — free-text description, no product FK required. |
| `/quote` | Request a Quote | Full shipping-quote form with an Export/Import toggle that swaps origin/destination field sets, searchable country dropdowns, and a "Book a Warehouse" popup. Submitting generates a unique tracking number. Guests can fill the form; it gates only on submit. |
| `/tracking` | Shipment tracking | Public lookup by tracking number (`?ref=...`) — no login required, scoped to an exact match. Shows current `shipment_status` and the full milestone timeline. |
| `/contact` | Contact | Contact form (6 field types, native HTML5 validation) + sticky contact-channels rail (phone/email/WhatsApp/business hours) + office directory (grouped cards) + a Google Maps link-out. |
| `/faq` | FAQ | Searchable/browsable accordion of categorized questions. |
| `/partner` | Partner With Us | Full partner program page — hero, benefits, partnership types, process, an apply form, FAQ. |
| `/referral-rewards` | Referral & Wallet program | Explains the $25 signup/referral wallet program, rules, a "Become a Partner" teaser section, CTA. |
| `/sourcing-agent` | Sourcing Agent | Benefits + process for using AWS OVERSEAS as a sourcing partner. |
| `/sustainability` | Sustainability | "Impact Ledger" concept — a split-routing diagram showing proceeds routing to Climate Action / Community Initiatives pillars, plus a 3-step "how proceeds are routed" process. Discoverable via footer link only (deliberately not in main nav). |
| `/mobile-app` | Mobile App | App showcase, features, refer-and-earn tie-in, download band. |
| `/privacy-policy`, `/terms`, `/refund-policy`, `/disclaimer` | Legal (×4) | One shared system: sticky scroll-spy clause index on desktop, numbered clauses, "REV. {date}" stamp, closing "contact support" strip instead of a sales CTA. |
| `/login` | Sign in / Sign up | Tabbed single form for both flows. |
| `/forgot-password`, `/reset-password` | Password recovery | Full flow, functional end-to-end. |
| `/profile` | Customer profile | Account details, activity list, sign-out. |
| `/profile/setup` | Profile setup | Collects the fields needed to move status from `incomplete` → `pending`. |
| `/profile/wallet` | Wallet | Balance (derived from `wallet_transactions`) + full transaction history. |
| `/profile/referrals` | Referrals | The customer's referral code (with copy button) and list of who they've referred. |
| `/not-found` | 404 | Reframed as a logistics "tracking exception" — a barcode + one-time scanline sweep instead of a giant decorative "404," with a numbered "redirect manifest" link list. |

Also present: `robots.ts` and `sitemap.ts` (Next's typed metadata routes) for SEO crawling.

---

## 7. The admin panel — every section, in full

Accessed at `/admin/login`, then everything below lives inside the `(dashboard)` route group with a shared sidebar (`src/components/admin/admin-nav.tsx`):

| Section | Route | Function |
|---|---|---|
| **Dashboard** | `/admin` | Overview cards: pending user approvals, unread orders, unread enquiries, unread messages, unread quote requests — each card deep-links to its section. |
| **Users** | `/admin/users` | Review customer sign-ups; **Approve** or **Reject**. Only approved customers can place Orders or submit shipping quotes. Shows full profile including uploaded ID document. |
| **Wallets** | `/admin/wallets` | View every customer's derived wallet balance and transaction history; manually **credit** a referrer's wallet when a referred customer's order/enquiry is approved; issue manual **adjustments** (including negative corrections, which are the only transaction type allowed to be negative). |
| **Categories** | `/admin/categories` (+ `/new`, `/[id]/edit`) | Full CRUD on the category tree — name, slug (auto-generated), description, image (Cloudinary), parent, active flag, sort order, and the `child_layout` toggle (cards vs. inline) with a miniature preview of each option. |
| **Products** | `/admin/products` (+ `/new`, `/[id]/edit`) | Full CRUD on the flat product list across every category — this is the only place an "unfiled" product (filed in no category, invisible on the live site) can be found and fixed. Image upload via a standalone Cloudinary uploader kept structurally separate from the main save form (to avoid a Next.js form-action collision bug — see §9). |
| **Orders** | `/admin/enquiries` | Product "Order" requests from signed-in, approved customers. Admin enters price, quantity, weight, and delivery date, then **Approves** (customer sees the quote on their profile) or **Rejects** with a reason. |
| **Enquiries** | `/admin/enquiries-open` | Open "Enquiry" leads from anyone, no account required — lightweight inbox: contact info + message, mark read / delete. |
| **Messages** | `/admin/messages` | Contact-page form submissions inbox. |
| **Newsletter** | `/admin/newsletter` | List of footer newsletter sign-ups. |
| **Quote Requests** | `/admin/quotes` | Full shipping quote inbox. Update `shipment_status` (Verifying → Pending → Collected → Customs Cleared → In Transit → Delivered, or Rejected) and add timestamped **milestones** (location + note) that build the customer-facing tracking timeline. Can also manually create a quote/order on a customer's behalf. |
| **Warehouse Bookings** | `/admin/warehouse-bookings` | Requests from the `/quote` page's "Book a Warehouse" popup. |
| **Offices** | `/admin/offices` | Manages `office_groups` and `office_locations` for the Contact page's office directory — single board UI with inline group create/edit, plus dedicated `new`/`edit` pages for individual offices. |
| **Footer Contacts** | `/admin/footer-contacts` (+ `/new`, `/[id]/edit`) | Open-ended, orderable list of contact cards shown in the footer's contact band. |
| **SEO & Analytics** | `/admin/integrations` | Paste-in IDs for GA4, Google Tag Manager, Search Console verification, Bing verification, Microsoft Clarity, Meta Pixel, and Google Ads conversion tracking — every ID is regex-validated on save (since values get interpolated directly into inline `<script>` tags) and injected site-wide by the root layout. Includes a full per-service setup guide. |
| **Site Settings** | `/admin/settings` | Up to 5 phone numbers, 5 emails, WhatsApp number, business address, and the site's brand button colors (navy/maroon + hover shades, and the maroon text color used in headline gradients/icons/links) — all live-editable without a redeploy. |
| **Documentation** | `/admin/docs` | In-app documentation kit for the business owner, mirroring `documentation.md`. |

Every admin write path revalidates the relevant Next.js cache tag (`updateTag`) immediately, so catalog/settings/content changes appear live on the public site with no redeploy needed.

---

## 8. Design system

Governed by the project's own `CLAUDE.md` design brief — the standing instruction is to give this client a visual identity that isn't a generic AI-website look, with one deliberate risk taken and justified.

### Palette
- **Brand navy scale** — `--color-brand-*`, with `brand-700 (#002144)` doubling as `--color-ink`.
- **Accent wine/maroon scale** — `--color-accent-*` (`accent-500 = #902d39`), referred to elsewhere as "maroon-admin."
- **Text ink** — `#1A0A53` (deep indigo). **Black text is explicitly banned project-wide** — no `text-black`, `#000`, or gray-900 anywhere; secondary text uses `--color-ink-soft (#2a3a52)` and `--color-muted (#5b6b82)` instead. This is a standing rule, not a one-off fix.
- A page-scoped moss green (`#2F6B4F`) was introduced only for the Sustainability page's "stamp-ink" motif — deliberately never promoted into the global `@theme`.

### Typography
- Headings: **Manrope** (`--font-heading`).
- Body: **Inter** (`--font-body`).
- Both wired once via `next/font` CSS variables — no per-page font imports needed.
- `font-mono` (Tailwind's default stack) is the recurring device for reference/credential fields (the "manifest" motif below).

### The signature concept: "the manifest"
Most of the marketing site is framed as a freight forwarder's own paperwork — a bill-of-lading / consignment record. This shows up as:
- A document-header hero register (dark navy background, mono reference fields) reused with variation across About, Industries, Services, Products, and legal pages.
- Stamped credential chips for certifications ("REG-", "STD-" prefixes).
- A "Cleared for departure" stamp bookend on CTAs (varied per page — e.g. Services uses "Booking open," service-detail pages use "Slot available" to avoid repeating the same stamp 8 times across template-driven pages).
- The 404 page extends this into a "tracking exception" — a barcode + one-time scanline sweep standing in for the usual giant "404" numeral.

### A deliberate rule about numbered markers (01/02/03)
Per the CLAUDE.md brief, numbered markers are used **only where the content is a genuine sequence** — e.g. Story's Origin/Method/Today timeline, a service's process steps, or a legal document's actually-referenced clause numbers. Parallel, non-sequential content (Values, the Sustainability pillars, Industries' unnumbered "custom quote" items) deliberately stays flat/unnumbered rather than defaulting to a numbered look everywhere.

### Motion
Framer Motion drives scroll-triggered reveals (`whileInView`), one orchestrated hero load sequence, and targeted hover micro-interactions — kept restrained per the brief's "less is more" guidance (e.g. the 404 scanline is a one-time sweep, not a loop).

### Catalog page structural reference
The catalog pages (`/products`, `/products/[slug]`) — and only those pages — follow **sparkleglobaltrade.com** as an agreed structural reference (hero → "About Our X" → prose/photo split → subcategory cards or product grid), a client decision that does not extend to the rest of the site.

---

## 9. Key architectural patterns and gotchas solved

- **Next.js 16 renamed `middleware.ts` → `proxy.ts`** (function `middleware` → `proxy`), and for a `src/`-rooted project it must live at `src/proxy.ts` — a repo-root file is silently ignored. Also, `revalidateTag` changed signature; the newer `updateTag(tag)` is used for the common "revalidate right after a Server Action write" case.
- **Heading color cascade bug**: an unlayered plain-CSS rule in `globals.css` (`h1..h6 { color: var(--color-ink) }`) always beats Tailwind's `@layer utilities` classes per CSS cascade rules — so `text-white` on any heading silently loses and renders invisible navy-on-navy text. Fix: always set heading color via inline `style={{ color: ... }}`, never a Tailwind text-color class, on `h1`–`h6`.
- **Form-action collision bug**: a bare `<form action={fn}>` (no `useActionState`) sitting as a sibling of an unrelated `useActionState`-driven form could cause Next/Turbopack dev to dispatch the *wrong* Server Action on submit. Fixed by calling simple no-arg actions (like logout) via `useTransition(() => fn())` from an `onClick` instead of a form action. Image-upload fields are kept in their own standalone form for the same reason.
- **Category tree branch/leaf invariant** is enforced by two Postgres triggers, not just app code, so it can never be violated regardless of which code path writes to the tables.
- **Wallet balance is always derived**, never stored, eliminating an entire class of balance-drift bugs.
- **Runtime i18n** (see §10) walks and rewrites the live DOM rather than maintaining translated content files, so the single-source-of-truth `Content/*.json` files stay English-only.
- **Cloudinary, never the repo, for media** — any dropped-in video/image asset gets uploaded to Cloudinary and the local file deleted; the git repo never carries multi-MB media.
- **`raw` JSONB catch-alls** on submission tables (with an explicit filter dropping Next's internal `$ACTION_*` Server-Action binding metadata, a real bug that was found and fixed) protect against silent data loss when a form's field set drifts from its promoted DB columns.

---

## 10. Extra systems worth calling out

### Runtime multi-language translation (206 languages)
A navbar language switcher (desktop dropdown + mobile full-screen sheet, searchable) translates the **entire live site at runtime** — chosen over static i18n (`next-intl`) or pre-translated JSON, since the content architecture is a single set of English JSON files.
- Uses the free, unofficial Google Translate endpoint (no paid API key).
- `LanguageProvider` (`src/lib/language/language-context.tsx`) walks `document.body`'s text nodes plus `placeholder`/`aria-label`/`title` attributes, batches them (up to 40 strings per request) to `/api/translate`, and writes translated text straight into the DOM — no re-render, no routing change.
- A `MutationObserver` catches new nodes from animated/carousel components that mount after the initial pass.
- `dir`/`lang` on `<html>` flips automatically per language (RTL support included).
- Solved bug classes along the way: multi-sentence strings desyncing the batch translation (fixed with a sentence-boundary regex that routes risky strings to individual calls), stale text when switching directly between two non-English languages (fixed by always restoring original English before re-translating), and animated number spans (count-up stats) fighting the translator's DOM writes (fixed with a `data-no-translate` attribute convention).

### Referral & wallet program
- Every customer gets a unique referral code at first login.
- A signup welcome bonus and referral rewards are credited as `wallet_transactions` rows — **manually**, by an admin, when a referred customer's order/enquiry is approved (not automatic).
- Customers view balance/history at `/profile/wallet` and their referral network at `/profile/referrals`.
- There is currently no withdrawal/cash-out flow by design (the earlier `wallet_withdrawals` table and bank-detail columns were removed — reward is wallet credit only, no payout path).

### Shipment tracking
- Every quote submission gets a unique tracking number automatically.
- The admin builds a milestone timeline against it (`shipment_milestones`).
- Anyone with the tracking number can look up status at `/tracking?ref=...`, publicly, with no login — safe to expose without RLS because the lookup is scoped to an exact tracking-number match, never a general list.

### Marketing & analytics integrations
Centralized, admin-editable IDs for GA4, GTM, Search Console, Bing, Microsoft Clarity, Meta Pixel, and Google Ads — injected site-wide from one singleton settings table, plus a `trackLead()` helper that fires GA4's `generate_lead`, Meta's `Lead`, and the Google Ads conversion event from the success states of the quote form, contact form, and enquiry modal.

---

## 11. Content architecture

Marketing copy that rarely changes lives in `/Content/*.json` (one file per page area: `home.json`, `about.json`, `services.json`, `individualService.json`, `industries.json`, `products.json`, `contact.json`, `faq.json`, `partner...json`, `referralRewards.json`, `sustainability.json`, `sourcingAgent.json`, `mobileApp.json`, the 4 legal JSONs, `requestQuote.json`, `requestProduct.json`, `shipmentTracking.json`) — loaded through named exports in `src/lib/content.ts`, never hardcoded inline. This was a deliberate split from the database: content that changes rarely (About's story, service descriptions, FAQ answers) doesn't need a database-editing UI; content that changes constantly (products, orders, settings, users) does, and lives in Supabase behind the admin panel instead.

---

## 12. Environment / secrets

Configuration lives in a `.env` file (never committed — see `.env.example` for the template):

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public Supabase project connection (safe client-side). |
| `SUPABASE_SERVICE_ROLE_KEY` | Full-access server-only key for admin operations — never sent to the browser. |
| `ADMIN_PASSWORD` | The single shared password for `/admin/login`. |
| `SESSION_SECRET` | Random secret signing the admin session cookie (HMAC). |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Cloudinary account credentials for all image/video uploads. |

One-time Supabase dashboard setup also required: Authentication → URL Configuration must list `/auth/callback` (both localhost and production) as a redirect URL for the email auth flow to work.

---

## 13. Deployment & source control

- **Source control**: GitHub, `github.com/dakshtandel-9/AWSoverseas`, branch `main`.
- **Hosting**: AWS. The application is a standard Node.js-server Next.js app (not a static export), so it runs as an SSR Node process on AWS infrastructure; the repository itself is hosting-agnostic — no AWS-specific deployment files (Amplify build spec, Dockerfile, App Runner config, etc.) exist in the codebase, so build/deploy configuration is managed on the AWS side outside this repo.
- **Environment variables** (§12) must be set wherever the app actually runs on AWS, exactly as they would be in any other Node hosting environment.
- **Admin-panel and content-table changes never require a redeploy** — every admin write busts the relevant Next.js cache tag, so products, settings, blog-equivalent content, and orders update live immediately. Only code or `/Content/*.json` changes require a rebuild + redeploy.

---

## 14. Everything still to do (as of this writing)

- Confirm the AWS hosting build pipeline is documented somewhere durable (this repo has none) so a future redeploy doesn't depend on tribal knowledge.
- `ADMIN_PASSWORD` is still on a weak placeholder value in `.env.example`-derived setups — must be rotated to a strong secret before/at go-live if not already done.
- Supabase's "Confirm email" setting was turned off due to an unresolved Hostinger/MailChannels SMTP deliverability block — re-enable once that's fixed, restoring the "check your inbox" UI in `EmailAuthForm`.
- One open business-rule discrepancy flagged but not resolved: the referral popup's copy states the $25 reward releases on shipment completion, while `referralRewards.json`'s page copy and the actual `creditReferrerForSource` code path both treat it as releasing on **any** approved paid order (quote or enquiry) — needs a decision on which is correct, then the losing copy needs to be reconciled.
