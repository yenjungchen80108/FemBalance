import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FEFCFB] dark:bg-gray-950">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-100/60 via-purple-50/40 to-transparent blur-2xl" />
        <div className="relative max-w-3xl mx-auto px-6 pt-16 pb-12 text-center">
          <span className="inline-block text-xs font-medium text-rose-600 bg-rose-100 dark:bg-rose-900/30 dark:text-rose-300 px-3 py-1 rounded-full mb-5">
            HACK-NATION · WOMEN&apos;S HORMONAL HEALTH
          </span>
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

      {/* Feature cards */}
      <div className="max-w-5xl mx-auto px-6 pb-24 grid md:grid-cols-3 gap-6">
        {[
          {
            title: "Passive Capture",
            desc: "Automatic wearable + hormone-test signals only — no manual input.",
          },
          {
            title: "Explainable AI",
            desc: "Clinician trust over model size — transparent, signal-driven predictions.",
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

      {/* How it works + phone mockup */}
      <div className="max-w-5xl mx-auto px-6 pb-28 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block text-xs font-medium text-rose-600 bg-rose-100 dark:bg-rose-900/30 dark:text-rose-300 px-3 py-1 rounded-full mb-4">
            HOW IT WORKS
          </span>
          <h2 className="font-serif text-3xl text-gray-700 dark:text-gray-100 mb-6">
            From wearable data to clinical insight
          </h2>

          <div className="space-y-6">
            {[
              {
                step: "01",
                title: "Patient List",
                desc: "Flagged hormonal anomalies and risk indicators, sorted for clinical review.",
              },
              {
                step: "02",
                title: "Ovulation Pattern Timeline",
                desc: "Per-patient cycle tracking from objective heart rate, temperature, and hormone readings.",
              },
              {
                step: "03",
                title: "Explainability Panel",
                desc: "Which signals — heart rate, temperature, LH, estrogen — drove each prediction.",
              },
            ].map((s) => (
              <div key={s.step} className="flex gap-4">
                <span className="font-serif text-2xl text-rose-300 flex-shrink-0">
                  {s.step}
                </span>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-200 mb-1">
                    {s.title}
                  </p>
                  <p className="text-sm text-gray-400">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Phone mockup */}
        <div className="flex justify-center">
          <div className="relative w-[280px] h-[580px] bg-gray-900 rounded-[2.5rem] p-3 shadow-2xl">
            {/* notch */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-5 bg-gray-900 rounded-b-xl z-10" />
            <div className="w-full h-full bg-[#FEFCFB] rounded-[2rem] overflow-hidden flex flex-col">
              {/* mini navbar */}
              <div className="flex items-center gap-2 px-4 pt-8 pb-3 border-b border-gray-100">
                <span className="w-5 h-5 rounded-full bg-rose-400 flex items-center justify-center text-white text-[10px] font-serif">
                  F
                </span>
                <span className="font-serif text-sm text-gray-700">
                  FemBalance
                </span>
              </div>

              {/* mini content */}
              <div className="flex-1 p-4 space-y-3 overflow-hidden">
                <p className="text-[10px] font-medium text-rose-600 bg-rose-100 inline-block px-2 py-0.5 rounded-full mb-1">
                  PATIENT LIST
                </p>

                {[
                  {
                    id: "P001",
                    sub: "22 yrs · underserved",
                    risk: "High",
                    dots: 3,
                  },
                  {
                    id: "P002",
                    sub: "28 yrs · general",
                    risk: "Medium",
                    dots: 2,
                  },
                  {
                    id: "P003",
                    sub: "31 yrs · underserved",
                    risk: "Low",
                    dots: 0,
                  },
                ].map((p) => (
                  <div
                    key={p.id}
                    className="flex justify-between items-center p-3 border border-gray-100 rounded-xl bg-white"
                  >
                    <div>
                      <p className="text-xs font-medium text-gray-700">
                        {p.id}
                      </p>
                      <p className="text-[10px] text-gray-400">{p.sub}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="flex gap-0.5">
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full ${
                              i < p.dots
                                ? i === 0
                                  ? "bg-rose-700"
                                  : "bg-rose-300"
                                : "border border-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span
                        className={`text-[9px] font-medium border rounded-full px-2 py-0.5 ${
                          p.risk === "High"
                            ? "border-rose-500 text-rose-600"
                            : p.risk === "Medium"
                              ? "border-amber-400 text-amber-600"
                              : "border-sky-400 text-sky-600"
                        }`}
                      >
                        {p.risk}
                      </span>
                    </div>
                  </div>
                ))}

                <div className="pt-2 border-t border-gray-100 mt-3">
                  <p className="text-[10px] font-medium text-rose-600 bg-rose-100 inline-block px-2 py-0.5 rounded-full mb-2">
                    EXPLAINABILITY
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {["HR", "BBT", "LH", "E2"].map((sig, i) => (
                      <div
                        key={sig}
                        className="flex flex-col items-center gap-1"
                      >
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            [
                              "bg-rose-700",
                              "bg-rose-300",
                              "bg-amber-300",
                              "border border-sky-300",
                            ][i]
                          }`}
                        />
                        <span className="text-[8px] text-gray-400">{sig}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
