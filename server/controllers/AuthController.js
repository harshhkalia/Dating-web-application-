import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/Users.js";

export const createAccount = async (req, res) => {
  const { number, email, password } = req.body;
  try {
    const existingEmail = await userModel.findOne({
      email,
    });
    if (existingEmail) {
      res.status(500).json({
        message: "Email already in use, please enter a different one!",
      });
      return;
    }

    const existingPhone = await userModel.findOne({
      phoneNumber: number,
    });
    if (existingPhone) {
      res.status(500).json({
        message: "Number already in use, please enter a different one!",
      });
      return;
    }

    const newUser = new userModel({
      phoneNumber: number,
      email: email,
      password: password,
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1hr",
    });

    res.status(201).json({
      message: "User created successfully!",
      userId: newUser._id,
      token,
    });
  } catch (error) {
    console.error("Failed to create the account:", error);
    res
      .status(500)
      .json({ message: "Failed to create the account, please try again" });
  }
};

export const completeAccount = async (req, res) => {
  const {
    userName,
    firstName,
    lastName,
    age,
    location,
    interests,
    bio,
    gender,
  } = req.body;
  try {
    const userId = req.query.id;

    const checkedUsername = userName.trim();
    const usernameRegex = /^[a-zA-Z_]+$/;

    if (!usernameRegex.test(checkedUsername)) {
      res
        .status(500)
        .json({ message: "Username only contain alphabets and underscores!!" });
      return;
    }

    const existingUsername = await userModel.findOne({
      username: checkedUsername,
    });
    if (existingUsername) {
      res.status(500).json({
        message: "This username is not available, please use another one",
      });
      return;
    }
    if (age < 18) {
      res
        .status(500)
        .json({ message: "Your age should be more then 18 to continue" });
      return;
    }
    const updateData = await userModel.findByIdAndUpdate(
      userId,
      {
        username: userName,
        firstname: firstName,
        lastname: lastName,
        age: age,
        location: location,
        interests: interests,
        bio: bio,
        gender: gender,
      },
      { new: true }
    );
    res.status(200).json({
      message: "Account has been setup completely, now you can login!",
      data: updateData,
    });
  } catch (error) {
    console.error("Failed to complete the account:", error);
    res.status(500).json({
      message: "Failed to complete the account, please add details again",
    });
  }
};

export const loginUser = async (req, res) => {
  const { loginData, loginPass } = req.body;
  try {
    let user = await userModel.findOne({
      $or: [{ email: loginData }, { phoneNumber: loginData }],
    });

    if (!user) {
      console.log(`User not found for loginData: ${loginData}`);
      return res
        .status(404)
        .json({ message: "User not found, please recheck the detail" });
    }

    const isPassValid = await bcrypt.compare(loginPass, user.password);

    if (!isPassValid) {
      return res
        .status(401)
        .json({ message: "Invalid password, please enter a correct one!!" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1hr",
    });

    res
      .status(200)
      .json({ message: "Login successful!", userId: user._id, token });
  } catch (error) {
    console.error("Failed to login user:", error);
    res
      .status(500)
      .json({ message: "Failed to login user, please try again!!" });
  }
};

export const cancelCreation = async (req, res) => {
  const id = req.query.id;
  try {
    const deleteData = await userModel.findByIdAndDelete({ _id: id });
    if (deleteData) {
      res.status(200).json({ message: "Account creation cancelled!!" });
    }
  } catch (error) {
    console.error(
      "Failed to submit cancel request for account creation:",
      error
    );
    res.status(500).json({
      message:
        "Failed to submit cancel request for account creation, please try again",
    });
  }
};

export const getData = async (req, res) => {
  const id = req.params.id;
  try {
    const fetchedData = await userModel.findById(id);
    if (fetchedData) {
      res.status(200).json(fetchedData);
    }
  } catch (error) {
    console.error("Failed to fetch the data of user:", error);
    res.status(500).json({ message: "Failed to fetch the data of user!" });
  }
};
