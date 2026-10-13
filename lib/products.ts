import "server-only";
import { pool } from "./db";
import type { Collection, Product } from "./types";

const COLUMNS = `id, slug, name, brand, collection, concentration, size_ml, price_cents, tagline,
  description, notes_top, notes_heart, notes_base, image, stock, featured`;

export async function getProducts(collection?: Collection): Promise<Product[]> {
  const { rows } = collection
    ? await pool.query<Product>(
        `SELECT ${COLUMNS} FROM products WHERE collection = $1 ORDER BY featured DESC, price_cents DESC`,
        [collection],
      )
    : await pool.query<Product>(
        `SELECT ${COLUMNS} FROM products ORDER BY featured DESC, price_cents DESC`,
      );
  return rows;
}

export async function getProduct(slug: string): Promise<Product | null> {
  const { rows } = await pool.query<Product>(
    `SELECT ${COLUMNS} FROM products WHERE slug = $1`,
    [slug],
  );
  return rows[0] ?? null;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { rows } = await pool.query<Product>(
    `SELECT ${COLUMNS} FROM products WHERE featured ORDER BY price_cents DESC`,
  );
  return rows;
}
