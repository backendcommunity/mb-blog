"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV_ITEMS = [
  { label: "Learn", href: "https://masteringbackend.com/#learn-practically" },
  { label: "Build", href: "https://masteringbackend.com/#build-show" },
  { label: "Grow", href: "https://masteringbackend.com/#grow-succeed" },
  { label: "Blog", href: "/" },
  { label: "Community", href: "https://masteringbackend.com/community" },
  { label: "Login", href: "https://app.masteringbackend.com/?ref=home" },
];

const MAIN_NAV_ITEMS = NAV_ITEMS.filter((item) => item.label !== "Login");

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 z-50 shadow-sm dark:shadow-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex md:grid md:grid-cols-[auto,1fr,auto] items-center justify-between h-16 relative">
          <div className="flex items-center gap-4">
            <Link href="https://masteringbackend.com" className="flex items-center">
              <BrandLogo size="sm" variant="default" />
            </Link>
          </div>

          <div className="hidden md:flex items-center justify-center">
            <ul className="flex items-center gap-6 text-sm font-medium">
              {MAIN_NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-slate-700 dark:text-slate-200 hover:text-[hsl(var(--primary))] transition-colors header-nav-link"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden md:flex items-center justify-end gap-4">
            <ThemeToggle />
            <Link
              href="/login"
              className="inline-flex items-center px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition header-cta"
            >
              Login
            </Link>
            <Link
              href="/get-started"
              className="hidden lg:inline-flex items-center px-4 py-2 rounded-lg text-white bg-[hsl(var(--primary))] hover:opacity-95 transition-all font-semibold header-cta"
            >
              Get Started
            </Link>
          </div>

          <div className="flex md:hidden items-center gap-3">
            <ThemeToggle />
            <button
              aria-label="Toggle navigation"
              aria-expanded={open}
              onClick={() => setOpen(!open)}
              className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur py-4 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ul className="flex flex-col gap-3 text-base font-medium">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block px-3 py-2 rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/get-started"
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2 rounded-md text-white bg-[hsl(var(--primary))] text-center font-semibold"
                >
                  Get Started
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Header;
