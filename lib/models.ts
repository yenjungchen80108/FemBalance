import mongoose, { Schema } from "mongoose";

const PatientSchema = new Schema({
  participantId: { type: String, required: true, unique: true },
  age: Number,
  cohort: String, // 'underserved' / 'general'
  createdAt: { type: Date, default: Date.now },
});

// Daily objective instrument readings (wearable device + urine hormone test)
const ReadingSchema = new Schema({
  participantId: { type: String, required: true, index: true },
  dayInStudy: { type: Number, required: true },
  heartRate: Number, // wearable device
  skinTemp: Number, // wearable device (BBT)
  lh: Number, // urine hormone test
  estrogen: Number, // urine hormone test
});

// Model prediction output
const PredictionSchema = new Schema({
  participantId: { type: String, required: true, index: true },
  dayInStudy: { type: Number, required: true },
  anovulationFlag: { type: Boolean, required: true },
  confidence: Number,
  cycleRegularityScore: Number, // statistically computed, not model-predicted; shown for reference
  topFeatures: [{ name: String, level: String }], // level: 'high'|'medium'|'low'|'minimal'
  flagged: { type: Boolean, default: false }, // composite anomaly flag (e.g. repeated suspected anovulation)
});

PredictionSchema.index({ participantId: 1, dayInStudy: 1 });
PredictionSchema.index({ flagged: 1 });

export const Patient =
  mongoose.models.Patient || mongoose.model("Patient", PatientSchema);
export const Reading =
  mongoose.models.Reading || mongoose.model("Reading", ReadingSchema);
export const Prediction =
  mongoose.models.Prediction || mongoose.model("Prediction", PredictionSchema);
