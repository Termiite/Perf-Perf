import Image from "next/image";
import Link from "next/link";
import ProductCard from "./ProductCard";
import type { Collection, Product } from "@/lib/types";

const COPY: Record<Collection, { eyebrow: string; title: string; subtitle: string; heroSlug: string }> = {
  women: {
    eyebrow: "Women's Fragrances",
    title: "Made to be remembered.",
    subtitle: "Luminous florals, creamy vanillas and playful gourmands — curated for her.",
    heroSlug: "lancome-la-vie-est-belle-iris-absolu",
  },
  men: {
    eyebrow: "Men's Fragrances",
    title: "Presence, bottled.",
    subtitle: "Smoky ouds, dark woods and warm resins — curated for him.",
    heroSlug: "tom-ford-oud-wood",
  },
};

export default function CollectionPage({ collection, products }: { collection: Collection; products: Product[] }) {
  const copy = COPY[collection];
  const women = collection === "women";
  const hero = products.find((p) => p.slug === copy.heroSlug) ?? products[0];
  const brands = [...new Set(products.map((p) => p.brand))];

  return (
    <div className={women ? "bg-white text-ink" : "bg-black text-white"}>
      <section className={women ? "bg-gradient-to-b from-blush-200 via-blush-100 to-white" : "bg-black"}>
        <div className="mx-auto grid max-w-[1024px] items-center gap-10 px-4 pt-16 pb-12 md:grid-cols-2 md:pt-24">
          <div className="fade-up text-center md:text-left">
            <p className={`text-[17px] font-semibold ${women ? "text-blush-700" : "text-white/60"}`}>{copy.eyebrow}</p>
            <h1 className="headline mt-2 text-[36px] leading-[1.08] sm:text-[48px] md:text-[64px]">{copy.title}</h1>
            <p className={`mt-4 text-[17px] sm:text-[21px] ${women ? "text-mute" : "text-white/60"}`}>{copy.subtitle}</p>
            {hero && (
              <div className="btn-row-mobile mt-6 flex justify-center gap-4 sm:flex-row md:justify-start">
                <a href="#shop" className={women ? "btn-pink" : "btn-light"}>
                  Shop all
                </a>
                <Link href={`/product/${hero.slug}`} className={women ? "btn-outline-pink" : "btn-outline-light"}>
                  {hero.name}
                </Link>
              </div>
            )}
          </div>
          {hero && (
            <Link
              href={`/product/${hero.slug}`}
              className={`fade-up-delay relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[28px] shadow-2xl ${
                women ? "shadow-blush-300/60" : "bg-white shadow-white/10"
              }`}
            >
              <Image
                src={hero.image}
                alt={`${hero.brand} ${hero.name}`}
                fill
                priority
                sizes="(max-width: 768px) 90vw, 380px"
                className="object-cover"
              />
            </Link>
          )}
        </div>
      </section>

      <section className={`border-y ${women ? "border-blush-200 bg-blush-50" : "border-white/10 bg-[#0a0a0a]"}`}>
        <div className="no-scrollbar mx-auto flex max-w-[1024px] gap-8 overflow-x-auto px-4 py-5 text-[13px]">
          {brands.map((b) => (
            <span key={b} className={`shrink-0 ${women ? "text-mute" : "text-white/60"}`}>
              {b}
            </span>
          ))}
        </div>
      </section>

      <section id="shop" className={`scroll-mt-12 py-16 ${women ? "bg-blush-50" : "bg-black"}`}>
        <div className="mx-auto max-w-[1024px] px-4">
          <h2 className="headline text-[32px] md:text-[40px]">
            All {women ? "women's" : "men's"} fragrances.{" "}
            <span className={women ? "text-mute" : "text-white/50"}>{products.length} scents.</span>
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.slug} product={p} dark={!women} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
