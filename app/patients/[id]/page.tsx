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

  if (!timeline) return <div className="p-8">Loading...</div>;

  const chartData = timeline.readings.map((r: any) => ({
    day: r.dayInStudy,
    heartRate: r.heartRate,
    skinTemp: r.skinTemp,
  }));

  const selectedPrediction = predictions.find(
    (p) => p.dayInStudy === selectedDay,
  );

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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
        {predictions.slice(0, 8).map((p, i) => (
          <button
            key={i}
            onClick={() => setSelectedDay(p.dayInStudy)}
            className={`p-3 rounded border text-sm text-left transition ${
              p.flagged ? "border-red-400 bg-red-50" : "border-gray-200"
            } ${selectedDay === p.dayInStudy ? "ring-2 ring-purple-500" : ""}`}
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
          </button>
        ))}
      </div>

      {selectedPrediction && (
        <div className="p-5 border rounded-xl bg-purple-50">
          <h2 className="text-lg font-semibold mb-1">
            Why this prediction? — Day {selectedPrediction.dayInStudy}
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Predicted{" "}
            <span className="font-medium">
              {selectedPrediction.predictedPhase}
            </span>{" "}
            with {(selectedPrediction.confidence * 100).toFixed(0)}% confidence,
            based on the following signals:
          </p>
          <div className="space-y-2">
            {selectedPrediction.topFeatures?.map((f: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{f.name}</span>
                  <span className="text-gray-500">
                    {(f.importance * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: `${f.importance * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
