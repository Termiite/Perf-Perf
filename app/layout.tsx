import type { Metadata, Viewport } from "next";
import { CartProvider } from "@/components/CartProvider";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "PERF PERF — Designer Fragrances",
    template: "%s — PERF PERF",
  },
  description:
    "Authentic designer perfumes for him and her. Tom Ford, Giorgio Armani, Jo Malone, Lancôme, Mugler, Valentino and more — factory sealed and delivered.",
  icons: { icon: "/images/logo.jpg" },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Nav />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
