// Maps an ISO 3166-1 alpha-2 country code to the language we suggest the
// translate prompt in. Keyed by country (where the visitor physically is),
// not by browser locale — a visitor in Saudi Arabia should be offered
// Arabic even if their phone's system language is set to English.
export const COUNTRY_LANGUAGE: Record<string, string> = {
  // South Asia
  IN: "hi",
  PK: "ur",
  BD: "bn",
  LK: "si",
  NP: "ne",

  // Middle East / Gulf
  SA: "ar",
  AE: "ar",
  QA: "ar",
  KW: "ar",
  BH: "ar",
  OM: "ar",
  IQ: "ar",
  JO: "ar",
  LB: "ar",
  EG: "ar",
  IL: "iw",
  IR: "fa",
  TR: "tr",

  // East / Southeast Asia
  JP: "ja",
  KR: "ko",
  CN: "zh-CN",
  HK: "zh-TW",
  TW: "zh-TW",
  VN: "vi",
  TH: "th",
  ID: "id",
  MY: "ms",
  PH: "tl",
  SG: "en",

  // Europe
  FR: "fr",
  DE: "de",
  ES: "es",
  IT: "it",
  PT: "pt",
  NL: "nl",
  BE: "nl",
  PL: "pl",
  RO: "ro",
  GR: "el",
  SE: "sv",
  NO: "no",
  DK: "da",
  FI: "fi",
  CZ: "cs",
  HU: "hu",
  AT: "de",
  CH: "de",
  IE: "en",
  GB: "en",
  UA: "uk",
  RU: "ru",
  BG: "bg",
  HR: "hr",
  SK: "sk",
  SI: "sl",
  LT: "lt",
  LV: "lv",
  EE: "et",

  // Americas
  US: "en",
  CA: "en",
  MX: "es",
  BR: "pt",
  AR: "es",
  CL: "es",
  CO: "es",
  PE: "es",

  // Africa
  ZA: "af",
  NG: "ha",
  KE: "sw",
  TZ: "sw",
  UG: "sw",
  ZW: "sn",
  GH: "ak",
  SN: "wo",
  RW: "rw",
  ET: "am",
  MA: "ar",
  DZ: "ar",
  TN: "ar",

  // Oceania
  AU: "en",
  NZ: "en",
};

export function languageForCountry(countryCode: string | null | undefined): string | null {
  if (!countryCode) return null;
  return COUNTRY_LANGUAGE[countryCode.toUpperCase()] ?? null;
}
