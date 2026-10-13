import type { Metadata } from "next";
import CollectionPage from "@/components/CollectionPage";
import { getProducts } from "@/lib/products";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Men's Fragrances",
  description: "Designer fragrances for him: Tom Ford, Jo Malone London and more.",
};

export default async function MenPage() {
  const products = await getProducts("men");
  return <CollectionPage collection="men" products={products} />;
}
