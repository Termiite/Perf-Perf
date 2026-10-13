import Image from "next/image";
import Link from "next/link";
import Newsletter from "@/components/Newsletter";
import ProductRail from "@/components/ProductRail";
import { getProducts } from "@/lib/products";
import type { Product } from "@/lib/types";

export const revalidate = 60;

export default async function HomePage() {
  const products = await getProducts();
  const bySlug = Object.fromEntries(products.map((p) => [p.slug, p]));
  const promoTiles = [
    bySlug["tom-ford-black-orchid"],
    bySlug["armani-my-way-parfum"],
    bySlug["jo-malone-oud-bergamot"],
    bySlug["mugler-alien-goddess"],
  ].filter(Boolean) as Product[];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-black text-white">
        <div className="mx-auto flex max-w-[1024px] flex-col items-center px-4 pt-14 pb-16 text-center md:pt-20">
          <Image
            src="/images/logo.jpg"
            alt="PERF PERF"
            width={220}
            height={220}
            priority
            className="fade-up h-44 w-44 md:h-56 md:w-56"
          />
          <h1 className="headline fade-up-delay mt-4 text-[48px] leading-[1.05] md:text-[80px]">
            Scent. <span className="gold-text">Perfected.</span>
          </h1>
          <p className="fade-up-delay mt-4 max-w-xl text-[21px] text-white/70 md:text-[24px]">
            Authentic designer fragrances. Factory sealed. Delivered to your door.
          </p>
          <div className="fade-up-delay-2 mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/women" className="btn bg-blush-200 text-ink hover:bg-blush-300">
              Shop Women
            </Link>
            <Link href="/men" className="btn-outline-light">
              Shop Men
            </Link>
          </div>
        </div>
      </section>

      {/* Women tile */}
      <section className="mt-3 bg-gradient-to-b from-blush-100 to-white text-ink">
        <div className="mx-auto flex max-w-[1024px] flex-col items-center px-4 pt-14 text-center">
          <p className="text-[17px] font-semibold text-blush-700">For Her</p>
          <h2 className="headline mt-1 text-[40px] md:text-[56px]">Soft. Radiant. You.</h2>
          <p className="mt-2 text-[21px] text-mute md:text-[24px]">
            Florals, vanillas and gourmands from the houses you love.
          </p>
          <div className="mt-5 flex gap-4">
            <Link href="/women" className="btn-pink">
              Shop Women
            </Link>
            <Link href="/product/lancome-la-vie-est-belle-iris-absolu" className="btn-outline-pink">
              Discover
            </Link>
          </div>
          <div className="mt-10 grid w-full max-w-3xl grid-cols-3 items-end gap-3 md:gap-6">
            {["armani-my-way-sunny-vanilla", "lancome-la-vie-est-belle-iris-absolu", "armani-in-love-with-you"].map(
              (slug, i) =>
                bySlug[slug] && (
                  <Link
                    key={slug}
                    href={`/product/${slug}`}
                    className={`relative overflow-hidden rounded-t-[22px] shadow-xl ${
                      i === 1 ? "aspect-[3/4]" : "aspect-[3/4] scale-90 opacity-95"
                    }`}
                  >
                    <Image src={bySlug[slug].image} alt={bySlug[slug].name} fill sizes="300px" className="object-cover" />
                  </Link>
                ),
            )}
          </div>
        </div>
      </section>

      {/* Men tile */}
      <section className="mt-3 bg-black text-white">
        <div className="mx-auto grid max-w-[1024px] items-center gap-10 px-4 py-16 md:grid-cols-2">
          <div className="text-center md:text-left">
            <p className="text-[17px] font-semibold text-white/60">For Him</p>
            <h2 className="headline mt-1 text-[40px] md:text-[56px]">Bold. Dark. Defined.</h2>
            <p className="mt-2 text-[21px] text-white/60 md:text-[24px]">
              Oud, woods and resins for an unforgettable presence.
            </p>
            <div className="mt-5 flex justify-center gap-4 md:justify-start">
              <Link href="/men" className="btn-light">
                Shop Men
              </Link>
              <Link href="/product/tom-ford-oud-wood" className="btn-outline-light">
                Oud Wood
              </Link>
            </div>
          </div>
          {bySlug["tom-ford-oud-wood"] && (
            <Link
              href="/product/tom-ford-oud-wood"
              className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-[28px] bg-white"
            >
              <Image
                src={bySlug["tom-ford-oud-wood"].image}
                alt="Tom Ford Oud Wood"
                fill
                sizes="(max-width: 768px) 90vw, 450px"
                className="object-contain transition-transform duration-700 hover:scale-105"
              />
            </Link>
          )}
        </div>
      </section>

      {/* Promo grid */}
      <section className="grid gap-3 p-3 md:grid-cols-2">
        {promoTiles.map((p) => (
          <PromoTile key={p.slug} product={p} />
        ))}
      </section>

      {/* Latest rail */}
      <section id="latest" className="bg-cloud py-16">
        <div className="mx-auto max-w-[1024px] px-4">
          <h2 className="headline text-[32px] md:text-[48px]">
            The latest. <span className="text-mute">Take a look at what&apos;s new.</span>
          </h2>
          <div className="mt-8">
            <ProductRail products={products} />
          </div>
        </div>
      </section>

      {/* Why */}
      <section id="why" className="bg-white py-20">
        <div className="mx-auto max-w-[1024px] px-4">
          <h2 className="headline text-[32px] md:text-[48px]">
            Why PERF PERF. <span className="text-mute">The difference is in the details.</span>
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: "✓", title: "100% Authentic", body: "Every bottle is genuine and sourced from trusted suppliers." },
              { icon: "◇", title: "Factory Sealed", body: "Arrives in its original cellophane-wrapped box." },
              { icon: "→", title: "Fast Delivery", body: "We confirm your order personally and deliver quickly." },
              { icon: "♡", title: "Gift Ready", body: "Luxury packaging, perfect for someone special." },
            ].map((f) => (
              <div key={f.title} className="rounded-[18px] bg-cloud p-7">
                <span className="gold-text text-[32px] font-semibold">{f.icon}</span>
                <h3 className="headline mt-4 text-[21px]">{f.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-mute">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="border-t border-line bg-white py-20 text-center">
        <div className="mx-auto max-w-[1024px] px-4">
          <h2 className="headline text-[32px] md:text-[40px]">Be the first to know.</h2>
          <p className="mt-2 text-[19px] text-mute">New arrivals, restocks and exclusive offers.</p>
          <Newsletter />
        </div>
      </section>
    </>
  );
}

function PromoTile({ product }: { product: Product }) {
  const women = product.collection === "women";
  const shell = women ? "bg-blush-100 text-ink" : "bg-ink text-white";

  return (
    <div className={`flex flex-col items-center overflow-hidden px-6 pt-12 text-center ${shell}`}>
      <p className={`text-[14px] font-semibold ${women ? "text-blush-700" : "text-gold-light"}`}>{product.brand}</p>
      <h3 className="headline mt-1 text-[32px] md:text-[40px]">{product.name}</h3>
      <p className={`mt-1 text-[19px] ${women ? "text-mute" : "text-white/60"}`}>{product.tagline}</p>
      <div className="mt-4 flex gap-4 text-[17px]">
        <Link
          href={`/product/${product.slug}`}
          className={`link-chevron hover:underline ${women ? "text-blush-700" : "text-gold-light"}`}
        >
          Learn more
        </Link>
        <Link
          href={`/product/${product.slug}#buy`}
          className={`link-chevron hover:underline ${women ? "text-blush-700" : "text-gold-light"}`}
        >
          Buy
        </Link>
      </div>
      <div className="relative mt-8 aspect-[4/3] w-full max-w-sm overflow-hidden rounded-t-[22px]">
        <Image
          src={product.image}
          alt={`${product.brand} ${product.name}`}
          fill
          sizes="(max-width: 768px) 90vw, 400px"
          className="object-cover transition-transform duration-700 hover:scale-105"
        />
      </div>
    </div>
  );
}
