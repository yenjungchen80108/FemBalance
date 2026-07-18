import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">FemBalance</h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Predicting hormonal phases from everyday wearable data — built for
          equitable women&apos;s health.
        </p>
        <Link
          href="/dashboard"
          className="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-purple-700 transition"
        >
          View Patient Dashboard
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-24 grid md:grid-cols-3 gap-6">
        <div className="p-6 border rounded-xl bg-white">
          <h3 className="font-semibold text-lg mb-2">
            Wearable Signal Tracking
          </h3>
          <p className="text-gray-600 text-sm">
            Passive heart rate, skin temperature, and sleep data collected from
            everyday wearables — no manual logging required.
          </p>
        </div>
        <div className="p-6 border rounded-xl bg-white">
          <h3 className="font-semibold text-lg mb-2">
            Explainable Phase Prediction
          </h3>
          <p className="text-gray-600 text-sm">
            A reproducible, interpretable model predicts hormonal phase with a
            transparent confidence score — not a black box.
          </p>
        </div>
        <div className="p-6 border rounded-xl bg-white">
          <h3 className="font-semibold text-lg mb-2">Clinician Dashboard</h3>
          <p className="text-gray-600 text-sm">
            Designed for physicians to review patient trends and flagged
            anomalies at a glance.
          </p>
        </div>
      </div>
    </main>
  );
}
