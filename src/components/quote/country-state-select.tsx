"use client";

import { useEffect, useState } from "react";
import { CountrySelect } from "@/components/quote/country-select";
import type { CountryStates } from "@/lib/country-states";

/**
 * The state field reads off the country field beside it: pick Algeria and the
 * list is Algeria's provinces, pick Japan and it's prefectures, pick India and
 * it's states and union territories. Until a country is picked there is nothing
 * to choose from, so the field says so instead of offering a list.
 *
 * The subdivision table covers every country and is far too big to ship with
 * the page, so it's imported on demand the first time a country is chosen.
 */
export function CountryStateSelect({
  name,
  required,
  country,
}: {
  name: string;
  required?: boolean;
  /** Current value of the country field this one follows; empty until picked. */
  country: string;
}) {
  const [table, setTable] = useState<Record<string, CountryStates> | null>(null);

  useEffect(() => {
    if (!country || table) return;
    let active = true;
    import("@/lib/country-states").then((mod) => {
      if (active) setTable(mod.COUNTRY_STATES);
    });
    return () => {
      active = false;
    };
  }, [country, table]);

  if (!country) {
    return <CountrySelect name={name} disabled placeholder="Pick a country first" />;
  }

  if (!table) {
    return <CountrySelect name={name} disabled placeholder="Loading…" />;
  }

  const entry = table[country];

  // A handful of countries (city-states, microstates) have no subdivisions —
  // the country on its own is the whole address.
  if (!entry) {
    return <CountrySelect name={name} disabled placeholder={`${country} has no states listed`} />;
  }

  return (
    <CountrySelect
      key={country}
      name={name}
      required={required}
      options={entry.names}
      noResultsLabel={`${entry.noun} in ${country}`}
      placeholder={`Search ${entry.noun} in ${country}…`}
    />
  );
}
