import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    team: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    stage: {
        type: String,
        enum: ["initial stage", "in progress"],
        required: true
    },
    date: { type: Date, required: true },
    priority: {
        type: String,
        enum: ["high", "medium", "normal", "low"],
        required: true
    },
    assets: [{ type: String }],
    activities: [{
        type: { type: String },
        activity: { type: String },
        by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        timestamp: { type: Date, default: Date.now },
    }],
}, { timestamps: true });

export default mongoose.model("Task", taskSchema);