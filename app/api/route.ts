import { connectDB } from "@/lib/db";
import { Patient, Prediction } from "@/lib/models";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const patients = await Patient.find().lean();
  const flagged = await Prediction.find({ flagged: true }).lean();
  const flaggedIds = new Set(flagged.map((f) => f.participantId));
  return NextResponse.json(
    patients.map((p) => ({ ...p, isFlagged: flaggedIds.has(p.participantId) })),
  );
}
