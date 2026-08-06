import { Bike, ExternalLink, Mail } from "lucide-react";
import Link from "next/link";

const footerLinks = [
  { href: "/gear", label: "Gear" },
  { href: "/cart", label: "Cart" },
  { href: "/about", label: "About" },
  { href: "/auth/register", label: "Register" },
];

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 text-sm text-zinc-600 dark:text-zinc-400 sm:px-6 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-base font-black text-zinc-950 dark:text-zinc-50">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-teal-600 text-white">
              <Bike size={20} />
            </span>
            GearUp
          </Link>
          <p className="mt-3 max-w-xl">
            Sports and outdoor gear rentals for customers, providers, and admins.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 font-semibold">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-teal-700 dark:hover:text-teal-400">
              {link.label}
            </Link>
          ))}
          <a
            href="mailto:support@gearup.test"
            className="inline-flex items-center gap-1 hover:text-teal-700 dark:hover:text-teal-400"
          >
            <Mail size={16} /> Support
          </a>
          {/* <a
            href="https://github.com/pronoyc11/gearup-backend"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 hover:text-teal-700 dark:hover:text-teal-400"
          >
            <ExternalLink size={16} /> API
          </a> */}
        </div>
      </div>
    </footer>
  );
}
