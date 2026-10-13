"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/format";

export default function BagPage() {
  const { items, subtotal, ready, setQuantity, remove, clear } = useCart();
  const router = useRouter();
  const [checkingOut, setCheckingOut] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const customer = Object.fromEntries(form.entries());

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer,
        items: items.map((i) => ({ slug: i.slug, quantity: i.quantity })),
      }),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.error ?? "Something went wrong. Please try again.");
      setSubmitting(false);
      return;
    }
    clear();
    router.push(`/order/${data.orderId}`);
  }

  if (!ready) return <div className="min-h-[60vh]" />;

  if (items.length === 0) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-[1024px] flex-col items-center justify-center px-4 py-24 text-center">
        <h1 className="headline text-[32px] sm:text-[40px] md:text-[48px]">Your bag is empty.</h1>
        <p className="mt-3 text-[19px] text-mute">Find a scent you&apos;ll love.</p>
        <div className="mt-8 flex gap-4">
          <Link href="/women" className="btn-pink">
            Shop Women
          </Link>
          <Link href="/men" className="btn-dark">
            Shop Men
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[1024px] px-4 py-14">
      <div className="border-b border-line pb-10 text-center">
        <h1 className="headline text-[28px] leading-tight sm:text-[36px] md:text-[48px]">
          Your bag total is {formatPrice(subtotal)}.
        </h1>
        <p className="mt-2 text-[17px] text-mute">Free gift wrapping on all orders.</p>
        {!checkingOut && (
          <button onClick={() => setCheckingOut(true)} className="btn-dark mt-6 px-14 py-3 text-[17px]">
            Check Out
          </button>
        )}
      </div>

      <ul className="divide-y divide-line">
        {items.map((item) => (
          <li key={item.slug} className="flex flex-col gap-4 py-8 sm:flex-row sm:gap-6">
            <Link
              href={`/product/${item.slug}`}
              className="relative mx-auto h-36 w-full max-w-[200px] shrink-0 overflow-hidden rounded-[14px] bg-cloud sm:mx-0 sm:h-32 sm:w-28 md:h-40 md:w-36"
            >
              <Image src={item.image} alt={item.name} fill sizes="150px" className="object-cover" />
            </Link>
            <div className="flex flex-1 flex-col gap-4 sm:gap-3 md:flex-row md:items-start md:justify-between">
              <div className="text-center sm:text-left">
                <p className="text-[14px] text-mute">{item.brand}</p>
                <Link href={`/product/${item.slug}`} className="headline text-[19px] hover:underline sm:text-[21px]">
                  {item.name}
                </Link>
                <p className="text-[14px] text-mute">{item.size_ml} ml</p>
              </div>
              <div className="flex items-center justify-between gap-4 sm:justify-end sm:gap-6">
                <select
                  aria-label={`Quantity of ${item.name}`}
                  value={item.quantity}
                  onChange={(e) => setQuantity(item.slug, Number(e.target.value))}
                  className="rounded-lg border border-line bg-white px-3 py-1.5 text-[17px]"
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <div className="text-right">
                  <p className="text-[19px] font-semibold">{formatPrice(item.price_cents * item.quantity)}</p>
                  <button onClick={() => remove(item.slug)} className="text-[14px] text-[#0066cc] hover:underline">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="ml-auto max-w-md space-y-3 border-t border-line pt-8 text-[17px]">
        <Row label="Subtotal" value={formatPrice(subtotal)} />
        <Row label="Delivery" value="Confirmed with your order" />
        <div className="flex justify-between border-t border-line pt-4 text-[24px] font-semibold">
          <span>Total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
      </div>

      {checkingOut ? (
        <form onSubmit={onSubmit} className="mx-auto mt-16 max-w-xl space-y-4">
          <h2 className="headline text-[32px]">Where should we send your order?</h2>
          <p className="text-[15px] text-mute">
            We&apos;ll contact you to confirm your order and arrange payment (cash on delivery or EFT).
          </p>
          <input name="name" required placeholder="Full name" autoComplete="name" className="input" />
          <div className="grid gap-4 sm:grid-cols-2">
            <input name="email" type="email" required placeholder="Email" autoComplete="email" className="input" />
            <input name="phone" type="tel" required placeholder="Phone / WhatsApp" autoComplete="tel" className="input" />
          </div>
          <input name="address" required placeholder="Street address" autoComplete="street-address" className="input" />
          <input name="city" required placeholder="City" autoComplete="address-level2" className="input" />
          <textarea name="notes" placeholder="Delivery notes (optional)" rows={3} className="input resize-none" />
          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-[15px] text-red-700" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-ink py-4 text-[17px] text-white transition-colors hover:bg-black disabled:opacity-60"
          >
            {submitting ? "Placing order…" : `Place Order · ${formatPrice(subtotal)}`}
          </button>
        </form>
      ) : (
        <div className="mt-10 text-right">
          <button onClick={() => setCheckingOut(true)} className="btn-dark px-14 py-3 text-[17px]">
            Check Out
          </button>
        </div>
      )}
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
