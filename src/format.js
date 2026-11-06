export function usd(v, locale, opts = {}) {
  if (v == null || !isFinite(v)) return "—";
  const abs = Math.abs(v);
  const digits = abs >= 1 || abs === 0 ? 2 : abs >= 0.01 ? 4 : 8;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: opts.compact ? 0 : Math.min(2, digits),
    maximumFractionDigits: opts.compact ? 0 : digits,
  }).format(v);
}

export function compactUsd(v, locale) {
  if (v == null || !isFinite(v)) return "—";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(v);
}

export function qty(v, locale) {
  if (v == null || !isFinite(v)) return "—";
  const abs = Math.abs(v);
  const max = abs >= 1000 ? 2 : abs >= 1 ? 4 : 8;
  return new Intl.NumberFormat(locale, { maximumFractionDigits: max }).format(v);
}

export function pct(v, locale, signed = true) {
  if (v == null || !isFinite(v)) return "—";
  const s = new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(v));
  const sign = v > 0 ? "+" : v < 0 ? "−" : "";
  return locale === "tr-TR" ? `${signed ? sign : ""}%${s}` : `${signed ? sign : ""}${s}%`;
}

export function signedUsd(v, locale) {
  if (v == null || !isFinite(v)) return "—";
  const sign = v > 0.005 ? "+" : v < -0.005 ? "−" : "";
  return sign + usd(Math.abs(v), locale);
}

export function time(ts, locale) {
  return new Intl.DateTimeFormat(locale, { dateStyle: "short", timeStyle: "short" }).format(ts);
}

export function clock(ts, locale) {
  return new Intl.DateTimeFormat(locale, { timeStyle: "short" }).format(ts);
}

/** Parse "1.234,56" or "1,234.56" or "0,005" into a number. */
export function parseNum(str) {
  if (typeof str !== "string") return NaN;
  let s = str.trim().replace(/\s/g, "");
  if (!s) return NaN;
  const lastComma = s.lastIndexOf(",");
  const lastDot = s.lastIndexOf(".");
  if (lastComma > lastDot) s = s.replace(/\./g, "").replace(",", ".");
  else s = s.replace(/,/g, "");
  const n = Number(s);
  return isFinite(n) ? n : NaN;
}

export const trend = (v) => (v > 0 ? "up" : v < 0 ? "down" : "flat");
