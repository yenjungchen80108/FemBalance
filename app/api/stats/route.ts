import { connectDB } from "@/lib/db";
import { Patient, Reading, Prediction } from "@/lib/models";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  const totalPatients = await Patient.countDocuments();
  const totalReadings = await Reading.countDocuments();

  const allPredictions = await Prediction.find().lean();
  const anovulationCount = allPredictions.filter(
    (p) => p.anovulationFlag,
  ).length;
  const flaggedCount = new Set(
    allPredictions.filter((p) => p.flagged).map((p) => p.participantId),
  ).size;

  const avgConfidence =
    allPredictions.reduce((sum, p) => sum + (p.confidence || 0), 0) /
    (allPredictions.length || 1);

  return NextResponse.json({
    totalPatients,
    totalReadings,
    anovulationRate: allPredictions.length
      ? Math.round((anovulationCount / allPredictions.length) * 100)
      : 0,
    flaggedPatients: flaggedCount,
    avgConfidence: Math.round(avgConfidence * 100),
  });
}
