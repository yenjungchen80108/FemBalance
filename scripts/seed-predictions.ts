import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import fs from "fs";
import path from "path";
import { connectDB } from "../lib/db";
import { Prediction } from "../lib/models";

async function seedPredictions() {
  await connectDB();
  await Prediction.deleteMany({});

  const predictionsPath = path.join(
    __dirname,
    "../data/predictions_export.json",
  );
  const predictions = JSON.parse(fs.readFileSync(predictionsPath, "utf-8"));

  // 補上 flagged 欄位：用連續多天疑似無排卵當作綜合風險標記
  // 這裡先用簡單規則：如果這位病患過去記錄中 anovulationFlag=true 的比例超過整體平均，標記為 flagged
  const byPatient: Record<string, any[]> = {};
  for (const p of predictions) {
    if (!byPatient[p.participantId]) byPatient[p.participantId] = [];
    byPatient[p.participantId].push(p);
  }

  const enriched = predictions.map((p: any) => {
    const patientRecords = byPatient[p.participantId];
    const rate =
      patientRecords.filter((r) => r.anovulationFlag).length /
      patientRecords.length;
    return { ...p, flagged: rate > 0.7 }; // 門檻可依實際分布調整
  });

  await Prediction.insertMany(enriched);
  console.log(`✅ 已匯入 ${enriched.length} 筆 Prediction`);
  process.exit(0);
}

seedPredictions();
