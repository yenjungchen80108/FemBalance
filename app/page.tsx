import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FEFCFB] dark:bg-gray-950">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-100/60 via-purple-50/40 to-transparent blur-2xl" />
        <div className="relative flex justify-end p-6">
          <ThemeToggle />
        </div>
        <div className="relative max-w-3xl mx-auto px-6 pt-8 pb-20 text-center">
          <h1 className="font-serif text-6xl text-gray-700 dark:text-gray-100 mb-4">
            FemBalance
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-xl mx-auto">
            Predicting hormonal phase from passive wearable signals — for every
            woman, not just the studied few.
          </p>
          <Link
            href="/dashboard"
            className="inline-block bg-rose-400 text-white px-8 py-3 rounded-full font-medium hover:bg-rose-600 transition"
          >
            View Patient Dashboard
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-24 grid md:grid-cols-3 gap-6">
        {[
          {
            title: "Passive Capture",
            desc: "Automatic signals only — no manual input.",
          },
          {
            title: "Explainable AI",
            desc: "Clinician trust over model size — SHAP-driven transparency.",
          },
          {
            title: "Equity by Design",
            desc: "Built for underrepresented cohorts from day one.",
          },
        ].map((f) => (
          <div
            key={f.title}
            className="p-6 border border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900"
          >
            <span className="inline-block text-xs font-medium text-rose-600 bg-rose-100 dark:bg-rose-900/30 dark:text-rose-300 px-3 py-1 rounded-full mb-3">
              {f.title}
            </span>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{f.desc}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
