"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-gray-950/70 border-b border-gray-100 dark:border-gray-900">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href={isHome ? "/" : "/dashboard"}
          className="flex items-center gap-2 group"
        >
          <span className="w-7 h-7 rounded-full bg-rose-400 flex items-center justify-center text-white text-xs font-serif group-hover:bg-rose-500 transition">
            F
          </span>
          <span className="font-serif text-lg text-gray-700 dark:text-gray-100">
            FemBalance
          </span>
        </Link>
        <ThemeToggle />
      </div>
    </nav>
  );
}
