import { connectDB } from "@/lib/db";
import { Prediction } from "@/lib/models";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await connectDB();
  const predictions = await Prediction.find({ participantId: id })
    .sort({ dayInStudy: 1 })
    .lean();
  return NextResponse.json(predictions);
}
