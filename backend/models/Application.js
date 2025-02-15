const mongoose = require("mongoose");

const timelineSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    enum: ["submit", "verify", "review", "reject", "calendar"],
    required: true,
  },
  comment: {
    type: String,
    default: "",
  },
});

const applicationSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    university: {
      type: String,
      required: true,
    },
    program: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "Pending",
        "Under Review",
        "Accepted",
        "Rejected",
        "Documents Pending",
        "Interview Scheduled",
      ],
      default: "Pending",
    },
    progress: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 0,
    },
    submittedDate: {
      type: String,
      required: true,
    },
    lastUpdated: {
      type: String,
      required: true,
    },
    timeline: [timelineSchema],
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    agentNotes: [
      {
        note: String,
        date: String,
        agent: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Application", applicationSchema);
