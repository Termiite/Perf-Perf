"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "./CartProvider";
import type { Product } from "@/lib/types";

export default function AddToBag({ product }: { product: Product }) {
  const { add } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const women = product.collection === "women";
  const soldOut = product.stock <= 0;
  const maxQty = Math.min(10, product.stock);

  function onAdd() {
    add(
      {
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        image: product.image,
        price_cents: product.price_cents,
        size_ml: product.size_ml,
      },
      quantity,
    );
    setAdded(true);
  }

  if (soldOut) {
    return (
      <button disabled className="w-full cursor-not-allowed rounded-xl bg-line py-4 text-[17px] text-mute">
        Sold out
      </button>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <label className="sr-only" htmlFor="qty">
          Quantity
        </label>
        <select
          id="qty"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="rounded-xl border border-line bg-white px-4 text-[17px] outline-none focus:border-[#0071e3]"
        >
          {Array.from({ length: maxQty }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <button
          onClick={onAdd}
          className={`flex-1 rounded-xl py-4 text-[17px] text-white transition-colors ${
            women ? "bg-blush-700 hover:bg-[#a03760]" : "bg-ink hover:bg-black"
          }`}
        >
          Add to Bag
        </button>
      </div>
      {added && (
        <p className="flex items-center justify-between rounded-xl bg-cloud px-4 py-3 text-[15px]" role="status">
          <span>Added to your bag.</span>
          <Link href="/bag" className={`link-chevron ${women ? "text-blush-700" : "text-ink font-semibold"}`}>
            Review bag
          </Link>
        </p>
      )}
    </div>
  );
}
