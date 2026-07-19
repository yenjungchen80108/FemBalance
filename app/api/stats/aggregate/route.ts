import { connectDB } from "@/lib/db";
import { Patient, Prediction } from "@/lib/models";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  const patients = await Patient.find().lean();
  const allPredictions = await Prediction.find().lean();

  // 風險等級分布
  const riskCounts = { High: 0, Medium: 0, Low: 0 };
  const flaggedIds = new Set(
    allPredictions.filter((p) => p.flagged).map((p) => p.participantId),
  );
  for (const p of patients) {
    if (flaggedIds.has(p.participantId)) riskCounts.High++;
    else if (p.cohort === "underserved") riskCounts.Medium++;
    else riskCounts.Low++;
  }

  // Cohort 對比：各組無排卵比例
  const cohorts = ["underserved", "general"];
  const cohortStats = cohorts.map((cohort) => {
    const ids = patients
      .filter((p) => p.cohort === cohort)
      .map((p) => p.participantId);
    const preds = allPredictions.filter((p) => ids.includes(p.participantId));
    const anovulationRate = preds.length
      ? Math.round(
          (preds.filter((p) => p.anovulationFlag).length / preds.length) * 100,
        )
      : 0;
    return { cohort, anovulationRate, patientCount: ids.length };
  });

  // 週期規律度趨勢（依 dayInStudy 分組取平均)
  const dayGroups: Record<number, number[]> = {};
  for (const p of allPredictions) {
    if (!dayGroups[p.dayInStudy]) dayGroups[p.dayInStudy] = [];
    dayGroups[p.dayInStudy].push(p.cycleRegularityScore || 0);
  }
  const regularityTrend = Object.entries(dayGroups)
    .map(([day, scores]) => ({
      day: Number(day),
      avgRegularity: +(
        scores.reduce((a, b) => a + b, 0) / scores.length
      ).toFixed(2),
    }))
    .sort((a, b) => a.day - b.day);

  // 年齡層分布
  const ageBuckets = [
    { label: "18-24", min: 18, max: 24 },
    { label: "25-30", min: 25, max: 30 },
    { label: "31-36", min: 31, max: 36 },
    { label: "37+", min: 37, max: 200 },
  ];
  const ageDistribution = ageBuckets.map((bucket) => ({
    label: bucket.label,
    count: patients.filter((p) => p.age >= bucket.min && p.age <= bucket.max)
      .length,
  }));

  return NextResponse.json({
    riskCounts,
    cohortStats,
    regularityTrend,
    ageDistribution,
    totalPatients: patients.length,
  });
}
