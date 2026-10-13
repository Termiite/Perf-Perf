import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

export default function ProductCard({ product, dark = false }: { product: Product; dark?: boolean }) {
  const soldOut = product.stock <= 0;
  const accent = product.collection === "women" ? "text-blush-700" : dark ? "text-gold-light" : "text-gold";

  return (
    <Link
      href={`/product/${product.slug}`}
      className={`group flex flex-col overflow-hidden rounded-[18px] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] ${
        dark ? "bg-[#1d1d1f] text-white" : "bg-white text-ink"
      }`}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={product.image}
          alt={`${product.brand} ${product.name}`}
          fill
          sizes="(max-width: 768px) 80vw, 320px"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className={`text-[12px] font-semibold uppercase tracking-wider ${accent}`}>
          {soldOut ? "Sold out" : product.featured ? "Bestseller" : product.brand}
        </p>
        <h3 className="headline mt-1 text-[21px] leading-tight">{product.name}</h3>
        <p className={`mt-1 text-[14px] ${dark ? "text-white/60" : "text-mute"}`}>
          {product.concentration} · {product.size_ml} ml
        </p>
        <p className="mt-auto pt-5 text-[15px]">{formatPrice(product.price_cents)}</p>
      </div>
    </Link>
  );
}
