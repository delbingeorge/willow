import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { Logo } from "./logo";

const navLinks = [
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "Docs", href: "/docs" },
];

const navLinkClassName =
  "px-2 py-1 text-sm font-medium transition-colors text-fg-3 hover:text-fg-4";

export function Navbar() {
  return (
    <header className="fixed top-8 left-1/2 z-99 hidden w-[530px] -translate-x-1/2 overflow-hidden rounded-[24px] bg-background shadow-xs backdrop-blur-lg md:block">
      <nav className="flex h-15 items-center justify-between gap-2 px-4">
        <div className="flex items-center gap-5">
          <Link href="/" className="shrink-0 text-fg-4">
            <Logo />
          </Link>
        </div>
        <div className="flex items-center gap-3">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={navLinkClassName}>
              {link.label}
            </Link>
          ))}
          <Link
            href="/get-started"
            className={buttonVariants({ variant: "primary" })}
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
}
