# AWSOverseas — Website Documentation

This document explains, in plain language, how your website is built, how to log in to the admin panel, and how to do every common task: changing the company name, uploading products, managing blog posts, handling orders and enquiries, approving customers, and more.

Keep this file safe — it contains your admin password and other sensitive setup details. Do not share it publicly or commit it to a public code repository.

---

## Table of Contents

1. [What This Website Is](#1-what-this-website-is)
2. [Technology Used (Plain-English Explanation)](#2-technology-used-plain-english-explanation)
3. [The Database](#3-the-database)
4. [How to Log In to the Admin Panel](#4-how-to-log-in-to-the-admin-panel)
5. [Admin Panel — Section by Section](#5-admin-panel--section-by-section)
6. [How to Change the Company Name / Branding](#6-how-to-change-the-company-name--branding)
7. [How to Upload Products](#7-how-to-upload-products)
8. [How Customers Place Orders / Enquiries](#8-how-customers-place-orders--enquiries)
9. [How the Quote System Works](#9-how-the-quote-system-works)
10. [Customer Accounts, Approval & Wallet](#10-customer-accounts-approval--wallet)
11. [Blog Management](#11-blog-management)
12. [Shipment Tracking](#12-shipment-tracking)
13. [Site Settings (Contact Info)](#13-site-settings-contact-info)
14. [Where Website Text/Content Comes From](#14-where-website-textcontent-comes-from)
15. [Images & File Uploads (Cloudinary)](#15-images--file-uploads-cloudinary)
16. [Passwords, Secrets & Environment Variables](#16-passwords-secrets--environment-variables)
17. [Hosting & Deployment](#17-hosting--deployment)
18. [Security Notes — Please Read](#18-security-notes--please-read)
19. [Glossary](#19-glossary)

---

## 1. What This Website Is

AWSOverseas is a logistics/freight-forwarding company website with two parts:

- **The public website** — the marketing site your visitors see: Home, About, Services, Industries, Products, Blog, Contact, FAQ, Partner, legal pages, shipment tracking, and a quote request system.
- **The admin panel** (`/admin`) — a private, password-protected control panel where you (the site owner/staff) manage everything: site content that changes often, the product catalog, blog posts, customer orders/enquiries, quote requests, contact messages, customer account approvals, and wallet/referral payouts.

Everything the public sees is either:
- **Static content** written into content files (for text that rarely changes — like the About page story, service descriptions, FAQs), or
- **Live data** stored in the database and editable from the admin panel (products, blog posts, orders, contact info, customer accounts).

---

## 2. Technology Used (Plain-English Explanation)

| Technology | What it is | Why it's used here |
|---|---|---|
| **Next.js** (version 16) | A framework for building websites with React. It handles page routing, renders pages fast, and lets us write both the website and its "backend" logic in one project. | Powers the entire site — every page you see is a Next.js page. |
| **React** (version 19) | A JavaScript library for building interactive user interfaces (buttons, forms, menus). | Used to build every visual component (navbar, forms, cards, modals). |
| **TypeScript** | A stricter version of JavaScript that catches mistakes before the site goes live. | Used throughout so bugs are caught early, before customers see them. |
| **Tailwind CSS** (version 4) | A styling toolkit — instead of writing separate CSS files, styles are written as utility classes directly in the code. | Used for all visual styling (colors, spacing, layout, responsiveness). |
| **Framer Motion** | An animation library. | Powers page-load animations, scroll reveals, and hover effects. |
| **Supabase** | A hosted database + authentication service (built on PostgreSQL, a widely-used professional database system). | Stores all your live data: products, blog posts, customer accounts, orders, messages, wallet transactions. Also handles customer sign-up/login. |
| **Cloudinary** | A cloud image-hosting service. | Every image uploaded through the admin panel (product photos, blog images, customer passport photos) is stored here, not on your web server. |
| **Vercel** (typical hosting choice for Next.js, or any Node.js-capable host) | The server that runs your website and makes it publicly accessible. | Where the live site is deployed. |

### How these fit together (in order, when someone visits your site)

1. A visitor's browser requests a page (e.g. `awsoverseas.com/products`).
2. Next.js runs on the server, fetches whatever data that page needs (e.g. the product list from Supabase), and builds the HTML.
3. The finished page is sent to the visitor's browser, styled with Tailwind CSS, and comes alive with React/Framer Motion for interactivity and animation.
4. If the visitor submits a form (quote request, contact form, product enquiry), that data is saved straight into Supabase.
5. If they upload a file (rare for public visitors — mainly customer passport photos), it's sent to Cloudinary, and only the resulting image link is saved into Supabase.

You do not need to understand any of this code to run the website day-to-day — everything you need to change routinely is available through the **Admin Panel** described below.

---

## 3. The Database

Your website's data is stored in **Supabase**, which is a managed **PostgreSQL** database. Think of it as a set of spreadsheets ("tables"), each with a specific job:

| Table | What it stores |
|---|---|
| `site_settings` | Your company's phone numbers, email, WhatsApp number, and address — shown in the footer, Contact page, and WhatsApp links site-wide. |
| `products` | Your product catalog (name, description, category, image, active/inactive, display order). |
| `product_enquiries` | Every "Enquiry" (open to anyone) and "Order" (requires an approved account) submitted from a product page. Includes admin-entered pricing/quantity/delivery date once quoted. |
| `blog_posts` | Every blog article (title, category, content sections, tags, featured image, published/draft status). |
| `contact_submissions` | Messages submitted through the Contact page form. |
| `quote_submissions` | Every "Request a Quote" form submission, including a generated tracking number and shipment status. |
| `shipment_milestones` | The timeline of tracking updates (Collected → Customs Cleared → In Transit → Delivered) tied to a quote/shipment. |
| `user_profiles` | Registered customer accounts — name, phone, company, country, passport details, approval status, referral code. |
| `wallet_transactions` | A running ledger of referral rewards credited to customers. |
| `wallet_withdrawals` | Customer requests to withdraw their wallet balance to their bank account, plus your approve/reject decision. |

**You never need to touch the database directly.** Everything above is created, edited, or read through the admin panel or the public site's forms. The database exists in your own Supabase account (a separate login from this website's admin panel — see [Section 16](#16-passwords-secrets--environment-variables)) if a developer ever needs to inspect it directly.

---

## 4. How to Log In to the Admin Panel

**Admin panel URL:** `https://yourdomain.com/admin/login`
(Locally during development, this is `http://localhost:3000/admin/login`.)

**Current admin password:** `123456789`

> ⚠️ **This is a placeholder password left over from setup.** Anyone who knows or guesses it can access every order, customer record, and message in your system. **Change it before the site goes live publicly** — see [Section 16](#16-passwords-secrets--environment-variables) for exactly how.

### Steps to log in

1. Go to `/admin/login`.
2. Enter the admin password.
3. Click **Log in**. You'll be redirected to the Dashboard at `/admin`.
4. Your session stays logged in for **7 days** (stored as a secure browser cookie), after which you'll need to log in again.
5. To log out, click **Log out** at the bottom of the sidebar menu — this immediately ends your session.

There is only **one shared admin password** — not individual staff logins. Anyone with the password has full access to everything in the admin panel. If you need separate logins per staff member with different permission levels in the future, that would be a larger feature to build (see [Section 18](#18-security-notes--please-read)).

---

## 5. Admin Panel — Section by Section

Once logged in, the left-hand sidebar has these sections:

| Section | URL | What it's for |
|---|---|---|
| **Dashboard** | `/admin` | Overview cards showing: users awaiting approval, unread orders, unread enquiries, unread contact messages, unread quote requests, pending withdrawals, and published blog post count. Click any card to jump straight to that section. |
| **Users** | `/admin/users` | Review and approve/reject customer sign-ups. Only approved customers can place orders or request quotes. |
| **Products** | `/admin/products` | Your product catalog — add, edit, delete, reorder, activate/deactivate products. |
| **Orders** | `/admin/enquiries` | Product "Order" requests from signed-in, approved customers. You set price/quantity/delivery date and approve or reject. |
| **Enquiries** | `/admin/enquiries-open` | Open product "Enquiry" leads from anyone (no account needed) — simple contact + message inbox. |
| **Blog** | `/admin/blog` | Write, edit, publish, or unpublish blog articles. |
| **Messages** | `/admin/messages` | Contact-page form submissions. |
| **Quote Requests** | `/admin/quotes` | Full shipping quote requests, each with a tracking number and shipment status you can update. |
| **Withdrawals** | `/admin/withdrawals` | Customer wallet withdrawal requests — approve (mark paid) or reject. |
| **Site Settings** | `/admin/settings` | Company phone numbers, email, WhatsApp number, and address shown across the live site. |

---

## 6. How to Change the Company Name / Branding

The company name **"AWSOverseas"** is not stored in the database — it's written directly into the website's code in a few specific places, because it needs to appear in page titles, browser tabs, and navigation, which are set when the site is built. To change it, a developer needs to update it in these files:

1. **`src/lib/site.ts`** — the master site name/tagline/URL:
   ```
   export const SITE = {
     name: "AWSOverseas",
     tagline: "Global Logistics Beyond Borders",
     url: "https://awsoverseas.com",
   };
   ```
2. **`src/app/layout.tsx`** — the browser tab title, SEO description, and social-share preview text.
3. **Content files in `/Content/*.json`** — the name/tagline may also appear in visible page copy (hero headlines, footer text, About page story, etc.) — these would need a search-and-replace across the relevant JSON files.
4. **Logo images** in `public/brand/` (`logo-nav.png`, `logo-nav-light.png`, `logo-mark.png`, `logo-mark-light.png`, `icon-512.png`) and `src/app/icon.png` / `apple-icon.png` (browser tab icon) — these are image files and must be replaced with new logo artwork if you rebrand, not edited as text.

**In short: changing the company name, logo, or domain is a code-level change, not something available inside the admin panel.** If you need this changed, send the new name/tagline/logo files to your developer, or ask them to make the swap above.

---

## 7. How to Upload Products

1. Log in to `/admin` and click **Products** in the sidebar (or go to `/admin/products`).
2. Click **Add product** (or similar "new" button at the top of the page).
3. Fill in:
   - **Name** — the product's display name.
   - **Description** — shown on the product's page.
   - **Category** — used for grouping/labeling.
   - **Image** — click the upload field, choose a photo from your computer. It uploads to Cloudinary automatically and shows a preview once done. Wait for the preview to appear before saving — the image needs a moment to finish uploading.
   - **Active** — toggle this on to make the product visible on the public `/products` page. Turn it off to hide it without deleting it.
   - **Sort order** — a number controlling the display order on the catalog page (lower numbers show first).
4. Click **Save** / **Create product**.
5. The product appears live on `/products` immediately — no need to redeploy or wait.

**To edit a product:** go to `/admin/products`, click on the product card, change any field, and save.

**To remove a product:** either turn off **Active** (hides it, keeps history — recommended if it has past orders/enquiries attached) or delete it entirely (permanently removes it; any past orders referencing it keep a snapshot of the product name, so history isn't lost even after deletion).

**Note:** Products do not have a price field by design — pricing isn't published on the site. Instead, customers submit an Enquiry or Order, and you provide pricing manually per request (see next section).

---

## 8. How Customers Place Orders / Enquiries

Every product has two possible customer actions:

- **Enquiry** — open to anyone, no account needed. A simple "I'm interested, contact me" lead. Appears under **Enquiries** (`/admin/enquiries-open`) in the admin panel — just contact info + message, mark as read or delete.
- **Order** — requires the customer to have a signed-in, **approved** account (see [Section 10](#10-customer-accounts-approval--wallet)). Appears under **Orders** (`/admin/enquiries`) in the admin panel, with full pricing tools:
  1. Open the order from the list.
  2. Enter the **quoted price**, **quantity**, **weight**, and **delivery date**.
  3. Click **Approve** to send that quote back to the customer (they'll see it on their profile page), or **Reject** with a reason.

Both forms collect the customer's first name, last name, email, and phone (all required), plus an optional message.

---

## 9. How the Quote System Works

This is the main "Request a Quote" flow used for shipping quotes (separate from product orders above).

1. A visitor fills out the quote form at `/quote` — service type, shipment type, origin/destination country, cargo details, and their contact info.
2. On submission, the system automatically generates a **unique tracking number** for that request.
3. It appears in the admin panel under **Quote Requests** (`/admin/quotes`).
4. From there, you can:
   - Mark it as read.
   - Update its **shipment status**: Pending → Collected → Customs Cleared → In Transit → Delivered.
   - Add **milestones** — a timeline entry with a location and note (e.g. "Collected from warehouse, Mumbai" or "Cleared customs, Dubai") — these build up the tracking history the customer sees.
5. The customer (or anyone with the tracking number) can check status anytime at `/tracking?ref=<tracking number>` — no login required, since it's a public lookup scoped to that exact tracking number.

---

## 10. Customer Accounts, Approval & Wallet

### Sign-up and approval flow

1. A visitor creates an account at `/login` (email + password) or is prompted to during checkout/quote flows.
2. After signing up, they complete a profile: name, phone, company, country, passport number, and passport photo uploads (front/back) — used for identity verification since this is an international freight business.
3. Their account status starts as **pending** once the profile is submitted.
4. You review pending accounts at `/admin/users` and either **Approve** or **Reject** them.
5. Only **approved** accounts can place product Orders or submit shipping quote requests. (Open Enquiries and the quote form itself can still be filled out by anyone — but submitting requires the account gate for Orders/Quotes as noted above.)

### Referral & Wallet system

- Every customer gets a unique **referral code** (e.g. `AWS-7K39QD`) generated automatically when their account is created.
- When someone signs up using another customer's referral code, that relationship is recorded.
- **You (the admin) manually grant wallet credit** to a referring customer when a referred customer's order or enquiry is approved — this isn't automatic; it's a deliberate reward you choose to issue.
- Customers see their wallet balance and transaction history on their own profile page (`/profile/wallet`).
- Customers can request a **withdrawal** to their bank account (they enter bank details once, reused for future requests). You review these at `/admin/withdrawals` and mark each as **Paid** or **Rejected** — rejecting releases the held amount back to their available balance.

---

## 11. Blog Management

1. Go to `/admin/blog`.
2. Click **New post**.
3. Fill in: title, category, excerpt (short summary), read time, featured image (uploads to Cloudinary the same way as product images), author name, tags, and the article body (organized into sections with headings).
4. Toggle **Published** on to make it live at `/blog` and its own `/blog/[slug]` page immediately, or leave it off to save as a draft.
5. Optionally mark one post as **Featured** — only one post can be featured at a time (setting a new one automatically un-features the previous one).
6. Edit or unpublish any post any time from the same list.

---

## 12. Shipment Tracking

Public page: `/tracking` (or directly via `/tracking?ref=<tracking number>`).

Anyone with a valid tracking number (given to them after submitting a quote request) can look up:
- Current shipment status (Pending, Collected, Customs Cleared, In Transit, Delivered).
- The full timeline of milestones you've added from `/admin/quotes`.

This lookup is intentionally public and doesn't require login — but it only reveals information for the exact tracking number entered, not a general searchable list.

---

## 13. Site Settings (Contact Info)

Go to `/admin/settings`. This single page controls:

- Phone number 1 & 2
- Email address
- WhatsApp number (digits only, e.g. `919876543210` — this is used to build WhatsApp click-to-chat links, so no `+`, spaces, or dashes)
- Business address

**Changes here go live immediately** across the footer, the Contact page, and every WhatsApp link on the site — no redeploy needed.

---

## 14. Where Website Text/Content Comes From

Most of the descriptive/marketing text on the site (About page story, service descriptions, FAQs, industries covered, legal policy text, homepage sections) comes from JSON content files in the `/Content` folder — **not** the database and **not** the admin panel. This was a deliberate choice: this copy changes rarely, so it lives in code rather than needing a database-editing interface for it.

If you need to change wording on these pages (e.g. an FAQ answer, a service description, the About page story), that requires a developer to edit the relevant file in `/Content` and redeploy the site. The pages that pull from these files include: Home, About, Services (+ each service detail page), Industries, FAQ, Partner, Mobile App, Privacy Policy, Terms, Refund Policy, Disclaimer, and the Products page's introductory copy.

The parts of the site that **are** editable directly by you without a developer are everything covered in this document's admin panel sections: Products, Blog, Site Settings (contact info), Orders/Enquiries, Quotes, Messages, Users, Withdrawals.

---

## 15. Images & File Uploads (Cloudinary)

Every image uploaded through the admin panel — product photos, blog featured images, and customer passport photos — is sent to **Cloudinary**, a cloud image hosting service, rather than stored on the web server itself. This keeps the website fast and avoids server storage limits.

- When you upload an image in the admin panel, it goes to Cloudinary automatically; you'll see a live preview once the upload finishes.
- Only the resulting image **link** (a `res.cloudinary.com` URL) is saved in the database — the actual image file lives on Cloudinary's servers.
- Images are organized into folders: `awsoversea/products`, `awsoversea/blog`, `awsoversea/passports`.
- To view, manage, or delete raw uploaded files directly (rarely needed), you'd log in to the Cloudinary account tied to the credentials in `.env` (see next section) at cloudinary.com.

---

## 16. Passwords, Secrets & Environment Variables

The website depends on a private configuration file named **`.env`**, which lives on the server (and on any developer's machine building/running the site) but is **never uploaded to the public website or a public code repository**. It contains all passwords and API keys.

| Variable | What it's for | Current value (as of this writing) |
|---|---|---|
| `ADMIN_PASSWORD` | The password to log in to `/admin/login`. | `123456789` — **placeholder, change before going live** |
| `SESSION_SECRET` | A random secret key used to cryptographically sign the admin login session cookie, so it can't be forged. Not a password you type anywhere. | A long random string (already generated) |
| `NEXT_PUBLIC_SUPABASE_URL` | The address of your Supabase database project. | `https://trjwefkdnublzryekmes.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | A public, limited-permission key used by the website to talk to Supabase for public-facing reads. Safe to be visible in the browser. | (long token, see `.env`) |
| `SUPABASE_SERVICE_ROLE_KEY` | A **full-access, all-powerful** key used only on the server (never sent to browsers) for admin operations — creating products, approving users, etc. | (kept secret in `.env` — **never share this key with anyone**) |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Credentials for the Cloudinary image-hosting account used for all uploads. | (see `.env`) |

### How to change the admin password

1. Open the `.env` file on the server (or wherever the site is deployed/hosted — e.g. your hosting provider's "Environment Variables" settings panel if using Vercel or similar).
2. Change the line `ADMIN_PASSWORD=123456789` to a strong password of your choice.
3. Also make sure `SESSION_SECRET` is set to a long random value (already done) — this does not need to change when you change the password.
4. Restart/redeploy the site so the new value takes effect.
5. Log in at `/admin/login` using the new password.

**Do this before the site is used in production with real customer data.** The current password is a weak, guessable placeholder from initial setup.

### Who to contact for these accounts

- **Supabase** (database): log in at supabase.com with the account that created this project to see raw data, backups, or user authentication records.
- **Cloudinary** (images): log in at cloudinary.com with the account tied to the API keys above to manage uploaded media directly.

Keep both of those account logins (email + password used to sign up for Supabase/Cloudinary) recorded somewhere secure — they are separate from the website's own admin password.

---

## 17. Hosting & Deployment

- The site is a **Next.js** application, which needs a Node.js-capable host to run (it is not a simple static HTML site).
- The typical hosting choice for Next.js projects is **Vercel** (made by the same company as Next.js), though any Node.js host works.
- Deployment means: pushing the code to the hosting provider, setting all the `.env` variables listed above in that provider's dashboard, and the provider builds and serves the site automatically.
- Whenever a developer changes code or content-file text, the site needs to be rebuilt/redeployed for changes to show. **Admin panel changes (products, blog, settings, orders) do not require a redeploy — they show up live immediately** because they're read from the database on every page load.

---

## 18. Security Notes — Please Read

1. **Change `ADMIN_PASSWORD` immediately** before real customer/business use — `123456789` is a default placeholder, not a secure password.
2. **Never share `SUPABASE_SERVICE_ROLE_KEY` or `CLOUDINARY_API_SECRET`** with anyone outside your development team — these keys bypass all restrictions and give full read/write access to your database and media storage.
3. There is currently **one single shared admin password** for the whole admin panel — there's no way to tell which staff member made a change, and no way to give one staff member limited access (e.g. "can manage blog but not withdrawals"). If you need multiple admin users with individual logins and permissions, that's a feature to discuss building.
4. Customer passport photos and personal data are sensitive — they are stored in Supabase without public read access (only accessible via the server-side admin tools), which is the correct, secure setup. Do not change this without understanding the implications.
5. Keep the `.env` file (or your host's equivalent environment-variable settings) private at all times — treat it like a bunch of master keys.

---

## 19. Glossary

- **Admin panel** — the private `/admin` section only you can log into, where you manage the live site's data.
- **API key / secret** — a password-like credential that lets software (not a human) securely talk to another service (like Supabase or Cloudinary).
- **Database** — where all your live, changeable data (products, orders, users, etc.) is stored — here, that's Supabase.
- **Deploy / deployment** — the process of publishing updated code so it appears on the live website.
- **Environment variable / `.env` file** — a private settings file holding passwords and keys, kept off the public website.
- **RLS (Row Level Security)** — a Supabase/database feature that restricts which data can be read/written without special server permission; used here to keep customer passport data and admin-only tables locked down from public access.
- **Server Action** — a piece of server-side code (in Next.js) that runs when a form is submitted, e.g. saving a new product to the database.
- **Session cookie** — a small piece of data stored in your browser after logging in to `/admin`, proving you're logged in for up to 7 days.
- **Slug** — the URL-friendly identifier for a page, e.g. the blog post "How Sea Freight Works" might have the slug `how-sea-freight-works`, giving it the address `/blog/how-sea-freight-works`.
- **Tracking number** — a unique code generated for every quote request, letting anyone check shipment status at `/tracking` without logging in.
