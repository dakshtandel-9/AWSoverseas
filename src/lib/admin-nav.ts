import {
  Building2,
  BookOpen,
  ChartNoAxesCombined,
  Columns4,
  FileText,
  GitFork,
  IdCard,
  LayoutDashboard,
  LayoutGrid,
  Mail,
  MessageSquareText,
  Package,
  Send,
  SendHorizontal,
  Settings,
  ShoppingBag,
  Users,
  Wallet,
  Warehouse,
  type LucideIcon,
} from "lucide-react";

/**
 * The six queues that can be waiting on the operator, keyed by the route that
 * clears them. Kept here rather than beside the database code so a client
 * component can use the type without pulling in the Supabase server client.
 */
export type AdminInboxKey =
  | "orders"
  | "enquiries"
  | "quotes"
  | "warehouse-bookings"
  | "messages"
  | "users";

export type AdminNavItem = {
  href: string;
  /** Shown in the sidebar AND as the page's <h1>. One string, so they can't drift. */
  label: string;
  icon: LucideIcon;
  /** One line under the heading explaining what the page is for. */
  description: string;
  /** Set when the page has a waiting-items count worth badging. */
  inbox?: AdminInboxKey;
  /** What a badged number means, in the operator's words. Used on the dashboard. */
  waitingLabel?: string;
  /**
   * Match the pathname exactly instead of by prefix. Only needed where one
   * route is a prefix of another, which no longer happens — but /admin itself
   * is a prefix of every route, so Dashboard still needs it.
   */
  exact?: boolean;
};

export type AdminNavGroup = {
  /** Doubles as the eyebrow printed above the page title, so a page always names its own section. */
  title: string;
  items: AdminNavItem[];
};

export const DASHBOARD_ITEM: AdminNavItem = {
  href: "/admin",
  label: "Dashboard",
  icon: LayoutDashboard,
  description: "Everything waiting on you right now, in one place.",
  exact: true,
};

