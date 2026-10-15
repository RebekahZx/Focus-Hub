import mongoose from "mongoose";
import { LIMITS } from "@/lib/session";

const studySessionSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    title: { type: String, required: true, maxlength: LIMITS.title.max },
    subject: { type: String, default: "", maxlength: LIMITS.subject.max },
    focusMin: { type: Number, required: true, min: LIMITS.focusMin.min, max: LIMITS.focusMin.max },
    breakMin: { type: Number, required: true, min: LIMITS.breakMin.min, max: LIMITS.breakMin.max },
    rounds: { type: Number, required: true, min: LIMITS.rounds.min, max: LIMITS.rounds.max },
    startsAt: { type: Date, required: true },
    hostEmail: { type: String, required: true, index: true },
    hostName: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.StudySession || mongoose.model("StudySession", studySessionSchema);
