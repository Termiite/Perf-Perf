export type Collection = "men" | "women";

export interface Product {
  id: number;
  slug: string;
  name: string;
  brand: string;
  collection: Collection;
  concentration: string;
  size_ml: number;
  price_cents: number;
  tagline: string;
  description: string;
  notes_top: string[];
  notes_heart: string[];
  notes_base: string[];
  image: string;
  stock: number;
  featured: boolean;
}

export interface CartItem {
  slug: string;
  name: string;
  brand: string;
  image: string;
  price_cents: number;
  size_ml: number;
  quantity: number;
}
