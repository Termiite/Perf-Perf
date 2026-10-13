const currency = process.env.NEXT_PUBLIC_CURRENCY ?? "ZAR";
const locale = process.env.NEXT_PUBLIC_LOCALE ?? "en-ZA";

const formatter = new Intl.NumberFormat(locale, {
  style: "currency",
  currency,
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

export function formatPrice(cents: number): string {
  return formatter.format(cents / 100);
}
