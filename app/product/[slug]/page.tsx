import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToBag from "@/components/AddToBag";
import ProductRail from "@/components/ProductRail";
import { formatPrice } from "@/lib/format";
import { getProduct, getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Not found" };
  return {
    title: `${product.brand} ${product.name}`,
    description: product.description,
    openGraph: { images: [product.image] },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const women = product.collection === "women";
  const related = (await getProducts(product.collection)).filter((p) => p.slug !== product.slug);
  const lowStock = product.stock > 0 && product.stock <= 3;

  const notes = [
    { label: "Top", items: product.notes_top },
    { label: "Heart", items: product.notes_heart },
    { label: "Base", items: product.notes_base },
  ];

  return (
    <>
      <div className={`border-b ${women ? "border-blush-200 bg-blush-50" : "border-line bg-white"}`}>
        <div className="mx-auto flex max-w-[1024px] items-center justify-between px-4 py-3 text-[13px]">
          <Link href={`/${product.collection}`} className="text-mute hover:text-ink">
            {women ? "Women" : "Men"} <span className="mx-1">›</span> {product.brand}
          </Link>
          <span className="hidden text-mute sm:inline">Free gift wrapping on every order</span>
        </div>
      </div>

      <section id="buy" className="mx-auto max-w-[1024px] px-4 py-10 md:py-16">
        <p className={`text-[14px] font-semibold ${women ? "text-blush-700" : "text-ink"}`}>
          {product.featured ? "Bestseller" : product.brand}
        </p>
        <h1 className="headline mt-1 text-[32px] leading-tight sm:text-[40px] md:text-[48px]">
          Buy {product.name}
        </h1>
        <p className="mt-1 text-[17px] text-mute">From {formatPrice(product.price_cents)}</p>

        <div className="mt-8 grid gap-10 md:grid-cols-[1.2fr_1fr]">
          <div className="md:sticky md:top-20 md:self-start">
            <div
              className={`relative aspect-[4/5] overflow-hidden rounded-[28px] ${
                women ? "bg-blush-100" : "bg-cloud"
              }`}
            >
              <Image
                src={product.image}
                alt={`${product.brand} ${product.name}`}
                fill
                priority
                sizes="(max-width: 768px) 92vw, 560px"
                className="object-cover"
              />
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <p className="text-[15px] text-mute">{product.brand}</p>
              <h2 className="headline text-[28px]">{product.name}</h2>
              <p className={`mt-1 text-[19px] ${women ? "text-blush-700" : "text-ink"}`}>{product.tagline}</p>
            </div>

            <p className="text-[17px] leading-relaxed text-ink/80">{product.description}</p>

            <div className="grid grid-cols-2 gap-3">
              <Spec label="Concentration" value={product.concentration} />
              <Spec label="Size" value={`${product.size_ml} ml`} />
            </div>

            <div>
              <h3 className="headline text-[21px]">Scent notes.</h3>
              <div className="mt-3 divide-y divide-line rounded-[18px] border border-line">
                {notes.map((n) => (
                  <div key={n.label} className="flex gap-4 px-5 py-4">
                    <span className="w-14 shrink-0 text-[14px] font-semibold text-mute">{n.label}</span>
                    <span className="text-[15px]">{n.items.join(", ")}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`rounded-[18px] p-6 ${women ? "bg-blush-50" : "bg-cloud"}`}>
              <div className="flex items-baseline justify-between">
                <span className="text-[17px]">Total</span>
                <span className="headline text-[28px]">{formatPrice(product.price_cents)}</span>
              </div>
              <p className={`mt-1 text-[14px] ${lowStock ? "text-orange-600" : "text-mute"}`}>
                {product.stock <= 0
                  ? "Currently out of stock."
                  : lowStock
                    ? `Only ${product.stock} left — order soon.`
                    : "In stock and ready to ship."}
              </p>
              <div className="mt-5">
                <AddToBag product={product} />
              </div>
            </div>

            <ul className="space-y-3 text-[14px] text-mute">
              <li>✓ 100% authentic, factory-sealed box</li>
              <li>✓ Order confirmed personally by our team</li>
              <li>✓ Pay on delivery or by EFT</li>
            </ul>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className={`py-16 ${women ? "bg-blush-50" : "bg-black text-white"}`}>
          <div className="mx-auto max-w-[1024px] px-4">
            <h2 className="headline text-[32px] md:text-[40px]">You may also like.</h2>
            <div className="mt-8">
              <ProductRail products={related} dark={!women} />
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[14px] border border-line p-4">
      <p className="text-[12px] text-mute">{label}</p>
      <p className="mt-1 text-[17px] font-semibold">{value}</p>
    </div>
  );
}
