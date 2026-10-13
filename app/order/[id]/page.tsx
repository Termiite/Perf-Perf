import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pool } from "@/lib/db";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Order confirmed", robots: { index: false } };

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID_RE.test(id)) notFound();

  const { rows: orders } = await pool.query<{
    id: string;
    customer_name: string;
    email: string;
    city: string;
    total_cents: number;
    status: string;
  }>("SELECT id, customer_name, email, city, total_cents, status FROM orders WHERE id = $1", [id]);
  const order = orders[0];
  if (!order) notFound();

  const { rows: items } = await pool.query<{
    name: string;
    brand: string;
    image: string;
    quantity: number;
    unit_price_cents: number;
  }>(
    `SELECT p.name, p.brand, p.image, oi.quantity, oi.unit_price_cents
     FROM order_items oi JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id = $1`,
    [id],
  );

  return (
    <section className="mx-auto max-w-2xl px-4 py-20 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-ink text-[28px] text-white">
        ✓
      </div>
      <h1 className="headline mt-6 text-[40px] md:text-[48px]">
        Thank you, {order.customer_name.split(" ")[0]}.
      </h1>
      <p className="mt-3 text-[19px] text-mute">
        Your order has been received. We&apos;ll be in touch at {order.email} to confirm delivery to{" "}
        {order.city}.
      </p>
      <p className="mt-2 text-[14px] text-mute">Order number: {order.id.slice(0, 8).toUpperCase()}</p>

      <ul className="mt-10 divide-y divide-line rounded-[18px] border border-line text-left">
        {items.map((i) => (
          <li key={i.name} className="flex items-center gap-4 p-4">
            <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-cloud">
              <Image src={i.image} alt={i.name} fill sizes="60px" className="object-cover" />
            </div>
            <div className="flex-1">
              <p className="text-[13px] text-mute">{i.brand}</p>
              <p className="font-semibold">
                {i.name} <span className="font-normal text-mute">× {i.quantity}</span>
              </p>
            </div>
            <p>{formatPrice(i.unit_price_cents * i.quantity)}</p>
          </li>
        ))}
        <li className="flex justify-between p-4 text-[19px] font-semibold">
          <span>Total</span>
          <span>{formatPrice(order.total_cents)}</span>
        </li>
      </ul>

      <Link href="/" className="btn-dark mt-10">
        Continue shopping
      </Link>
    </section>
  );
}
