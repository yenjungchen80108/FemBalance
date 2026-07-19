import { connectDB } from "@/lib/db";
import { Patient, Prediction } from "@/lib/models";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const patients = await Patient.find().lean();

  // 拿每位病人最新一天的預測結果，當作代表性風險依據
  const allPredictions = await Prediction.find()
    .sort({ dayInStudy: -1 })
    .lean();
  const latestByPatient: Record<string, any> = {};
  for (const p of allPredictions) {
    if (!latestByPatient[p.participantId]) {
      latestByPatient[p.participantId] = p;
    }
  }

  const enriched = patients.map((p) => {
    const latest = latestByPatient[p.participantId];
    return {
      ...p,
      isFlagged: latest?.flagged ?? false,
      confidence: latest?.confidence ?? null,
    };
  });

  return NextResponse.json(enriched);
}
