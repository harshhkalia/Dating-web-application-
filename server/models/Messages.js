import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user_accounts",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user_accounts",
    required: true,
  },
  reciever_username: {
    type: String,
  },
  reciever_pfp: {
    type: String,
  },
  reciever_firstname: {
    type: String,
  },
  reciever_lastname: {
    type: String,
  },
  sender_username: {
    type: String,
  },
  sender_pfp: {
    type: String,
  },
  sender_firstname: {
    type: String,
  },
  message: { type: String },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ["read", "unread"], default: "unread" },
});

const MessageModel = mongoose.model("messages", MessageSchema);
export default MessageModel;
