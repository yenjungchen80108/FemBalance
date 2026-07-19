import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import fs from "fs";
import path from "path";
import { connectDB } from "../lib/db";
import { Patient, Reading, Prediction } from "../lib/models";

async function seedReal() {
  await connectDB();
  await Promise.all([
    Patient.deleteMany({}),
    Reading.deleteMany({}),
    Prediction.deleteMany({}),
  ]);

  const patientsPath = path.join(__dirname, "../data/patients_export.json");
  const readingsPath = path.join(__dirname, "../data/readings_export.json");

  let patients = JSON.parse(fs.readFileSync(patientsPath, "utf-8"));
  let readings = JSON.parse(fs.readFileSync(readingsPath, "utf-8"));

  // 只保留 dataset2 的病患
  patients = patients.filter((p: any) => p.participantId.startsWith("ds2_"));
  readings = readings.filter((r: any) => r.participantId.startsWith("ds2_"));

  await Patient.insertMany(patients);
  await Reading.insertMany(readings);

  console.log(
    `✅ 已匯入 ${patients.length} 位病人（僅 dataset2), ${readings.length} 筆生理紀錄`,
  );
  process.exit(0);
}

seedReal();
