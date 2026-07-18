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

export default function PatientDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [timeline, setTimeline] = useState<any>(null);
  const [predictions, setPredictions] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/patients/${id}/timeline`)
      .then((res) => res.json())
      .then(setTimeline);
    fetch(`/api/patients/${id}/prediction`)
      .then((res) => res.json())
      .then(setPredictions);
  }, [id]);

  if (!timeline) return <div className="p-8">Loading...</div>;

  const chartData = timeline.readings.map((r: any) => ({
    day: r.dayInStudy,
    heartRate: r.heartRate,
    skinTemp: r.skinTemp,
  }));

  return (
    <main className="p-4 md:p-8 w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Patient {id}</h1>

      <div className="w-full h-72 mb-8 min-w-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={300}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, bottom: 20, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              label={{
                value: "Day in Study",
                position: "insideBottom",
                offset: -10,
              }}
            />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="heartRate"
              stroke="#8884d8"
              name="Heart Rate"
            />
            <Line
              type="monotone"
              dataKey="skinTemp"
              stroke="#82ca9d"
              name="Skin Temp"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <h2 className="text-lg font-semibold mb-3">Predicted Hormonal Phase</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {predictions.slice(0, 8).map((p, i) => (
          <div
            key={i}
            className={`p-3 rounded border text-sm ${p.flagged ? "border-red-400 bg-red-50" : "border-gray-200"}`}
          >
            <p className="font-medium">Day {p.dayInStudy}</p>
            <p>{p.predictedPhase}</p>
            <p className="text-xs text-gray-500">
              Confidence {(p.confidence * 100).toFixed(0)}%
            </p>
            {p.flagged && (
              <span className="text-xs text-red-600 font-medium">
                ⚠ Flagged
              </span>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
