import pg from "pg";

const connectionString = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL_UNPOOLED or DATABASE_URL must be set");

const statements = [
  `CREATE TABLE IF NOT EXISTS products (
    id            SERIAL PRIMARY KEY,
    slug          TEXT UNIQUE NOT NULL,
    name          TEXT NOT NULL,
    brand         TEXT NOT NULL,
    collection    TEXT NOT NULL CHECK (collection IN ('men', 'women')),
    concentration TEXT NOT NULL,
    size_ml       INTEGER NOT NULL,
    price_cents   INTEGER NOT NULL CHECK (price_cents >= 0),
    tagline       TEXT NOT NULL,
    description   TEXT NOT NULL,
    notes_top     TEXT[] NOT NULL DEFAULT '{}',
    notes_heart   TEXT[] NOT NULL DEFAULT '{}',
    notes_base    TEXT[] NOT NULL DEFAULT '{}',
    image         TEXT NOT NULL,
    stock         INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    featured      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS products_collection_idx ON products (collection)`,
  `CREATE TABLE IF NOT EXISTS orders (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name  TEXT NOT NULL,
    email          TEXT NOT NULL,
    phone          TEXT NOT NULL,
    address        TEXT NOT NULL,
    city           TEXT NOT NULL,
    notes          TEXT,
    total_cents    INTEGER NOT NULL,
    status         TEXT NOT NULL DEFAULT 'pending',
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS order_items (
    id               SERIAL PRIMARY KEY,
    order_id         UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id       INTEGER NOT NULL REFERENCES products(id),
    quantity         INTEGER NOT NULL CHECK (quantity > 0),
    unit_price_cents INTEGER NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS order_items_order_idx ON order_items (order_id)`,
  `CREATE TABLE IF NOT EXISTS subscribers (
    id         SERIAL PRIMARY KEY,
    email      TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
];

const client = new pg.Client({ connectionString });
await client.connect();
try {
  await client.query("BEGIN");
  for (const sql of statements) await client.query(sql);
  await client.query("COMMIT");
  console.log("Migration complete.");
} catch (err) {
  await client.query("ROLLBACK");
  throw err;
} finally {
  await client.end();
}
