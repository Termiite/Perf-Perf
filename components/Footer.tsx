import Link from "next/link";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { href: "/women", label: "Women's Fragrances" },
      { href: "/men", label: "Men's Fragrances" },
      { href: "/#latest", label: "New Arrivals" },
      { href: "/bag", label: "Bag" },
    ],
  },
  {
    title: "Brands",
    links: [
      { href: "/product/tom-ford-oud-wood", label: "Tom Ford" },
      { href: "/product/armani-my-way-parfum", label: "Giorgio Armani" },
      { href: "/product/jo-malone-peony-blush-suede", label: "Jo Malone London" },
      { href: "/product/lancome-la-vie-est-belle-iris-absolu", label: "Lancôme" },
      { href: "/product/mugler-alien-goddess", label: "Mugler" },
      { href: "/product/valentino-voce-viva-intensa", label: "Valentino" },
    ],
  },
  {
    title: "About PERF PERF",
    links: [
      { href: "/#why", label: "100% Authentic" },
      { href: "/#why", label: "Delivery" },
      { href: "/#contact", label: "Contact Us" },
    ],
  },
];

export default function Footer() {
  return (
    <footer id="contact" className="bg-cloud text-[12px] text-mute">
      <div className="mx-auto max-w-[1024px] px-4 py-10">
        <p className="border-b border-line pb-4 leading-relaxed">
          All fragrances sold by PERF PERF are 100% authentic and arrive factory sealed. Prices include
          VAT. Stock is limited and may change without notice. Orders are confirmed by our team via phone or
          email before delivery.
        </p>

        <div className="grid grid-cols-2 gap-8 py-8 md:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="mb-2 font-semibold text-ink">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="hover:underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h3 className="mb-2 font-semibold text-ink">Get in touch</h3>
            <ul className="space-y-2">
              <li>Order via WhatsApp or email</li>
              <li>Mon – Sat, 9am – 6pm</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-line pt-4 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-x-4 md:gap-y-2">
          <p>Copyright © {new Date().getFullYear()} PERF PERF. All rights reserved.</p>
          <p className="md:text-center">Scent. Perfected.</p>
          <p>
            Developed by{" "}
            <a
              href="https://termiite.co.za"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink underline-offset-2 hover:underline"
            >
              Termiite
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
