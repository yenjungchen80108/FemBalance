import { connectDB } from "@/lib/db";
import { Patient, Prediction } from "@/lib/models";
import { NextResponse } from "next/server";

export const revalidate = 30; // cache this route's response for 30 seconds

export async function GET() {
  await connectDB();

  const [totalPatients, patients, riskAgg, cohortAgg, regularityAgg, ageAgg] =
    await Promise.all([
      Patient.countDocuments(),
      Patient.find({}, { participantId: 1, cohort: 1, age: 1 }).lean(),

      // Risk distribution: count flagged patients directly in the database
      Prediction.aggregate([
        { $match: { flagged: true } },
        { $group: { _id: "$participantId" } },
        { $count: "flaggedCount" },
      ]),

      // Cohort comparison: join Patient's cohort into Prediction, then group and average
      Prediction.aggregate([
        {
          $lookup: {
            from: "patients",
            localField: "participantId",
            foreignField: "participantId",
            as: "patient",
          },
        },
        { $unwind: "$patient" },
        {
          $group: {
            _id: "$patient.cohort",
            anovulationRate: { $avg: { $cond: ["$anovulationFlag", 1, 0] } },
            patientCount: { $addToSet: "$participantId" },
          },
        },
        {
          $project: {
            cohort: "$_id",
            anovulationRate: {
              $round: [{ $multiply: ["$anovulationRate", 100] }, 0],
            },
            patientCount: { $size: "$patientCount" },
          },
        },
      ]),

      // Cycle regularity trend: group by dayInStudy and average
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

      // Age distribution can stay in JS since patient count is small (30 records), not a bottleneck
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
  const underservedCount = patients.filter(
    (p) => p.cohort === "underserved",
  ).length;

  const riskCounts = {
    High: flaggedCount,
    Medium: underservedCount - Math.min(flaggedCount, underservedCount),
    Low: totalPatients - underservedCount,
  };

  const ageLabels = ["18-24", "25-30", "31-36", "37+"];
  const ageDistribution = ageAgg.map((bucket: any, i: number) => ({
    label: ageLabels[i] || "other",
    count: bucket.count,
  }));

  return NextResponse.json({
    riskCounts,
    cohortStats: cohortAgg,
    regularityTrend: regularityAgg,
    ageDistribution,
    totalPatients,
  });
}
