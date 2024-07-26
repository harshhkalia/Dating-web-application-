import MessageModel from "../models/Messages.js";
import userModel from "../models/Users.js";
import bcrypt from "bcrypt";

export const uploadProfilePic = async (req, res) => {
  const userId = req.params.id;
  const profilePic = req.file.path;
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    user.profilePic = profilePic;
    await user.save();

    res
      .status(200)
      .json({ message: "The pic has been uploaded successfully!" });
  } catch (error) {
    console.error("Failed to upload the profile picture:", error);
    res.status(500).json({
      message: "Failed to upload the profile picture, please try again!",
    });
  }
};

export const deletProfilePic = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await userModel.findByIdAndUpdate(
      userId,
      { $unset: { profilePic: 1 } },
      { new: true }
    );

    if (!user) {
      res.status(404).json({ message: "User not found with profile pic" });
    }

    res.status(200).json({
      message: "The profile pic has been deleted successfully!",
      user,
    });
  } catch (error) {
    console.error("Failed to delete the profile pic:", error);
    res.status(500).json({ message: "Failed to delete the profile pic" });
  }
};

export const updateUserProfile = async (req, res) => {
  const id = req.params.id;
  try {
    const updateData = req.body;
    if (updateData == null) {
      return;
    }

    const updatedUser = await userModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "The data has been updated successfully!",
      updateData: updatedUser,
    });
  } catch (error) {
    console.error("Failed to update the data:", error);
    res
      .status(500)
      .json({ message: "Failed to update the data, please try again" });
  }
};

export const updateuserPFP = async (req, res) => {
  const id = req.params.id;
  const profilePic = req.file.path;
  try {
    const updateUser = await userModel.findByIdAndUpdate(
      id,
      {
        profilePic: profilePic,
      },
      { new: true }
    );
    await updateUser.save();

    res.status(200).json({
      message: "Your PFP has been changed successfully!",
      updateUser: updateUser,
    });
  } catch (error) {
    console.error("Failed to update the PFP:", error);
    res
      .status(500)
      .json({ message: "Failed to update the PFP, please try again" });
  }
};

export const changePassword = async (req, res) => {
  const id = req.params.id;
  const { password, newPassword } = req.body;
  try {
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(404).json({
        message: "Incorrect password entered, please enter a correct one",
      });
    }

    user.password = newPassword;
    await user.save();

    return res
      .status(200)
      .json({ message: "The password has been changed successfully!" });
  } catch (error) {
    console.error("Failed to change the password:", error);
    res
      .status(500)
      .json({ message: "Failed to change the password, please try again" });
  }
};

export const logoutUser = async (req, res) => {
  const id = req.params.id;
  const { logoutPassword } = req.body;
  try {
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const correctPassword = await bcrypt.compare(logoutPassword, user.password);
    if (!correctPassword) {
      return res.status(500).json({
        message:
          "Incorrect password entered, please check password and enter again",
      });
    }

    return res.status(200).json({ message: "Log-Out successfully!" });
  } catch (error) {
    console.error("Failed to logout the user:", error);
    return res
      .status(500)
      .json({ message: "Failed to log-out, please try again" });
  }
};

export const deleteAccount = async (req, res) => {
  const id = req.params.id;
  const { deletePass } = req.body;
  try {
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const correctPassword = await bcrypt.compare(deletePass, user.password);
    if (!correctPassword) {
      return res
        .status(500)
        .json({ message: "Password is incorrect. Please enter a correct one" });
    }

    const deleteData = await userModel.deleteOne({ _id: id });
    if (deleteData) {
      return res
        .status(200)
        .json({ message: "The account has been deleted successfully!" });
    }
  } catch (error) {
    console.error("Failed to delete the account:", error);
    return res
      .status(500)
      .json({ message: "Failed to delete the account, please try again" });
  }
};

export const getAllUsersExceptMe = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const sentMessages = await MessageModel.find({
      $or: [{ sender: userId }, { receiver: userId }],
    }).select("sender receiver");

    const excludeUserIds = new Set(
      sentMessages.flatMap((message) => [
        message.sender.toString(),
        message.receiver.toString(),
      ])
    );

    excludeUserIds.delete(userId);

    const excludeUserIdsArray = Array.from(excludeUserIds);

    const users = await userModel.find({
      _id: {
        $nin: [
          userId,
          ...excludeUserIdsArray,
          ...user.notInterested,
          ...user.blocked,
        ],
      },
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error("Failed to get users from database:", error);
    return res.status(500).json({ message: "Failed to get the users" });
  }
};

export const markUserAsNotInterested = async (req, res) => {
  const id = req.params.id;
  const { notInterestedUserId } = req.body;
  try {
    const markUser = await userModel.updateOne(
      { _id: id },
      { $addToSet: { notInterested: notInterestedUserId } }
    );
    if (!markUser) {
      return res
        .status(404)
        .json({ message: "Unable to mark user as not interested" });
    }
    return res
      .status(200)
      .json({ message: "The user has been marked as not interested" });
  } catch (error) {
    console.error("Failed to mark user as not interested:", error);
    return res
      .status(500)
      .json({ message: "Failed to mark user as not interested" });
  }
};

export const getUserByUsername = async (req, res) => {
  const { userId } = req.params;
  const { searchUser } = req.body;
  try {
    const myAcc = await userModel.findOne({ _id: userId });
    if (!myAcc) {
      return res.status(404).json({ message: "User not found" });
    }

    const users = await userModel.find({
      username: searchUser,
      _id: { $ne: myAcc._id, $nin: myAcc.blocked || [] },
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error("Failed to get user by username:", error);
    return res.status(500).json({ message: "Failed to get user by username" });
  }
};

export const getBlockedUsers = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await userModel
      .findById(userId)
      .populate("blocked", "username profilePic bio");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user.blocked);
  } catch (error) {
    console.error("Failed to get users blocked by this person:", error);
    return res
      .status(500)
      .json({ message: "Failed to get the users blocked by this user" });
  }
};

export const unblockuser = async (req, res) => {
  const { userId, blockedId } = req.params;
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    user.blocked = user.blocked.filter((id) => id.toString() !== blockedId);

    const updateUser = await user.save();
    if (updateUser) {
      return res.status(200).json({
        message: "The user has been unblocked successfully!",
        updateUser,
      });
    } else {
      return res.status(500).json({ message: "Failed to unblock the user" });
    }
  } catch (error) {
    console.error("Failed to unblock the user:", error);
    return res.status(500).json({ message: "Failed to unblock the user!!" });
  }
};

export const fetchUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await userModel.findById(userId);
    return res.status(200).json(user);
  } catch (error) {
    console.error("Failed to fetch the users:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch the user, please try again!!" });
  }
};
