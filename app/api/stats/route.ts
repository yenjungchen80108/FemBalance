import { connectDB } from "@/lib/db";
import { Patient, Reading, Prediction } from "@/lib/models";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  const totalPatients = await Patient.countDocuments();
  const underservedCount = await Patient.countDocuments({
    cohort: "underserved",
  });

  const allPredictions = await Prediction.find().lean();
  const anovulationCount = allPredictions.filter(
    (p) => p.anovulationFlag,
  ).length;
  const avgConfidence =
    allPredictions.reduce((sum, p) => sum + (p.confidence || 0), 0) /
    (allPredictions.length || 1);

  const avgRegularity =
    allPredictions.reduce((sum, p) => sum + (p.cycleRegularityScore || 0), 0) /
    (allPredictions.length || 1);

  const totalReadings = await Reading.countDocuments();

  return NextResponse.json({
    totalPatients,
    underservedCount,
    underservedPct: totalPatients
      ? Math.round((underservedCount / totalPatients) * 100)
      : 0,
    totalReadings,
    anovulationRate: allPredictions.length
      ? Math.round((anovulationCount / allPredictions.length) * 100)
      : 0,
    avgConfidence: Math.round(avgConfidence * 100),
    avgRegularity: avgRegularity.toFixed(1),
  });
}
