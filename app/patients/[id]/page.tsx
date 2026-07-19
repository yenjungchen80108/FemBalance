"use client";
import { useEffect, useState, use, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";
import Link from "next/link";

function generateClinicalSummary(point: any): string {
  if (point.confidence == null) {
    return "This patient's data comes from real wearable recordings without labeled outcomes. No model prediction is available — we choose not to guess without sufficient evidence.";
  }

  const confidencePct = Math.round(point.confidence * 100);
  const status = point.anovulationFlag
    ? "suspected anovulation"
    : "an ovulatory pattern";
  const confidenceLevel =
    confidencePct >= 70
      ? "with reasonably high confidence"
      : confidencePct >= 50
        ? "with moderate confidence"
        : "with limited confidence, reflecting the model's honesty about uncertainty";

  const topSignal = point.topFeatures?.find((f: any) => f.level === "high");
  const signalPhrase = topSignal
    ? ` This judgment was driven primarily by ${topSignal.name}, `
    : " ";

  const flagPhrase = point.flagged
    ? "This patient has shown a pattern of repeated suspected anovulation across recent records, warranting clinical attention."
    : "No recurring risk pattern has been detected in this patient's recent records.";

  return `On Day ${point.day}, the model detected ${status} ${confidenceLevel} (${confidencePct}%).${signalPhrase}a signal consistent with known physiological markers of ovulatory function. ${flagPhrase}`;
}

const influenceStyles: Record<string, { dot: string; label: string }> = {
  high: { dot: "bg-rose-700", label: "High Influence" },
  medium: { dot: "bg-rose-300", label: "Medium Influence" },
  low: { dot: "bg-amber-300", label: "Low Influence" },
  minimal: {
    dot: "border border-sky-300 bg-white",
    label: "Minimal Influence",
  },
};

const WINDOW_SIZE = 30;

// 自訂資料點，讓每個點可以被點擊
function ClickableDot(props: any) {
  const { cx, cy, payload, onDotClick } = props;
  if (cx == null || cy == null) return null;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={3}
      fill="#C08497"
      stroke="#fff"
      strokeWidth={1}
      style={{ cursor: "pointer" }}
      onClick={() => onDotClick(payload.day)}
    />
  );
}

