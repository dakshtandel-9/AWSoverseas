"use client";

import { useActionState } from "react";
import { Check, CircleDashed, BadgeCheck } from "lucide-react";
import { updateIntegrationsAction, type IntegrationsState } from "@/app/admin/(dashboard)/seo/actions";
import type { MarketingIntegrations } from "@/lib/marketing-integrations";

const initialState: IntegrationsState = {};

const inputClasses =
  "w-full rounded-xl border border-[#e4e9f2] bg-white px-4 py-3 text-sm text-[#1A0A53] placeholder:text-[#94a3b8] outline-none transition-colors focus:border-[#9e4953] focus:ring-2 focus:ring-[#9e4953]/20 font-mono";

type ServiceField = {
  name: string;
  value: string;
  label: string;
  placeholder: string;
  hint: string;
};

type Service = {
  guideId: string;
  title: string;
  purpose: string;
  fields: ServiceField[];
};

/**
 * One card per service, each with a Connected chip, the paste-an-ID field(s),
 * and a jump link to that service's step-by-step section in the guide below.
 */
export function IntegrationsForm({ integrations }: { integrations: MarketingIntegrations }) {
  const [state, formAction, pending] = useActionState(updateIntegrationsAction, initialState);

  const services: Service[] = [
    {
      guideId: "guide-ga4",
      title: "Google Analytics 4",
      purpose: "Visitor statistics — how many people visit, which pages they read, where they come from.",
      fields: [
        {
          name: "ga4_measurement_id",
          value: integrations.ga4MeasurementId,
          label: "Measurement ID",
          placeholder: "G-XXXXXXXXXX",
          hint: "Starts with G- · found under Admin → Data streams in Google Analytics.",
        },
      ],
    },
    {
      guideId: "guide-gtm",
      title: "Google Tag Manager",
      purpose: "A container for adding any other marketing tag later without touching the website's code.",
      fields: [
        {
          name: "gtm_container_id",
          value: integrations.gtmContainerId,
          label: "Container ID",
          placeholder: "GTM-XXXXXXX",
          hint: "Starts with GTM- · shown at the top of the Tag Manager workspace.",
        },
      ],
    },
    {
      guideId: "guide-gsc",
      title: "Google Search Console",
      purpose: "How the site appears in Google search — rankings, clicks, indexing problems.",
      fields: [
        {
          name: "google_site_verification",
          value: integrations.googleSiteVerification,
          label: "Site verification code",
          placeholder: "Paste the code or the whole <meta …> tag",
          hint: "From the \"HTML tag\" verification method — pasting the full tag works, the code is pulled out automatically.",
        },
      ],
    },
    {
      guideId: "guide-bing",
      title: "Bing Webmaster Tools",
      purpose: "Same as Search Console, for Bing — which also powers DuckDuckGo and Yahoo search.",
      fields: [
        {
          name: "bing_site_verification",
          value: integrations.bingSiteVerification,
          label: "Site verification code",
          placeholder: "Paste the code or the whole <meta …> tag",
          hint: "From the \"HTML Meta Tag\" verification method — or skip this field entirely by importing from Search Console.",
        },
      ],
    },
    {
      guideId: "guide-clarity",
      title: "Microsoft Clarity",
      purpose: "Free session recordings and heatmaps — watch exactly how visitors use the site.",
      fields: [
        {
          name: "clarity_project_id",
          value: integrations.clarityProjectId,
          label: "Project ID",
          placeholder: "abcd1efgh2",
          hint: "The short code in Clarity under Settings → Overview.",
        },
      ],
    },
    {
      guideId: "guide-meta",
      title: "Meta Pixel",
      purpose: "Facebook & Instagram ads — measures results and builds retargeting audiences. Form submits report a \"Lead\" event automatically.",
      fields: [
        {
          name: "meta_pixel_id",
          value: integrations.metaPixelId,
          label: "Pixel ID",
          placeholder: "1234567890123456",
          hint: "A long number, shown under the pixel's name in Meta Events Manager.",
        },
      ],
    },
    {
      guideId: "guide-ads",
      title: "Google Ads conversion tracking",
      purpose: "Tells Google Ads when a visitor becomes a lead — every quote enquiry, product enquiry, order and contact message counts as a conversion.",
      fields: [
        {
          name: "google_ads_id",
          value: integrations.googleAdsId,
          label: "Conversion ID",
          placeholder: "AW-XXXXXXXXX",
          hint: "Starts with AW- · from the conversion action's tag setup screen.",
        },
        {
          name: "google_ads_conversion_label",
          value: integrations.googleAdsConversionLabel,
          label: "Conversion label",
          placeholder: "AbCdEfGhIj0KLmNoPqR",
          hint: "The short code after the slash on the same screen — needed for conversions to count.",
        },
      ],
    },
  ];

  return (
    <form action={formAction} className="mt-8 grid max-w-3xl gap-5">
      {services.map((service) => {
        const connected = service.fields.some((f) => f.value);
        return (
          <section
            key={service.guideId}
            className="rounded-2xl border border-[#e4e9f2] bg-white p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-base font-bold text-[#1A0A53]">{service.title}</h2>
              {connected ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <BadgeCheck className="size-3.5" />
                  Connected
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eef3fb] px-3 py-1 text-xs font-semibold text-[#5b6b82]">
                  <CircleDashed className="size-3.5" />
                  Not connected
                </span>
              )}
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-[#5b6b82]">{service.purpose}</p>

            <div className={`mt-4 grid gap-4 ${service.fields.length > 1 ? "sm:grid-cols-2" : ""}`}>
              {service.fields.map((field) => (
                <div key={field.name} className="flex flex-col gap-2">
                  <label htmlFor={field.name} className="text-sm font-semibold text-[#1A0A53]">
                    {field.label}
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type="text"
                    defaultValue={field.value}
                    placeholder={field.placeholder}
                    autoComplete="off"
                    spellCheck={false}
                    className={inputClasses}
                  />
                  <p className="text-xs leading-relaxed text-[#94a3b8]">{field.hint}</p>
                </div>
              ))}
            </div>

            <a
              href={`#${service.guideId}`}
              className="mt-3 inline-block text-xs font-semibold text-maroon-admin underline-offset-2 hover:underline"
            >
              How to get this →
            </a>
          </section>
        );
      })}

      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600" role="alert">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="flex items-center gap-2 rounded-lg bg-[#f8f1f2] px-3 py-2 text-sm font-medium text-maroon-admin" role="status">
          <Check className="size-4" />
          Integrations saved — live on the site now.
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-12 items-center justify-center rounded-full btn-navy px-8 text-sm font-semibold text-white shadow-[0_2px_8px_rgba(3,62,141,0.25)] transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {pending ? "Saving…" : "Save integrations"}
        </button>
      </div>
    </form>
  );
}
