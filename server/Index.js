import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import {
  createAccount,
  completeAccount,
  loginUser,
  cancelCreation,
  getData,
} from "./controllers/AuthController.js";
import multer from "multer";
import {
  changePassword,
  deleteAccount,
  deletProfilePic,
  fetchUser,
  getAllUsersExceptMe,
  getBlockedUsers,
  getUserByUsername,
  logoutUser,
  markUserAsNotInterested,
  unblockuser,
  updateuserPFP,
  updateUserProfile,
  uploadProfilePic,
} from "./controllers/Profile.js";
import { fileURLToPath } from "url";
import {
  blockuser,
  cancelMessage,
  checkForMessage,
  confirmMessage,
  deleteallchats,
  deleteOneMessage,
  editOneMessage,
  fetchMessages,
  fetchReceiverusername,
  fetchsenderusername,
  findmessage,
  getMessages,
  getUserDetail,
  markmymsgasunread,
  messageDetails,
  newMessage,
  SaveMessage,
  senderusername,
  updatestatus,
} from "./controllers/Message.js";

dotenv.config();

const PORT = process.env.PORT;
const mongodb_URL = process.env.mongodb_URL;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());

app.use("/uploadPFP", express.static(path.join(__dirname, "uploadPFP")));

if (!mongodb_URL) {
  console.error("Database URL is not defined. Please fix this error first");
  process.exit(1);
}

mongoose
  .connect(mongodb_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected successfully!");
  })
  .catch((err) => {
    console.error("Unable to connect to database.", err);
  });

// user account API Module
app.post("/api/createAccount", createAccount);
app.put("/api/completeAccount", completeAccount);
app.post("/api/login", loginUser);
app.delete("/api/cancelCreation", cancelCreation);
app.get("/api/getUser/:id", getData);

// profile picture upload module
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploadPFP/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploadPFP = multer({ storage });

app.post(
  "/api/uploadProfilePic/:id",
  uploadPFP.single("profilePic"),
  uploadProfilePic
);

// delete profile pic API
app.delete("/api/deleteProfilePic/:id", deletProfilePic);

// update user API
app.put("/api/updateUserProfile/:id", updateUserProfile);

// update PFP API
app.put(
  "/api/updateUserPFP/:id",
  uploadPFP.single("profilePic"),
  updateuserPFP
);

// change account password
app.put("/api/changePassword/:id", changePassword);

// logout the user
app.post("/api/logoutUser/:id", logoutUser);

// delete the user
app.post("/api/deleteUser/:id", deleteAccount);

// get all the users
app.get("/api/getAllUsers/:userId", getAllUsersExceptMe);

// mark user as not interested
app.post("/api/notInterestedUsers/:id", markUserAsNotInterested);

// get user by username API
app.post("/api/searchUser/:userId", getUserByUsername);

// save message from user
app.post("/api/sendMessage/:id", SaveMessage);

// get user information
app.get("/api/userInfo/:id", getUserDetail);

// cancel message request
app.delete("/api/cancelMessage/:id", cancelMessage);

// save the message
app.patch("/api/confirmMessage/:id", confirmMessage);

// fetch sender username
app.get("/api/fetchSenderUsername/:id", senderusername);

// fetch message details
app.get("/api/fetchMessagedetails/:id", messageDetails);

// check for already existing messages
app.get("/api/messageSent/:userId/:recieverId", checkForMessage);

// get messages between users
app.get("/api/getAllMessages/:userId/:otherUserId", getMessages);

// get username of sender
app.get("/api/senderUsername/:id", fetchsenderusername);

// get details of receiver
app.get("/api/receiverdetails/:id", fetchReceiverusername);

// save new message from user
app.post("/api/saveNewMessage/:userId/:receiverId", newMessage);

// mark message as read API
app.put("/api/markAsRead/:id", updatestatus);

// mark message as unread
app.put("/api/markAsUnread/:id", markmymsgasunread);

// find a message API
app.get("/api/findmessage/:id", findmessage);

// delete all chats in one click API
app.delete("/api/deleteallchats/:senderId/:receiverId", deleteallchats);

// add user to block API
app.put("/api/blockuser/:userId/:otherUserId", blockuser);

// get blocked user from backend API
app.get("/api/getblockedusers/:id", getBlockedUsers);

// unblock user API
app.put("/api/unblockuser/:userId/:blockedId", unblockuser);

// delete one message API
app.delete("/api/deleteOneMessage/:id", deleteOneMessage);

// edit one message API
app.put("/api/editOneMessage/:id", editOneMessage);

// get messages based on search API
app.get("/api/fetchMessages", fetchMessages);

// get user details of searched input API
app.get("/api/fetchUser/:id", fetchUser);

app.listen(PORT, () => {
  console.log(`Server running on port : ${PORT}`);
});
