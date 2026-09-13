export const LEGAL_SITE_URL = (process.env.NEXT_PUBLIC_LEGAL_SITE_URL ?? "https://www.trytindahan.store").replace(/\/+$/, "");

export const TERMS_VERSION = "2026-09-13";
export const PRIVACY_NOTICE_VERSION = "2026-09-13";

export const legalUrls = {
  terms: `${LEGAL_SITE_URL}/terms`,
  privacy: `${LEGAL_SITE_URL}/privacy`,
  cookies: `${LEGAL_SITE_URL}/cookies`,
} as const;
