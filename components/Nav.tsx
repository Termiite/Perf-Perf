"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";

const LINKS = [
  { href: "/women", label: "Women" },
  { href: "/men", label: "Men" },
  { href: "/#latest", label: "New Arrivals" },
  { href: "/#why", label: "Why PERF PERF" },
  { href: "/#contact", label: "Contact" },
];

export default function Nav() {
  const pathname = usePathname();
  const { count, ready } = useCart();
  const [open, setOpen] = useState(false);
  const dark = pathname === "/" || pathname.startsWith("/men");

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  const shell = dark
    ? "bg-black/80 text-[#e8e8ed] border-white/10"
    : "bg-white/80 text-ink/80 border-black/5";

  return (
    <header className={`sticky top-0 z-50 border-b backdrop-blur-xl backdrop-saturate-150 ${shell}`}>
      <nav
        className="mx-auto flex h-12 max-w-[1024px] items-center justify-between px-4 text-[12px]"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <Link href="/" aria-label="PERF PERF home" className="flex min-w-0 items-center gap-2">
          <Image
            src="/images/logo.jpg"
            alt=""
            width={28}
            height={28}
            className="shrink-0 rounded-full"
            priority
          />
          <span
            className={`truncate text-[13px] font-semibold tracking-[0.15em] sm:tracking-[0.2em] ${dark ? "gold-text" : "text-ink"}`}
          >
            PERF PERF
          </span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="opacity-80 transition-opacity hover:opacity-100">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          <Link
            href="/bag"
            aria-label="Shopping bag"
            className="relative flex h-11 w-11 items-center justify-center opacity-80 hover:opacity-100"
          >
            <BagIcon />
            {ready && count > 0 && (
              <span
                className={`absolute right-1 top-1 flex h-[15px] min-w-[15px] items-center justify-center rounded-full px-1 text-[10px] font-semibold ${
                  dark ? "bg-white text-black" : "bg-ink text-white"
                }`}
              >
                {count}
              </span>
            )}
          </Link>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center opacity-80 hover:opacity-100 md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <MenuIcon open={open} />
          </button>
        </div>
      </nav>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 top-12 z-40 bg-black/40 md:hidden"
            onClick={() => setOpen(false)}
          />
          <div
            className={`fixed inset-x-0 top-12 z-50 max-h-[calc(100dvh-3rem)] overflow-y-auto px-6 pb-10 pt-4 md:hidden ${
              dark ? "bg-black" : "bg-white"
            }`}
            style={{ paddingBottom: "max(2.5rem, env(safe-area-inset-bottom))" }}
          >
            <ul className="space-y-1">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="headline block rounded-xl px-2 py-3 text-[26px] active:bg-black/5"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/bag" className="headline block rounded-xl px-2 py-3 text-[26px] active:bg-black/5">
                  Bag{ready && count > 0 ? ` (${count})` : ""}
                </Link>
              </li>
            </ul>
          </div>
        </>
      )}
    </header>
  );
}

function BagIcon() {
  return (
    <svg width="15" height="17" viewBox="0 0 15 17" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M1.5 5h12l-.8 10.5a1 1 0 0 1-1 .9H3.3a1 1 0 0 1-1-.9L1.5 5Z" />
      <path d="M4.5 5V3.8a3 3 0 0 1 6 0V5" />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.3">
      <path d="M3 3l10 10M13 3L3 13" />
    </svg>
  ) : (
    <svg width="18" height="12" viewBox="0 0 18 12" stroke="currentColor" strokeWidth="1.3">
      <path d="M1 3h16M1 9h16" />
    </svg>
  );
}