export const ADMIN_NAV: AdminNavGroup[] = [
  {
    title: "Inbox",
    items: [
      {
        href: "/admin/orders",
        label: "Orders",
        icon: ShoppingBag,
        description:
          "Orders you created — either moved over from a product enquiry, or placed here for a customer. Customers can't create orders themselves. Price them out or reject them; the customer sees the decision on their profile.",
        inbox: "orders",
        waitingLabel: "orders not yet opened",
      },
      {
        href: "/admin/enquiries",
        label: "Product enquiries",
        icon: MessageSquareText,
        description:
          "Product enquiries from the public Products page — anyone can send one, no account needed. Follow up by email or phone, and move the ones worth pricing over to Orders.",
        inbox: "enquiries",
        waitingLabel: "product enquiries not yet opened",
      },
      {
        href: "/admin/quotes",
        label: "Quote enquiries",
        icon: FileText,
        description: "Shipping enquiries sent from the Enquiry now page, or created here for a customer. Add shipment milestones to each one to keep customer tracking up to date.",
        inbox: "quotes",
        waitingLabel: "quote enquiries not yet opened",
      },
      {
        href: "/admin/warehouse-bookings",
        label: "Warehouse bookings",
        icon: Warehouse,
        description: "Storage requests from the Book a Warehouse popup on the Enquiry now page — a separate ask from a shipping enquiry. Follow up by email or phone to confirm availability.",
        inbox: "warehouse-bookings",
        waitingLabel: "warehouse bookings not yet opened",
      },
      {
        href: "/admin/messages",
        label: "Contact messages",
        icon: Mail,
        description: "Everything sent through the contact form on the public site.",
        inbox: "messages",
        waitingLabel: "contact messages not yet opened",
      },
    ],
  },
  {
    title: "Outbox",
    items: [
      {
        href: "/admin/email",
        label: "Send email",
        icon: SendHorizontal,
        description:
          "Write an email and send it from any of the company's own addresses — admin@, sales@, or another mailbox on awsoverseas.com. Replies go back to whichever address you picked, so they land in that Hostinger inbox. Everything sent from here is listed below the form.",
      },
    ],
  },
  {
    title: "Customers",
    items: [
      {
        href: "/admin/users",
        label: "Users",
        icon: Users,
        description:
          "Email sign-ups with their verification details. Approving a user unlocks quotes and product enquiries for them.",
        inbox: "users",
        waitingLabel: "users waiting for approval",
      },
      {
        href: "/admin/referrals",
        label: "Referrals",
        icon: GitFork,
        description: "Every sign-up that used someone else's referral code, grouped by who sent them.",
      },
      {
        href: "/admin/wallets",
        label: "Wallets",
        icon: Wallet,
        description: "Every customer's referral balance. Open a customer to add credit or deduct it — each adjustment is recorded as its own line in the wallet activity they see.",
      },
      {
        href: "/admin/newsletter",
        label: "Subscribers",
        icon: Send,
        description: "Emails collected from the newsletter form in the site footer.",
      },
    ],
  },
  {
    title: "Catalog",
    items: [
      {
        href: "/admin/categories",
        label: "Categories",
        icon: LayoutGrid,
        description: "Shown as the grid on the public Products page, and as the Products dropdown in the site header. Open one to add products to it, or to nest subcategories under it.",
      },
      {
        href: "/admin/products",
        label: "Products",
        icon: Package,
        description:
          "Every product across all categories. This is the only place to find a product filed under no category — those are invisible on the public site.",
      },
    ],
  },
  {
    title: "Website content",
    items: [
      {
        href: "/admin/offices",
        label: "Offices",
        icon: Building2,
        description: "The office directory below the map on the Contact page. Each group is a heading with its own row of office cards — India, international, or any grouping you add.",
      },
      {
        href: "/admin/associates",
        label: "Associates",
        icon: IdCard,
        description: "The photo tiles below the enquiry form on the Contact page. Each tile opens a card with the local associate's name, address, phone and email, plus a link visitors can share straight to that card.",
      },
      {
        href: "/admin/footer-contacts",
        label: "Footer contacts",
        icon: Columns4,
        description: "The contact columns in the site footer, below the nav links. Add as many as you need — the footer wraps them into rows, four per row on desktop.",
      },
    ],
  },
  {
    title: "Setup",
    items: [
      {
        href: "/admin/settings",
        label: "Site settings",
        icon: Settings,
        description: "Contact details, brand colors, and the site-wide maintenance switch. Contact details appear in the footer, on the Contact page, and in every WhatsApp link. Changes go live immediately.",
      },
      {
        href: "/admin/seo",
        label: "SEO & analytics",
        icon: ChartNoAxesCombined,
        description: "Tracking and verification IDs for Google Analytics, Search Console, Tag Manager, Microsoft Clarity, Meta Pixel, Bing Webmaster Tools, and Google Ads. Each one only needs its ID pasted in — the step-by-step guide for every service is further down this page.",
      },
      {
        href: "/admin/docs",
        label: "Documentation",
        icon: BookOpen,
        description: "How every page in this panel works, written for whoever operates the site rather than for a developer.",
      },
    ],
  },
];

/** Flat list of every navigable page, Dashboard first. */
export const ALL_ADMIN_ITEMS: AdminNavItem[] = [DASHBOARD_ITEM, ...ADMIN_NAV.flatMap((g) => g.items)];

/**
 * Looks up a page by href so each page can render its own heading from the same
 * record the sidebar uses — the fix for labels drifting out of sync.
 */
export function adminPage(href: string): { item: AdminNavItem; group: string } {
  for (const group of ADMIN_NAV) {
    const item = group.items.find((i) => i.href === href);
    if (item) return { item, group: group.title };
  }
  if (href === DASHBOARD_ITEM.href) return { item: DASHBOARD_ITEM, group: "Overview" };
  throw new Error(`No admin nav entry for ${href} — add it to ADMIN_NAV in src/lib/admin-nav.ts`);
}
