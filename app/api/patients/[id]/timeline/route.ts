import { connectDB } from "@/lib/db";
import { Reading, HormoneLog } from "@/lib/models";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  await connectDB();
  const readings = await Reading.find({ participantId: params.id })
    .sort({ dayInStudy: 1 })
    .lean();
  const hormones = await HormoneLog.find({ participantId: params.id })
    .sort({ dayInStudy: 1 })
    .lean();
  return NextResponse.json({ readings, hormones });
}
