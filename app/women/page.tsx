import type { Metadata } from "next";
import CollectionPage from "@/components/CollectionPage";
import { getProducts } from "@/lib/products";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Women's Fragrances",
  description: "Designer perfumes for her: Giorgio Armani, Lancôme, Mugler, Valentino, Jo Malone and more.",
};

export default async function WomenPage() {
  const products = await getProducts("women");
  return <CollectionPage collection="women" products={products} />;
}
