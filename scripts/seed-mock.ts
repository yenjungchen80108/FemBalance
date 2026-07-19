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
      // 每人實際追蹤天數不同，模擬真實資料集不完整、參與時長不一的狀況
      totalDays: Math.floor(randomBetween(40, 95)),
    };
  });

  await Patient.insertMany(mockPatients.map(({ totalDays, ...p }) => p));

  const highRiskIds = new Set(
    mockPatients.filter(() => Math.random() < 0.2).map((p) => p.participantId),
  );

  for (const patient of mockPatients) {
    const readings = [];
    const predictions = [];
    const isHighRisk = highRiskIds.has(patient.participantId);
    // 讓 regularity score 隨時間緩慢漂移，而不是每天純隨機，這樣拖曳滑桿時才看得出「趨勢」
    let regularityDrift = isHighRisk
      ? randomBetween(3, 5)
      : randomBetween(1, 2);

    for (let day = 1; day <= patient.totalDays; day++) {
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

      regularityDrift += randomBetween(-0.3, 0.3);
      regularityDrift = Math.max(0.3, Math.min(8, regularityDrift));

      const anovulationFlag = isHighRisk
        ? Math.random() > 0.4
        : Math.random() > 0.85;

      predictions.push({
        participantId: patient.participantId,
        dayInStudy: day,
        anovulationFlag,
        confidence: randomBetween(0.65, 0.95),
        cycleRegularityScore: +regularityDrift.toFixed(1),
        topFeatures: [
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

  console.log(
    `✅ Mock data seeded: ${PATIENT_COUNT} patients, variable-length records (40–95 days)`,
  );
  process.exit(0);
}

seedMock();
