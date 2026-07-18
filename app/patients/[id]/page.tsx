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

const influenceStyles: Record<string, { dot: string; label: string }> = {
  high: { dot: "bg-rose-700", label: "High Influence" },
  medium: { dot: "bg-rose-300", label: "Medium Influence" },
  low: { dot: "bg-amber-300", label: "Low Influence" },
  minimal: {
    dot: "border border-sky-300 bg-white",
    label: "Minimal Influence",
  },
};

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
      <main className="min-h-screen bg-[#FEFCFB] dark:bg-gray-950 p-4 md:p-10">
        <div className="max-w-4xl mx-auto animate-pulse">
          <div className="h-4 w-24 bg-gray-100 dark:bg-gray-800 rounded mb-4" />
          <div className="h-6 w-20 bg-gray-100 dark:bg-gray-800 rounded-full mb-3" />
          <div className="h-10 w-48 bg-gray-200 dark:bg-gray-800 rounded mb-8" />
          <div className="h-72 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-10" />
          <div className="h-8 w-56 bg-gray-200 dark:bg-gray-800 rounded mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-24 bg-gray-100 dark:bg-gray-800 rounded-2xl"
              />
            ))}
          </div>
        </div>
      </main>
    );

  const chartData = timeline.readings.map((r: any) => ({
    day: r.dayInStudy,
    heartRate: r.heartRate,
    skinTemp: r.skinTemp,
    lh: r.lh,
  }));

  const selectedPrediction = predictions.find(
    (p) => p.dayInStudy === selectedDay,
  );
  const latestRegularity =
    predictions[predictions.length - 1]?.cycleRegularityScore;

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
        <h1 className="font-serif text-4xl text-gray-700 dark:text-gray-100 mb-2">
          Patient {id}
        </h1>
        {latestRegularity !== undefined && (
          <p className="text-sm text-gray-400 mb-8">
            Cycle Regularity Score:{" "}
            <span
              className={
                latestRegularity > 4
                  ? "text-rose-600 font-medium"
                  : "text-gray-600"
              }
            >
              {latestRegularity.toFixed(1)} day variability
            </span>
          </p>
        )}

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
                name="Skin Temp (BBT)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="lh"
                stroke="#D4A574"
                name="LH"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <h2 className="font-serif text-2xl text-gray-700 dark:text-gray-100 mb-4">
          Ovulation Pattern Tracking
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
              } ${selectedDay === p.dayInStudy ? "ring-2 ring-rose-400" : "hover:border-rose-300"}`}
            >
              <p className="font-medium text-gray-700 dark:text-gray-200">
                Day {p.dayInStudy}
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                {p.anovulationFlag ? "Suspected Anovulation" : "Ovulatory"}
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
              EXPLAINABILITY PANEL
            </span>
            <h2 className="font-serif text-xl text-gray-700 dark:text-gray-100 mb-1">
              Which signals drove this prediction — Day{" "}
              {selectedPrediction.dayInStudy}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              {selectedPrediction.anovulationFlag
                ? "Suspected anovulation"
                : "Ovulatory pattern"}{" "}
              predicted with {(selectedPrediction.confidence * 100).toFixed(0)}%
              confidence — based on objective wearable and hormone-test readings
              only.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
              {selectedPrediction.topFeatures?.map((f: any, i: number) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-2 p-3 border border-gray-100 dark:border-gray-800 rounded-xl"
                >
                  <span
                    className={`w-4 h-4 rounded-full ${influenceStyles[f.level].dot}`}
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                    {f.name}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-800">
              {Object.entries(influenceStyles).map(([key, s]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${s.dot}`} />
                  {s.label}
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-400 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              This is a pattern-based flag from objective wearable and
              hormone-test data, not a diagnosis. Recommend clinical evaluation.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
