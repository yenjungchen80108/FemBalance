import { connectDB } from "@/lib/db";
import { Prediction } from "@/lib/models";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  await connectDB();
  const predictions = await Prediction.find({ participantId: params.id })
    .sort({ dayInStudy: 1 })
    .lean();
  return NextResponse.json(predictions);
}
