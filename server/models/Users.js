import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      sparse: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
    },
    bio: {
      type: String,
    },
    location: {
      type: String,
    },
    interests: {
      type: String,
    },
    photos: {
      type: [String],
    },
    profilePic: {
      type: String,
    },
    notInterested: [
      { type: mongoose.Schema.Types.ObjectId, ref: "user_accounts" },
    ],
    blocked: [{ type: mongoose.Schema.Types.ObjectId, ref: "user_accounts" }],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const userModel = mongoose.model("user_accounts", userSchema);
export default userModel;
