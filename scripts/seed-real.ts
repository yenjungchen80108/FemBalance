import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import fs from "fs";
import path from "path";
import { connectDB } from "../lib/db";
import { Patient, Reading, Prediction } from "../lib/models";

async function seedReal() {
  await connectDB();

  // 清掉舊的 mock 資料，準備換成真實資料
  await Promise.all([
    Patient.deleteMany({}),
    Reading.deleteMany({}),
    Prediction.deleteMany({}),
  ]);

  // 讀取 Python 輸出的 JSON 檔案
  const patientsPath = path.join(__dirname, "../data/patients_export.json");
  const readingsPath = path.join(__dirname, "../data/readings_export.json");

  const patients = JSON.parse(fs.readFileSync(patientsPath, "utf-8"));
  const readings = JSON.parse(fs.readFileSync(readingsPath, "utf-8"));

  // 這一步就是「符合 schema」實際發生的地方：
  // Mongoose 會照 PatientSchema / ReadingSchema 的欄位定義去驗證並寫入
  await Patient.insertMany(patients);
  await Reading.insertMany(readings);

  console.log(
    `✅ 已匯入 MongoDB: ${patients.length} 位病人, ${readings.length} 筆生理紀錄`,
  );
  console.log(`⚠️ Prediction collection 目前是空的，等模型訓練完再匯入`);
  process.exit(0);
}

seedReal();
