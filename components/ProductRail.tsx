import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

export default function ProductRail({ products, dark = false }: { products: Product[]; dark?: boolean }) {
  return (
    <div>
      <p className="mb-3 text-[13px] text-mute md:hidden">Swipe to browse</p>
      <div
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 [-webkit-overflow-scrolling:touch] md:-mx-[max(1rem,calc((100vw-1024px)/2))] md:scroll-px-[max(1rem,calc((100vw-1024px)/2))] md:gap-5 md:px-[max(1rem,calc((100vw-1024px)/2))] md:pb-8"
      >
      {products.map((p) => (
        <div key={p.slug} className="w-[min(82vw,300px)] shrink-0 snap-center">
          <ProductCard product={p} dark={dark} />
        </div>
      ))}
      </div>
    </div>
  );
}
