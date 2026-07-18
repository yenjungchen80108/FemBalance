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
    <main className="p-4 md:p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">FemBalance — Patient Overview</h1>
      <div className="space-y-2">
        {patients.map((p) => (
          <Link
            key={p.participantId}
            href={`/patients/${p.participantId}`}
            className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50"
          >
            <div>
              <p className="font-medium">{p.participantId}</p>
              <p className="text-sm text-gray-500">
                {p.ageRange} · {p.cohort}
              </p>
            </div>
            {p.isFlagged && (
              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                Needs Attention
              </span>
            )}
          </Link>
        ))}
      </div>
    </main>
  );
}
