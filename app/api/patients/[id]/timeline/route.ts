import { connectDB } from "@/lib/db";
import { Reading, HormoneLog } from "@/lib/models";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await connectDB();
  const readings = await Reading.find({ participantId: id })
    .sort({ dayInStudy: 1 })
    .lean();
  const hormones = await HormoneLog.find({ participantId: id })
    .sort({ dayInStudy: 1 })
    .lean();
  return NextResponse.json({ readings, hormones });
}
