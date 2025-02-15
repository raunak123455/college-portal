import mongoose from "mongoose";

const scholarshipSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  university: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ["Merit-based", "Need-based", "Research", "Athletic", "Other"],
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["Open", "Closed", "In Review"],
    default: "Open",
  },
  requirements: {
    gpa: String,
    major: [String],
    residency: String,
    level: String,
  },
  description: String,
  featured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const ScholarshipApplication = new mongoose.Schema({
  scholarship: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Scholarship",
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: [
      "Draft",
      "Submitted",
      "In Review",
      "Documents Pending",
      "Accepted",
      "Rejected",
    ],
    default: "Draft",
  },
  progress: {
    type: Number,
    default: 0,
  },
  applicationDate: {
    type: Date,
    default: Date.now,
  },
  documents: [
    {
      name: String,
      status: {
        type: String,
        enum: ["Pending", "Submitted", "In Progress", "Rejected"],
        default: "Pending",
      },
      url: String,
    },
  ],
  nextStep: String,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Scholarship = mongoose.model("Scholarship", scholarshipSchema);
export const Application = mongoose.model(
  "ScholarshipApplication",
  ScholarshipApplication
);
