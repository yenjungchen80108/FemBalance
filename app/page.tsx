"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Patient = {
  participantId: string;
  age: number;
  cohort: string;
  isFlagged: boolean;
};

function getRiskLevel(
  isFlagged: boolean,
  cohort: string,
): "High" | "Medium" | "Low" {
  if (isFlagged) return "High";
  if (cohort === "underserved") return "Medium";
  return "Low";
}

const riskStyles = {
  High: "border-rose-500 text-rose-600",
  Medium: "border-amber-400 text-amber-600",
  Low: "border-sky-400 text-sky-600",
};

function AnomalyDots({ risk }: { risk: "High" | "Medium" | "Low" }) {
  const filled = risk === "High" ? 3 : risk === "Medium" ? 2 : 0;
  return (
    <div className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`w-2.5 h-2.5 rounded-full ${
            i < filled
              ? i === 0
                ? "bg-rose-700"
                : "bg-rose-300"
              : "border border-gray-300 bg-white"
          }`}
        />
      ))}
    </div>
  );
}

function PatientCardSkeleton() {
  return (
    <div className="flex justify-between items-center p-5 border border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900 animate-pulse">
      <div className="space-y-2">
        <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-3 w-28 bg-gray-100 dark:bg-gray-800 rounded" />
      </div>
      <div className="h-6 w-16 bg-gray-100 dark:bg-gray-800 rounded-full" />
    </div>
  );
}

export default function Dashboard() {
  const [patients, setPatients] = useState<Patient[] | null>(null);

  useEffect(() => {
    fetch("/api/patients")
      .then((res) => res.json())
      .then(setPatients);
  }, []);

  return (
    <main className="min-h-screen bg-[#FEFCFB] dark:bg-gray-950 p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        <span className="inline-block text-xs font-medium text-rose-600 bg-rose-100 dark:bg-rose-900/30 dark:text-rose-300 px-3 py-1 rounded-full mb-3">
          CLINICIAN DASHBOARD
        </span>
        <h1 className="font-serif text-4xl text-gray-700 dark:text-gray-100 mb-1">
          Patient List
        </h1>
        <p className="text-sm text-gray-400 mb-8">
          Flagged hormonal anomalies, risk indicators
        </p>

        <div className="space-y-3">
          {patients === null
            ? Array.from({ length: 5 }).map((_, i) => (
                <PatientCardSkeleton key={i} />
              ))
            : patients.map((p, i) => {
                const risk = getRiskLevel(p.isFlagged, p.cohort);
                return (
                  <Link
                    key={p.participantId}
                    href={`/patients/${p.participantId}`}
                    style={{ animationDelay: `${i * 60}ms` }}
                    className="flex justify-between items-center p-5 border border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900 hover:border-rose-300 hover:shadow-sm transition animate-[fadeIn_0.4s_ease-out_backwards]"
                  >
                    <div>
                      <p className="font-medium text-gray-700 dark:text-gray-200">
                        {p.participantId}
                      </p>
                      <p className="text-sm text-gray-400">
                        {p.age} yrs · {p.cohort}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <AnomalyDots risk={risk} />
                      <span
                        className={`text-xs font-medium border rounded-full px-3 py-1 ${riskStyles[risk]}`}
                      >
                        {risk}
                      </span>
                    </div>
                  </Link>
                );
              })}
        </div>

        <div className="mt-6 flex gap-6 text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-700" /> Severe
            Anomaly
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-300" /> Mild
            Anomaly
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full border border-gray-300 bg-white" />{" "}
            No Anomaly
          </div>
        </div>
      </div>
    </main>
  );
}
