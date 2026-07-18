import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { connectDB } from "../lib/db";
import { Patient, Reading, HormoneLog, Prediction } from "../lib/models";

const PHASES = ["menstruation", "late-follicular", "ovulation", "luteal"];

function randomBetween(min: number, max: number) {
  return +(Math.random() * (max - min) + min).toFixed(1);
}

async function seedMock() {
  await connectDB();

  // 清掉舊的假資料，避免重複跑造成髒資料
  await Promise.all([
    Patient.deleteMany({}),
    Reading.deleteMany({}),
    HormoneLog.deleteMany({}),
    Prediction.deleteMany({}),
  ]);

  const mockPatients = ["P001", "P002", "P003", "P004", "P005"].map(
    (id, i) => ({
      participantId: id,
      ageRange: ["18-24", "25-34", "25-34", "35-44", "18-24"][i],
      cohort: i % 2 === 0 ? "underserved" : "general",
    }),
  );

  await Patient.insertMany(mockPatients);

  for (const patient of mockPatients) {
    const readings = [];
    const hormoneLogs = [];
    const predictions = [];

    for (let day = 1; day <= 30; day++) {
      readings.push({
        participantId: patient.participantId,
        dayInStudy: day,
        heartRate: randomBetween(60, 90),
        skinTemp: randomBetween(36.0, 37.3),
        sleepScore: randomBetween(50, 95),
        glucoseAvg: randomBetween(80, 110),
        stressScore: randomBetween(10, 60),
      });

      const phase = PHASES[Math.floor((day % 28) / 7)];
      hormoneLogs.push({
        participantId: patient.participantId,
        dayInStudy: day,
        lh: randomBetween(1, 20),
        e3g: randomBetween(10, 150),
        pdg: randomBetween(1, 10),
        symptoms: day % 7 === 0 ? ["cramps", "fatigue"] : [],
        reportedPhase: phase,
      });

      predictions.push({
        participantId: patient.participantId,
        dayInStudy: day,
        predictedPhase: phase,
        confidence: randomBetween(0.7, 0.98),
        topFeatures: [
          { name: "skinTemp", importance: randomBetween(0.2, 0.5) },
          { name: "heartRate", importance: randomBetween(0.1, 0.3) },
        ],
        flagged: day === 15 && patient.participantId === "P002", // 故意標一筆異常給 demo 用
      });
    }

    await Reading.insertMany(readings);
    await HormoneLog.insertMany(hormoneLogs);
    await Prediction.insertMany(predictions);
  }

  console.log("✅ Mock 資料建立完成：5 位病人 × 30 天");
  process.exit(0);
}

seedMock();
