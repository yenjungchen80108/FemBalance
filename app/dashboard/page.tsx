"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Patient = {
  participantId: string;
  ageRange: string;
  cohort: string;
  isFlagged: boolean;
};

export default function Dashboard() {
  const [patients, setPatients] = useState<Patient[]>([]);

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
        <h1 className="font-serif text-4xl text-gray-700 dark:text-gray-100 mb-8">
          Patient Overview
        </h1>
        <div className="space-y-3">
          {patients.map((p) => (
            <Link
              key={p.participantId}
              href={`/patients/${p.participantId}`}
              className="flex justify-between items-center p-5 border border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900 hover:border-rose-300 transition"
            >
              <div>
                <p className="font-medium text-gray-700 dark:text-gray-200">
                  {p.participantId}
                </p>
                <p className="text-sm text-gray-400">
                  {p.ageRange} · {p.cohort}
                </p>
              </div>
              {p.isFlagged && (
                <span className="text-xs font-medium text-rose-600 bg-rose-100 dark:bg-rose-900/30 dark:text-rose-300 px-3 py-1 rounded-full">
                  Needs Attention
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
