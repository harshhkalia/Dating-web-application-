import MessageModel from "../models/Messages.js";
import userModel from "../models/Users.js";

export const SaveMessage = async (req, res) => {
  const senderId = req.params.id;
  const {
    receiverId,
    username,
    profilePic,
    lastname,
    firstname,
    senderUsername,
    senderFirstname,
    senderPfp,
  } = req.body;
  try {
    const theMessage = await MessageModel.create({
      sender: senderId,
      receiver: receiverId,
      reciever_username: username,
      reciever_firstname: firstname,
      reciever_lastname: lastname,
      reciever_pfp: profilePic,
      sender_username: senderUsername,
      sender_firstname: senderFirstname,
      sender_pfp: senderPfp,
    });
    if (!theMessage) {
      return res
        .status(500)
        .json({ message: "Message not saved correctly in database" });
    }
    return res.status(200).json({
      message: "Message saved successfully",
      messageId: theMessage._id,
    });
  } catch (error) {
    console.error("Failed to save the message:", error);
    return res
      .status(500)
      .json({ message: "Failed to save the message, please try again" });
  }
};

export const getUserDetail = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error("Failed to get the details of user:", error);
    return res
      .status(500)
      .json({ message: "Failed to get the detail of user, please try again" });
  }
};

export const cancelMessage = async (req, res) => {
  const messageId = req.params.id;
  try {
    const cancelMsg = await MessageModel.findByIdAndDelete(messageId);
    if (!cancelMsg) {
      return res.status(404).json({ message: "Message not found" });
    }
    return res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Failed to cancel the message:", error);
    return res
      .status(500)
      .json({ message: "Failed to cancel the message, please try again" });
  }
};

export const confirmMessage = async (req, res) => {
  const messageId = req.params.id;
  const { messageText } = req.body;
  try {
    const updatedMessage = await MessageModel.findByIdAndUpdate(
      messageId,
      { message: messageText },
      { new: true }
    );
    if (!updatedMessage) {
      return res.status(404).json({ message: "No message found for updation" });
    }
    return res
      .status(200)
      .json({ message: "Message updated successfully", updatedMessage });
  } catch (error) {
    console.error("Failed to save the message:", error);
    return res
      .status(500)
      .json({ message: "Failed to save the message, please try again" });
  }
};

export const senderusername = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      senderusername: user.username,
      senderprofilepic: user.profilePic,
      senderfirstname: user.firstname,
    });
  } catch (error) {
    console.error("Failed to get username of sender:", error);
    return res
      .status(500)
      .json({ message: "Failed to get the username of sender" });
  }
};

export const messageDetails = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await userModel.findById(userId).populate("blocked", "_id");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const blockedUsersIds = user.blocked.map((blockUser) =>
      blockUser._id.toString()
    );

    let messages = await MessageModel.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate(
        "sender",
        "username firstname lastname profilePic blocked",
        "user_accounts"
      )
      .populate(
        "receiver",
        "username firstname lastname profilePic blocked",
        "user_accounts"
      );

    if (!messages || messages.length === 0) {
      return res
        .status(404)
        .json({ message: "No messages found for this user!!" });
    }

    messages = messages.filter((message) => {
      const senderId = message.sender ? message.sender._id.toString() : null;
      const receiverId = message.receiver
        ? message.receiver._id.toString()
        : null;
      return (
        !blockedUsersIds.includes(senderId) &&
        !blockedUsersIds.includes(receiverId)
      );
    });

    return res.status(200).json(messages);
  } catch (error) {
    console.error("Failed to get the details of messages:", error);
    return res
      .status(500)
      .json({ message: "Failed to get the details of messages" });
  }
};

export const checkForMessage = async (req, res) => {
  const { userId, recieverId } = req.params;
  try {
    const message = await MessageModel.find({
      $or: [
        { sender: userId, receiver: recieverId },
        { sender: recieverId, receiver: userId },
      ],
    });
    return res.status(200).json(message);
  } catch (error) {
    console.error("Failed to check for messages:", error);
    return res.status(500).json({ message: "Failed to check for messages" });
  }
};

export const getMessages = async (req, res) => {
  const { userId, otherUserId } = req.params;
  try {
    const messages = await MessageModel.find({
      $or: [
        {
          sender: userId,
          receiver: otherUserId,
        },
        {
          sender: otherUserId,
          receiver: userId,
        },
      ],
    }).sort({ timestamp: 1 });
    return res.status(200).json(messages);
  } catch (error) {
    console.error("Failed to get the messages:", error);
    return res.status(500).json({ message: "Failed to get the messages" });
  }
};

export const fetchsenderusername = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await userModel
      .findById(userId)
      .select("username firstname lastname profilePic");
    if (!user) {
      return res.status(404).json({ message: "user not found!" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error("Failed to fetch the username of sender:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch username of sender" });
  }
};

export const fetchReceiverusername = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await userModel
      .findById(userId)
      .select("username firstname lastname profilePic");
    if (!user) {
      return res.status(404).json({ message: "user not found!" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error("Failed to fetch the username of sender:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch username of sender" });
  }
};

