import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export const runtime = "nodejs";

interface OrderBody {
  customer: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    notes?: string;
  };
  items: { slug: string; quantity: number }[];
}

class OrderError extends Error {}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: OrderBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const c = body.customer ?? {};
  const name = c.name?.trim();
  const email = c.email?.trim().toLowerCase();
  const phone = c.phone?.trim();
  const address = c.address?.trim();
  const city = c.city?.trim();
  if (!name || !email || !phone || !address || !city) {
    return NextResponse.json({ error: "Please fill in all delivery details." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const quantities = new Map<string, number>();
  for (const item of body.items ?? []) {
    const qty = Math.floor(Number(item.quantity));
    if (typeof item.slug !== "string" || !Number.isFinite(qty) || qty < 1 || qty > 10) {
      return NextResponse.json({ error: "Invalid item in bag." }, { status: 400 });
    }
    quantities.set(item.slug, (quantities.get(item.slug) ?? 0) + qty);
  }
  if (quantities.size === 0) {
    return NextResponse.json({ error: "Your bag is empty." }, { status: 400 });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { rows: products } = await client.query<{
      id: number;
      slug: string;
      name: string;
      price_cents: number;
      stock: number;
    }>(
      "SELECT id, slug, name, price_cents, stock FROM products WHERE slug = ANY($1) FOR UPDATE",
      [[...quantities.keys()]],
    );

    if (products.length !== quantities.size) throw new OrderError("Some items are no longer available.");

    let total = 0;
    for (const p of products) {
      const qty = quantities.get(p.slug)!;
      if (p.stock < qty) throw new OrderError(`Only ${p.stock} of ${p.name} left in stock.`);
      total += p.price_cents * qty;
    }

    const { rows } = await client.query<{ id: string }>(
      `INSERT INTO orders (customer_name, email, phone, address, city, notes, total_cents)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [name, email, phone, address, city, c.notes?.trim() || null, total],
    );
    const orderId = rows[0].id;

    for (const p of products) {
      const qty = quantities.get(p.slug)!;
      await client.query(
        "INSERT INTO order_items (order_id, product_id, quantity, unit_price_cents) VALUES ($1, $2, $3, $4)",
        [orderId, p.id, qty, p.price_cents],
      );
      await client.query("UPDATE products SET stock = stock - $1 WHERE id = $2", [qty, p.id]);
    }

    await client.query("COMMIT");
    return NextResponse.json({ orderId, total_cents: total }, { status: 201 });
  } catch (err) {
    await client.query("ROLLBACK");
    if (err instanceof OrderError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    console.error("Order failed", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  } finally {
    client.release();
  }
}
