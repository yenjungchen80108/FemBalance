import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { connectDB } from "../lib/db";
import { Patient, Reading, Prediction } from "../lib/models";

function randomBetween(min: number, max: number) {
  return +(Math.random() * (max - min) + min).toFixed(1);
}

function getInfluenceLevel(): "high" | "medium" | "low" | "minimal" {
  const levels: ("high" | "medium" | "low" | "minimal")[] = [
    "high",
    "medium",
    "low",
    "minimal",
  ];
  return levels[Math.floor(Math.random() * levels.length)];
}

const PATIENT_COUNT = 30;

async function seedMock() {
  await connectDB();

  await Promise.all([
    Patient.deleteMany({}),
    Reading.deleteMany({}),
    Prediction.deleteMany({}),
  ]);

  const mockPatients = Array.from({ length: PATIENT_COUNT }, (_, i) => {
    const num = String(i + 1).padStart(3, "0");
    return {
      participantId: `P${num}`,
      age: Math.floor(randomBetween(18, 45)),
      cohort: Math.random() > 0.5 ? "underserved" : "general",
    };
  });

  await Patient.insertMany(mockPatients);

  // 隨機挑 20% 病人設計成「高風險型」，反覆出現疑似無排卵，方便 demo 篩選/排序功能
  const highRiskIds = new Set(
    mockPatients.filter(() => Math.random() < 0.2).map((p) => p.participantId),
  );

  for (const patient of mockPatients) {
    const readings = [];
    const predictions = [];
    const isHighRisk = highRiskIds.has(patient.participantId);

    for (let day = 1; day <= 30; day++) {
      const cyclePos = day % 28;
      const isOvulationWindow = cyclePos >= 12 && cyclePos <= 16;

      readings.push({
        participantId: patient.participantId,
        dayInStudy: day,
        heartRate: randomBetween(60, 90),
        skinTemp:
          isOvulationWindow && !isHighRisk
            ? randomBetween(36.6, 37.3)
            : randomBetween(36.0, 36.5),
        lh:
          isOvulationWindow && !isHighRisk
            ? randomBetween(15, 40)
            : randomBetween(1, 10),
        estrogen: randomBetween(20, 150),
      });

      const anovulationFlag = isHighRisk
        ? Math.random() > 0.4
        : Math.random() > 0.85;

      predictions.push({
        participantId: patient.participantId,
        dayInStudy: day,
        anovulationFlag,
        confidence: randomBetween(0.65, 0.95),
        cycleRegularityScore: isHighRisk
          ? randomBetween(4.5, 8.0)
          : randomBetween(0.5, 2.5),
        topFeatures: [
          { name: "Heart Rate", level: getInfluenceLevel() },
          { name: "Skin Temp (BBT)", level: getInfluenceLevel() },
          { name: "LH", level: getInfluenceLevel() },
          { name: "Estrogen", level: getInfluenceLevel() },
        ],
        flagged: isHighRisk && day % 10 === 5,
      });
    }

    await Reading.insertMany(readings);
    await Prediction.insertMany(predictions);
  }

  console.log(`✅ Mock data seeded: ${PATIENT_COUNT} patients × 30 days`);
  process.exit(0);
}

seedMock();
