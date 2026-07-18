import mongoose, { Schema } from "mongoose";

const PatientSchema = new Schema({
  participantId: { type: String, required: true, unique: true },
  age: Number,
  cohort: String, // 'underserved' / 'general'
  createdAt: { type: Date, default: Date.now },
});

// 每日客觀儀器量測（穿戴裝置 + 驗尿機器）
const ReadingSchema = new Schema({
  participantId: { type: String, required: true, index: true },
  dayInStudy: { type: Number, required: true },
  heartRate: Number, // 穿戴裝置
  skinTemp: Number, // 穿戴裝置（BBT）
  lh: Number, // 驗尿機器
  estrogen: Number, // 驗尿機器
});

// 模型預測結果
const PredictionSchema = new Schema({
  participantId: { type: String, required: true, index: true },
  dayInStudy: { type: Number, required: true },
  anovulationFlag: { type: Boolean, required: true },
  confidence: Number,
  cycleRegularityScore: Number, // 統計計算，非模型預測，附加顯示用
  topFeatures: [{ name: String, level: String }], // level: 'high'|'medium'|'low'|'minimal'
  flagged: { type: Boolean, default: false }, // 综合異常提示（例如連續多次疑似無排卵）
});

export const Patient =
  mongoose.models.Patient || mongoose.model("Patient", PatientSchema);
export const Reading =
  mongoose.models.Reading || mongoose.model("Reading", ReadingSchema);
export const Prediction =
  mongoose.models.Prediction || mongoose.model("Prediction", PredictionSchema);
