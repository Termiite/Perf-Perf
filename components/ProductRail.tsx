import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

export default function ProductRail({ products, dark = false }: { products: Product[]; dark?: boolean }) {
  return (
    <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-4 px-4 pb-8 md:-mx-[max(1rem,calc((100vw-1024px)/2))] md:scroll-px-[max(1rem,calc((100vw-1024px)/2))] md:px-[max(1rem,calc((100vw-1024px)/2))]">
      {products.map((p) => (
        <div key={p.slug} className="w-[78vw] max-w-[300px] shrink-0 snap-start">
          <ProductCard product={p} dark={dark} />
        </div>
      ))}
    </div>
  );
}
