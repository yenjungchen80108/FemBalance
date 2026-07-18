import mongoose, { Schema } from "mongoose";

const PatientSchema = new Schema({
  participantId: { type: String, required: true, unique: true },
  ageRange: String,
  cohort: String,
  createdAt: { type: Date, default: Date.now },
});

const ReadingSchema = new Schema({
  participantId: { type: String, required: true, index: true },
  dayInStudy: { type: Number, required: true },
  heartRate: Number,
  skinTemp: Number,
  sleepScore: Number,
  glucoseAvg: Number,
  stressScore: Number,
});

const HormoneLogSchema = new Schema({
  participantId: { type: String, required: true, index: true },
  dayInStudy: { type: Number, required: true },
  lh: Number,
  e3g: Number,
  pdg: Number,
  symptoms: [String],
  reportedPhase: String,
});

const PredictionSchema = new Schema({
  participantId: { type: String, required: true, index: true },
  dayInStudy: { type: Number, required: true },
  predictedPhase: String,
  confidence: Number,
  topFeatures: [{ name: String, importance: Number }],
  flagged: { type: Boolean, default: false },
});

export const Patient =
  mongoose.models.Patient || mongoose.model("Patient", PatientSchema);
export const Reading =
  mongoose.models.Reading || mongoose.model("Reading", ReadingSchema);
export const HormoneLog =
  mongoose.models.HormoneLog || mongoose.model("HormoneLog", HormoneLogSchema);
export const Prediction =
  mongoose.models.Prediction || mongoose.model("Prediction", PredictionSchema);