export default function PatientDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [timeline, setTimeline] = useState<any>(null);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [windowStart, setWindowStart] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetch(`/api/patients/${id}/timeline`)
      .then((res) => res.json())
      .then(setTimeline);
    fetch(`/api/patients/${id}/prediction`)
      .then((res) => res.json())
      .then(setPredictions);
  }, [id]);

  useEffect(() => {
    if (!timeline) return;
    setWindowStart(0);
  }, [timeline]);

  useEffect(() => {
    if (!timeline) return;
    const total = timeline.readings.length;
    const maxStart = Math.max(0, total - WINDOW_SIZE);

    if (isPlaying) {
      playRef.current = setInterval(() => {
        setWindowStart((prev) => {
          if (prev >= maxStart) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 400);
    }
    return () => {
      if (playRef.current) clearInterval(playRef.current);
    };
  }, [isPlaying, timeline]);

  if (!timeline)
    return (
      <main className="min-h-screen bg-[#FEFCFB] p-4 md:p-10">
        <div className="max-w-4xl mx-auto animate-pulse">
          <div className="h-4 w-24 bg-gray-100 rounded mb-4" />
          <div className="h-10 w-48 bg-gray-200 rounded mb-8" />
          <div className="h-80 bg-gray-100 rounded-2xl mb-10" />
        </div>
      </main>
    );

  // 不再插入斷層 null，資料點之間永遠連續畫線
  const chartData = timeline.readings.map((r: any) => {
    const pred = predictions.find((p: any) => p.dayInStudy === r.dayInStudy);
    return {
      day: r.dayInStudy,
      skinTemp: r.skinTemp,
      lh: r.lh,
      anovulationFlag: pred?.anovulationFlag ?? false,
      confidence: pred?.confidence ?? null,
      cycleRegularityScore: pred?.cycleRegularityScore ?? null,
      flagged: pred?.flagged ?? false,
      topFeatures: pred?.topFeatures ?? [],
    };
  });

  const totalDays = chartData.length;
  const maxStart = Math.max(0, totalDays - WINDOW_SIZE);
  const windowEnd = Math.min(totalDays - 1, windowStart + WINDOW_SIZE - 1);

  const cursorPoint = chartData[windowEnd];

  const stepWindow = (delta: number) => {
    setIsPlaying(false);
    setWindowStart((prev) => Math.min(maxStart, Math.max(0, prev + delta)));
  };

  // 點擊圖上任一資料點，直接把窗口終點移到那一天
  const handleDotClick = (clickedDay: number) => {
    setIsPlaying(false);
    const idx = chartData.findIndex((d: any) => d.day === clickedDay);
    if (idx === -1) return;
    const newStart = Math.min(maxStart, Math.max(0, idx - WINDOW_SIZE + 1));
    setWindowStart(newStart);
  };

  const areaX1 = chartData[windowStart]?.day;
  const areaX2 = chartData[windowEnd]?.day;

  return (
    <main className="min-h-screen bg-[#FEFCFB] p-4 md:p-10">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/dashboard"
          className="inline-block text-sm text-gray-400 hover:text-rose-600 mb-4 transition"
        >
          ← Back to Overview
        </Link>

        <span className="inline-block text-xs font-medium text-rose-600 bg-rose-100 px-3 py-1 rounded-full mb-3 ml-3">
          PATIENT RECORD
        </span>
        <h1 className="font-serif text-4xl text-gray-700 mb-1">Patient {id}</h1>
        <p className="text-sm text-gray-400 mb-8">
          {totalDays} days recorded · highlighted window: Day {areaX1}–{areaX2}
          <span className="text-gray-300">
            {" "}
            · click any point on the chart to jump there
          </span>
        </p>

        <div className="w-full mb-6 bg-white border border-gray-200 rounded-2xl p-4">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 20, bottom: 20, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis
                dataKey="day"
                stroke="#9CA3AF"
                label={{
                  value: "Day in Study",
                  position: "insideBottom",
                  offset: -10,
                }}
              />
              <YAxis stroke="#9CA3AF" />
              <Tooltip labelFormatter={(v) => `Day ${v}`} />

              {areaX1 != null && areaX2 != null && (
                <ReferenceArea
                  x1={areaX1}
                  x2={areaX2}
                  fill="#C08497"
                  fillOpacity={0.12}
                  stroke="none"
                />
              )}

              <Line
                type="monotone"
                dataKey="skinTemp"
                stroke="#9CB89A"
                name="Skin Temp (BBT)"
                strokeWidth={2}
                dot={<ClickableDot onDotClick={handleDotClick} />}
                activeDot={{ r: 5 }}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="lh"
                stroke="#D4A574"
                name="LH"
                strokeWidth={2}
                dot={<ClickableDot onDotClick={handleDotClick} />}
                activeDot={{ r: 5 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-center gap-3 mb-3">
          <button
            onClick={() => stepWindow(-1)}
            disabled={windowStart <= 0}
            className="w-9 h-9 rounded-full border border-gray-200 text-gray-500 hover:border-rose-300 disabled:opacity-30 transition flex items-center justify-center"
          >
            ◀
          </button>
          <button
            onClick={() => {
              if (windowStart >= maxStart) setWindowStart(0);
              setIsPlaying((p) => !p);
            }}
            className="px-5 py-2 rounded-full bg-rose-400 text-white text-sm font-medium hover:bg-rose-600 transition"
          >
            {isPlaying ? "⏸ Pause" : "▶ Play"}
          </button>
          <button
            onClick={() => stepWindow(1)}
            disabled={windowStart >= maxStart}
            className="w-9 h-9 rounded-full border border-gray-200 text-gray-500 hover:border-rose-300 disabled:opacity-30 transition flex items-center justify-center"
          >
            ▶
          </button>
        </div>

        <div className="mb-10 px-2">
          <input
            type="range"
            min={0}
            max={maxStart}
            value={windowStart}
            onChange={(e) => {
              setIsPlaying(false);
              setWindowStart(Number(e.target.value));
            }}
            className="w-full accent-rose-400"
          />
          <p className="text-center text-xs text-gray-400 mt-1">
            Window: Day {areaX1} – Day {areaX2} of {totalDays}
          </p>
        </div>

        {cursorPoint && (
          <div className="p-6 border border-gray-200 rounded-2xl bg-white mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="inline-block text-xs font-medium text-rose-600 bg-rose-100 px-3 py-1 rounded-full mb-2">
                  DAY SNAPSHOT
                </span>
                <h2 className="font-serif text-xl text-gray-700">
                  Day {cursorPoint.day} —{" "}
                  {cursorPoint.anovulationFlag
                    ? "Suspected Anovulation"
                    : "Ovulatory"}
                </h2>
              </div>
              {cursorPoint.flagged && (
                <span className="text-xs font-medium text-rose-600 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">
                  ⚠ Flagged
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="text-center">
                <p className="font-serif text-2xl text-gray-700">
                  {cursorPoint.confidence
                    ? `${(cursorPoint.confidence * 100).toFixed(0)}%`
                    : "–"}
                </p>
                <p className="text-xs text-gray-400">Confidence</p>
              </div>
              <div className="text-center">
                <p className="font-serif text-2xl text-gray-700">
                  {cursorPoint.cycleRegularityScore != null
                    ? cursorPoint.cycleRegularityScore
                    : "–"}
                </p>
                <p className="text-xs text-gray-400">Cycle Regularity Score</p>
              </div>
            </div>

            {cursorPoint.topFeatures?.length > 0 && (
              <>
                <p className="text-xs text-gray-400 mb-2">
                  Which signals drove this prediction:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {cursorPoint.topFeatures.map((f: any, i: number) => (
                    <div
                      key={i}
                      className="flex flex-col items-center gap-1.5 p-2 border border-gray-100 rounded-xl"
                    >
                      <span
                        className={`w-3.5 h-3.5 rounded-full ${influenceStyles[f.level].dot}`}
                      />
                      <p className="text-xs text-gray-600 text-center">
                        {f.name}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-500 mb-2">
                Clinical Summary
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {generateClinicalSummary(cursorPoint)}
              </p>
            </div>

            <p className="text-xs text-gray-400 mt-4 pt-4 border-t border-gray-100">
              This is a pattern-based flag from objective wearable and
              hormone-test data, not a diagnosis. Recommend clinical evaluation.
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-4 text-xs text-gray-400">
          {Object.entries(influenceStyles).map(([key, s]) => (
            <div key={key} className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${s.dot}`} />
              {s.label}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
