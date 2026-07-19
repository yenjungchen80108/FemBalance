import { connectDB } from "@/lib/db";
import { Patient, Prediction } from "@/lib/models";
import { NextResponse } from "next/server";

export const revalidate = 30;

// 訓練時算出的真實係數（來自 train_and_export.py 的輸出）
const FEATURE_IMPORTANCE = [
  { feature: "LH", coefficient: -1.061 },
  { feature: "Estrogen", coefficient: -0.285 },
  { feature: "Skin Temp (BBT)", coefficient: -0.082 },
  { feature: "Age", coefficient: -0.022 },
];

export async function GET() {
  await connectDB();

  const [totalPatients, riskAgg, regularityAgg, ageAgg] = await Promise.all([
    Patient.countDocuments(),

    Prediction.aggregate([
      { $match: { flagged: true } },
      { $group: { _id: "$participantId" } },
      { $count: "flaggedCount" },
    ]),

    Prediction.aggregate([
      {
        $group: {
          _id: "$dayInStudy",
          avgRegularity: { $avg: "$cycleRegularityScore" },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          day: "$_id",
          avgRegularity: { $round: ["$avgRegularity", 2] },
          _id: 0,
        },
      },
    ]),

    Patient.aggregate([
      {
        $bucket: {
          groupBy: "$age",
          boundaries: [18, 25, 31, 37, 200],
          default: "other",
          output: { count: { $sum: 1 } },
        },
      },
    ]),
  ]);

  const flaggedCount = riskAgg[0]?.flaggedCount || 0;

  const riskCounts = {
    High: flaggedCount,
    Medium: 0, // 由前端用 confidence 門檻再細分，這裡先給高層級輪廓
    Low: totalPatients - flaggedCount,
  };

  const ageLabels = ["18-24", "25-30", "31-36", "37+"];
  const ageDistribution = ageAgg.map((bucket: any, i: number) => ({
    label: ageLabels[i] || "other",
    count: bucket.count,
  }));

  return NextResponse.json({
    riskCounts,
    featureImportance: FEATURE_IMPORTANCE,
    regularityTrend: regularityAgg,
    ageDistribution,
    totalPatients,
  });
}
