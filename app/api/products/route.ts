import { NextResponse, type NextRequest } from "next/server";
import { getProducts } from "@/lib/products";
import type { Collection } from "@/lib/types";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const collection = request.nextUrl.searchParams.get("collection");
  if (collection && collection !== "men" && collection !== "women") {
    return NextResponse.json({ error: "collection must be 'men' or 'women'" }, { status: 400 });
  }
  const products = await getProducts((collection as Collection | null) ?? undefined);
  return NextResponse.json({ products });
}
