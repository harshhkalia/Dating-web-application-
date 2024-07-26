import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  ActivityType: { type: String, required: true },
  description: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const UserActivity = mongoose.model("activities", ActivitySchema);
export default UserActivity;
