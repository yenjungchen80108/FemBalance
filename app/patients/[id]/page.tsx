"use client";
import { useEffect, useState, use } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";

export default function PatientDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [timeline, setTimeline] = useState<any>(null);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/patients/${id}/timeline`)
      .then((res) => res.json())
      .then(setTimeline);
    fetch(`/api/patients/${id}/prediction`)
      .then((res) => res.json())
      .then((data) => {
        setPredictions(data);
        if (data.length > 0) setSelectedDay(data[0].dayInStudy);
      });
  }, [id]);

  if (!timeline)
    return (
      <div className="min-h-screen bg-[#FEFCFB] dark:bg-gray-950 p-8 text-gray-400">
        Loading...
      </div>
    );

  const chartData = timeline.readings.map((r: any) => ({
    day: r.dayInStudy,
    heartRate: r.heartRate,
    skinTemp: r.skinTemp,
  }));

  const selectedPrediction = predictions.find(
    (p) => p.dayInStudy === selectedDay,
  );

  return (
    <main className="min-h-screen bg-[#FEFCFB] dark:bg-gray-950 p-4 md:p-10">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/dashboard"
          className="inline-block text-sm text-gray-400 hover:text-rose-600 mb-4 transition"
        >
          ← Back to Overview
        </Link>

        <span className="inline-block text-xs font-medium text-rose-600 bg-rose-100 dark:bg-rose-900/30 dark:text-rose-300 px-3 py-1 rounded-full mb-3">
          PATIENT RECORD
        </span>
        <h1 className="font-serif text-4xl text-gray-700 dark:text-gray-100 mb-8">
          Patient {id}
        </h1>

        <div className="w-full h-72 mb-10 min-w-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
          <ResponsiveContainer width="100%" height="100%" minWidth={300}>
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 20, bottom: 20, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis
                dataKey="day"
                label={{
                  value: "Day in Study",
                  position: "insideBottom",
                  offset: -10,
                }}
                stroke="#9CA3AF"
              />
              <YAxis stroke="#9CA3AF" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="heartRate"
                stroke="#C08497"
                name="Heart Rate"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="skinTemp"
                stroke="#9CB89A"
                name="Skin Temp"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <h2 className="font-serif text-2xl text-gray-700 dark:text-gray-100 mb-4">
          Predicted Hormonal Phase
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {predictions.slice(0, 8).map((p, i) => (
            <button
              key={i}
              onClick={() => setSelectedDay(p.dayInStudy)}
              className={`p-4 rounded-2xl border text-sm text-left transition bg-white dark:bg-gray-900 ${
                p.flagged
                  ? "border-rose-300 bg-rose-50 dark:bg-rose-900/10"
                  : "border-gray-200 dark:border-gray-800"
              } ${
                selectedDay === p.dayInStudy
                  ? "ring-2 ring-rose-400"
                  : "hover:border-rose-300"
              }`}
            >
              <p className="font-medium text-gray-700 dark:text-gray-200">
                Day {p.dayInStudy}
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                {p.predictedPhase}
              </p>
              <p className="text-xs text-gray-400">
                Confidence {(p.confidence * 100).toFixed(0)}%
              </p>
              {p.flagged && (
                <span className="text-xs text-rose-600 font-medium">
                  ⚠ Flagged
                </span>
              )}
            </button>
          ))}
        </div>

        {selectedPrediction && (
          <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900">
            <span className="inline-block text-xs font-medium text-rose-600 bg-rose-100 dark:bg-rose-900/30 dark:text-rose-300 px-3 py-1 rounded-full mb-3">
              EXPLAINABILITY
            </span>
            <h2 className="font-serif text-xl text-gray-700 dark:text-gray-100 mb-1">
              Why this prediction? — Day {selectedPrediction.dayInStudy}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              Predicted{" "}
              <span className="font-medium text-gray-700 dark:text-gray-200">
                {selectedPrediction.predictedPhase}
              </span>{" "}
              with {(selectedPrediction.confidence * 100).toFixed(0)}%
              confidence, based on the following signals:
            </p>
            <div className="space-y-3">
              {selectedPrediction.topFeatures?.map((f: any, i: number) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-300">
                      {f.name}
                    </span>
                    <span className="text-gray-400">
                      {(f.importance * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-rose-400 h-2 rounded-full transition-all"
                      style={{ width: `${f.importance * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