export const newMessage = async (req, res) => {
  const { userId, receiverId } = req.params;
  const {
    receiver_username,
    receiver_profilePic,
    receiver_firstname,
    receiver_lastname,
    sender_username,
    sender_profilePic,
    sender_firstname,
    sender_lastname,
    message,
  } = req.body;
  try {
    const newMessage = await MessageModel.create({
      sender: userId,
      receiver: receiverId,
      reciever_username: receiver_username,
      reciever_pfp: receiver_profilePic,
      reciever_firstname: receiver_firstname,
      reciever_lastname: receiver_lastname,
      sender_username: sender_username,
      sender_pfp: sender_profilePic,
      sender_firstname: sender_firstname,
      sender_lastname: sender_lastname,
      message,
    });
    if (!newMessage) {
      return res
        .status(404)
        .json({ message: "Failed to create the new message!" });
    }
    return res.status(200).json({
      message: "The message has been saved successfully!",
      newMessage,
    });
  } catch (error) {
    console.error("Failed to save new message:", error);
    return res
      .status(500)
      .json({ message: "Failed to save new message, please try again" });
  }
};

export const updatestatus = async (req, res) => {
  const messageId = req.params.id;
  const { status } = req.body;
  try {
    const updateStatus = await MessageModel.findByIdAndUpdate(
      messageId,
      { status: status },
      { new: true }
    );
    if (!updateStatus) {
      return res.status(404).json({ message: "No message found for updation" });
    }
    return res
      .status(200)
      .json({ message: "Message read by reciever", markasread: updateStatus });
  } catch (error) {
    console.error("Failed to update the status:", error);
    return res.status(500).json({ message: "Failed to update the status!!" });
  }
};

export const markmymsgasunread = async (req, res) => {
  const messageId = req.params.id;
  try {
    const updateMessage = await MessageModel.findByIdAndUpdate(
      messageId,
      { status: "unread" },
      { new: true }
    );
    if (!updateMessage) {
      return res.status(404).json({ message: "No message found for updation" });
    }
    return res.status(200).json({
      message: "Message marked as unread!!",
      markasread: updateMessage,
    });
  } catch (error) {
    console.error("Failed to update the status:", error);
    return res.status(500).json({ message: "Failed to update the status!!" });
  }
};

export const findmessage = async (req, res) => {
  const messageId = req.params.id;
  try {
    const message = await MessageModel.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    return res.status(200).json(message);
  } catch (error) {
    console.error("Failed to find the message:", error);
    return res
      .status(500)
      .json({ message: "Failed to find the message, please try again" });
  }
};

export const deleteallchats = async (req, res) => {
  const { senderId, receiverId } = req.params;
  try {
    const deleteMessages = await MessageModel.deleteMany({
      $or: [
        {
          sender: senderId,
          receiver: receiverId,
        },
        { sender: receiverId, receiver: senderId },
      ],
    });
    if (deleteMessages.deletedCount > 0) {
      return res
        .status(200)
        .json({ message: "All messages deleted successfully!" });
    } else {
      return res.status(404).json({ message: "Failed to delete the messages" });
    }
  } catch (error) {
    console.error("Failed to delete all messages:", error);
    return res.status(500).json({ message: "Failed to delete all messages!!" });
  }
};

export const blockuser = async (req, res) => {
  const { userId, otherUserId } = req.params;
  try {
    const user = await userModel.findById(userId);
    if (user.blocked.includes(otherUserId)) {
      return res.status(400).json({ message: "User is already blocked!!" });
    }

    user.blocked.push(otherUserId);
    const blockUser = await user.save();

    if (blockUser) {
      return res.status(200).json({
        message: "The user has been blocked successfully!",
        blockAccount: blockUser,
      });
    } else {
      return res
        .status(404)
        .json({ message: "Failed to block the selected user" });
    }
  } catch (error) {
    console.error("Failed to block the selected user : ", error);
    return res
      .status(500)
      .json({ message: "Failed to block the selected user, please try again" });
  }
};

export const deleteOneMessage = async (req, res) => {
  const messageId = req.params.id;
  try {
    const deleteMessage = await MessageModel.findByIdAndDelete(messageId);
    if (deleteMessage) {
      return res.status(200).json({ message: "Message deleted successfully!" });
    } else {
      return res.status(404).json({ message: "Failed to delete message!!" });
    }
  } catch (error) {
    console.error("Failed to delete one message:", error);
    return res
      .status(500)
      .json({ message: "Failed to delete one message, please try again!!" });
  }
};

export const editOneMessage = async (req, res) => {
  const messageId = req.params.id;
  const { messageTxt } = req.body;

  try {
    const editMessage = await MessageModel.findByIdAndUpdate(
      messageId,
      { message: messageTxt },
      { new: true }
    );
    if (!editMessage) {
      return res
        .status(500)
        .json({ message: "Failed to edit the selected message" });
    }
    return res.status(200).json({
      message: "The message has been edited successfully!",
      editMessage,
    });
  } catch (error) {
    console.error("Failed to edit the message:", error);
    return res
      .status(500)
      .json({ message: "Failed to edit the message, please try again!!" });
  }
};

export const fetchMessages = async (req, res) => {
  try {
    const messages = await MessageModel.find();
    return res.status(200).json(messages);
  } catch (error) {
    console.error("Failed to fetch the messages:", error);
    return res.status(500).json({ message: "Failed to fetch the messages!!" });
  }
};
