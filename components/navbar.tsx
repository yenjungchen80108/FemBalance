"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-950/80 border-b border-gray-100 dark:border-gray-900">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="w-7 h-7 rounded-full bg-rose-400 flex items-center justify-center text-white text-xs font-serif group-hover:bg-rose-500 transition">
            F
          </span>
          <span className="font-serif text-lg text-gray-700 dark:text-gray-100">
            FemBalance
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className={`text-sm px-3 py-1.5 rounded-full transition ${
              pathname === "/dashboard"
                ? "bg-rose-100 text-rose-700 font-medium dark:bg-rose-900/40 dark:text-rose-200"
                : "text-gray-600 hover:text-rose-600 dark:text-gray-300 dark:hover:text-rose-300"
            }`}
          >
            Patients
          </Link>
          <Link
            href="/analytics"
            className={`text-sm px-3 py-1.5 rounded-full transition ${
              pathname === "/analytics"
                ? "bg-rose-100 text-rose-700 font-medium dark:bg-rose-900/40 dark:text-rose-200"
                : "text-gray-600 hover:text-rose-600 dark:text-gray-300 dark:hover:text-rose-300"
            }`}
          >
            Analytics
          </Link>
          <span className="mx-2 w-px h-5 bg-gray-200 dark:bg-gray-800" />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
