import React, { useContext, useEffect, useState } from "react";
import MessageNav from "../PageElements.js/MessageNav";
import MessageSideBar from "../PageElements.js/MessageSideBar";
import "./Messages.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faGear,
  faPaperPlane,
  faCircleCheck,
  faCaretDown,
} from "@fortawesome/free-solid-svg-icons";
import MessageFooter from "../PageElements.js/MessageFooter";
import axios from "axios";
import { userContext } from "../../UserContext";

const Messages = () => {
  const [messagedetails, setMessagedetails] = useState([]);
  const [messages, setMessages] = useState([]);
  const [searchedMessages, setSearchedMessages] = useState([]);
  const [recieverFirstname, setRecieverFirstname] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [senderUsername, setSenderusername] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [senderFirstName, setSenderFirstName] = useState("");
  const [senderProfilePic, setSenderProfilePic] = useState("");
  const [receiverFirstName, setReceiverFirstname] = useState("");
  const [receiverUsername, setReceiverUsername] = useState("");
  const [receiverProfilePic, setReceiverProfilePic] = useState("");
  const [senderLastname, setSenderLastname] = useState("");
  const [receiverLastname, setReceiverLastName] = useState("");
  const [messageTxt, setMessageTxt] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [senderId, setSenderId] = useState(null);
  const [receiverId, setReceiverId] = useState(null);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [otherUserId, setOtherUserId] = useState(null);
  const [settingOption, setSettingOption] = useState(false);
  const [moreOption, setMoreOption] = useState(false);
  const [editMessage, setEditMessage] = useState(false);
  const [searchedUser, setSearchedUser] = useState(false);
  const [searchedUserDetails, setSearchedUserDetails] = useState(null);
  const { userId } = useContext(userContext);

  const [isprofilepicUploaded, setIsprofilePicUploaded] = useState(false);

  const handleToogleSettings = () => {
    setSettingOption(!settingOption);
  };

  const handleMoreOptions = (messageId) => {
    setSelectedMessageId(messageId);
    setMoreOption(!moreOption);
  };

  const fetchMessages = async (otherUserId) => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/getAllMessages/${userId}/${otherUserId}`
      );
      setMessages(response.data);
      setSearchedMessages(response.data);
    } catch (error) {
      console.error("Failed to get the messages:", error);
    }
  };

  const handleShowChats = async (message) => {
    const otherUserId =
      message.sender._id === userId ? message.receiver._id : message.sender._id;

    setSenderId(message.sender._id);
    setReceiverId(message.receiver._id);
    setOtherUserId(otherUserId);
    // console.log("Other user ID:", otherUserId);

    try {
      const [senderResponse, receiverResponse] = await Promise.all([
        axios.get(
          `http://localhost:8081/api/senderUsername/${message.sender._id}`
        ),
        axios.get(
          `http://localhost:8081/api/receiverdetails/${message.receiver._id}`
        ),
      ]);

      // console.log("Sender Response:", senderResponse.data);
      // console.log("Receiver Response:", receiverResponse.data);
      // console.log("Messages Response:", messagesResponse.data);

      const {
        username: senderUsername,
        firstname: senderFirstName,
        lastname: senderLastname,
        profilePic: senderProfilePic,
      } = senderResponse.data;

      const {
        username: receiverUsername,
        firstname: receiverFirstName,
        lastname: receiverLastname,
        profilePic: receiverProfilePic,
      } = receiverResponse.data;

      // const displayedSenderFirstname =
      //   message.sender._id === userId ? "You" : senderFirstName;
      // const displayedSenderUsername =
      //   message.sender._id === userId ? "You" : senderUsername;

      // I tried to add some functionality in this code but that does not work so i commented out that portion.. All the commented part is not working of this function

      setRecieverFirstname(
        message.sender._id === userId ? receiverFirstName : senderFirstName
      );

      if (message.status === "unread" && message.receiver._id === userId) {
        const response = await axios.put(
          `http://localhost:8081/api/markAsRead/${message._id}`,
          {
            status: "read",
          }
        );
        console.log("mark as read API say : ", response.data.message);
      }

      // const updatedMessages = messagesResponse.data.map((msg) => {
      //   const isSender =
      //     msg.sender &&
      //     msg.sender._id &&
      //     msg.sender._id.toString() === message.sender._id.toString();
      //   const isReceiver =
      //     msg.receiver &&
      //     msg.receiver._id &&
      //     msg.receiver._id.toString() === message.receiver._id.toString();

      //   return {
      //     ...msg,
      //     sender_username: isSender
      //       ? displayedSenderUsername
      //       : msg.sender_username,
      //     sender_firstname: isSender
      //       ? displayedSenderFirstname
      //       : msg.sender_firstname,
      //     receiver_username: isReceiver
      //       ? receiverUsername
      //       : msg.receiver_username,
      //     receiver_firstname: isReceiver
      //       ? receiverFirstName
      //       : msg.receiver_firstname,
      //   };
      // });

      // setMessages(updatedMessages);

      setSelectedMessageId(message._id);
      console.log("message id is:", message._id);

      setSenderusername(senderUsername);
      setSenderProfilePic(senderProfilePic);
      setSenderFirstName(senderFirstName);
      setReceiverFirstname(receiverFirstName);
      setReceiverUsername(receiverUsername);
      setReceiverProfilePic(receiverProfilePic);
      setSenderLastname(senderLastname);
      setReceiverLastName(receiverLastname);
      fetchMessages(otherUserId);
      setShowDetails(true);
    } catch (error) {
      console.error("Failed to display chat of this person:", error);
    }
  };

  const handleNewMessageSave = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8081/api/saveNewMessage/${senderId}/${receiverId}`,
        {
          receiver_username: receiverUsername,
          receiver_profilePic: receiverProfilePic,
          receiver_firstname: receiverFirstName,
          receiver_lastname: receiverLastname,
          sender_username: senderUsername,
          sender_profilePic: senderProfilePic,
          sender_firstname: senderFirstName,
          sender_lastname: senderLastname,
          message: messageContent,
        }
      );
      console.log("Response:", response.data);
      setMessageContent("");

      setMessages((prevMessages) => [
        ...prevMessages,
        response.data.newMessage,
      ]);
    } catch (error) {
      console.error("Failed to save new message:", error);
      window.alert("Failed to save new message, please try again");
    }
  };

  const handleMarkAsUnread = async (messageId) => {
    try {
      const messageResponse = await axios.get(
        `http://localhost:8081/api/findmessage/${messageId}`
      );
      const message = messageResponse.data;

      if (message.status === "read" && receiverId === userId) {
        const updateMessage = await axios.put(
          `http://localhost:8081/api/markAsUnread/${messageId}`
        );
        console.log("Response of mark to unmark API : ", updateMessage.data);
        setShowDetails(false);
        setSettingOption(false);
      } else {
        console.log(
          "This operation can not be done as you are a sender not receiver!!"
        );
        setShowDetails(false);
        setSettingOption(false);
      }
    } catch (error) {
      console.error("Failed to mark message as unread : ", error);
      window.alert("Failed to mark message as unread, please try again");
    }
  };

  const handleDeleteAllChats = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8081/api/deleteallchats/${senderId}/${receiverId}`
      );
      console.log(
        "Response of deletion occured for all chats: ",
        response.data
      );
      setShowDetails(false);
      setSettingOption(false);
      setMessagedetails((prevDetails) =>
        prevDetails.filter((detail) => detail.receiver._id !== receiverId)
      );
    } catch (error) {
      console.error("Failed to delete all chats: ", error);
      window.alert("Failed to delete all chats, please try again");
    }
  };

  const handleBlockUsers = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8081/api/blockuser/${userId}/${otherUserId}`
      );
      console.log("Response for block user:", response.data.blockAccount);

      const updateDetails = await axios.get(
        `http://localhost:8081/api/fetchMessagedetails/${userId}`
      );
      setMessagedetails(updateDetails.data);
      setShowDetails(false);
    } catch (error) {
      console.error("Failed to block the user :", error);
      window.alert("Failed to block the user, please try again");
    }
  };

  useEffect(() => {
    const messageDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/fetchMessagedetails/${userId}`
        );
        console.log("Data", response.data);
        setMessagedetails(response.data);
      } catch (error) {
        console.log("Failed to get the messages and there info!!", error);
      }
    };
    messageDetails();
  }, [userId]);

  const handleDeleteOneMessage = async (messageId) => {
    try {
      const confirmation = window.confirm(
        "This message would be deleted forever !!"
      );
      if (confirmation) {
        const response = await axios.delete(
          `http://localhost:8081/api/deleteOneMessage/${messageId}`
        );
        console.log("Response from delete one message API :", response.data);
        setMessages((prevMessages) =>
          prevMessages.filter((message) => message._id !== messageId)
        );
      } else {
        return;
      }
    } catch (error) {
      console.error("Failed to delete one message : ", error);
      window.alert("Failed to delete one message, please try again!!");
    }
  };

  const handleEditOneMessage = (messageId) => {
    const messageToEdit = messages.find((message) => message._id === messageId);
    setSelectedMessage(messageToEdit);
    setEditMessage(true);
    setSelectedMessageId(messageId);
  };

  const handleSaveChangeToMessage = async (messageId) => {
    try {
      const response = await axios.put(
        `http://localhost:8081/api/editOneMessage/${messageId}`,
        { messageTxt: messageTxt }
      );
      console.log("Response from edit Message API:", response.data);

      const updatedMessage = response.data.editMessage;

      setMessages((prevMessage) =>
        prevMessage.map((message) =>
          message._id === messageId
            ? { ...message, message: updatedMessage.message }
            : message
        )
      );

      setEditMessage(false);
      setMessageTxt("");
    } catch (error) {
      console.error("Failed to edit the message : ", error);
      window.alert("Failed to edit the message, please try again");
    }
  };

  const handleCancelEditMessage = () => {
    setEditMessage(false);
  };

  const handleSearchUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `http://localhost:8081/api/fetchMessages`
      );
      const messages = response.data;

      const foundMessages = messages.filter(
        (message) =>
          message.sender_username.includes(searchInput) ||
          message.reciever_username.includes(searchInput)
      );

      if (foundMessages.length > 0) {
        const foundMessage = foundMessages[0];
        const searchedUserId =
          foundMessage.sender_username === searchInput
            ? foundMessage.sender
            : foundMessage.receiver;

        const userResponse = await axios.get(
          `http://localhost:8081/api/fetchUser/${searchedUserId}`
        );
        setSearchedUserDetails(userResponse.data);
        if (userResponse.data.profilePic) {
          setIsprofilePicUploaded(true);
        } else {
          setIsprofilePicUploaded(false);
        }
        setSearchedUser(true);

        fetchMessages(searchedUserId);
      } else {
        setSearchedUserDetails(null);
        setSearchedMessages([]);
        window.alert(
          "No chat found with given username, check it once and try again"
        );
      }
    } catch (error) {
      console.error("Failed to search user with given input:", error);
      window.alert("Failed to search user with given input, please try again");
    }
  };

  const handleCloseSearchModal = () => {
    setSearchedUser(false);
    setSearchedUserDetails(null);
    setSearchInput("");
  };

  const viewChatOnFullScreen = () => {
    // console.log("Search user details:", searchedUserDetails);
    setSearchInput("");
    setSearchedUser(false);
    setSearchedUserDetails(null);
    setShowDetails(true);
    if (searchedUserDetails) {
      // console.log("firstname of receiver:", searchedUserDetails.firstname);
      setReceiverFirstname(searchedUserDetails.firstname);
      setReceiverUsername(searchedUserDetails.username);
      setMessages(searchedMessages);
    }
  };

  return (
    <>
      <MessageNav />
      <MessageSideBar />
      <div id="pageContainer">
        <form id="findUserForm" onSubmit={handleSearchUser}>
          <input
            type="text"
            id="findUserInput"
            placeholder="Find user"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            required
          />
          <button id="findUserButton">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </form>
        <p id="chatsHeading">Your Chats</p>
        <div id="containerBackground">
          <div id="usersContainer">
            {messagedetails.map((message) => (
              <div key={message._id} onClick={() => handleShowChats(message)}>
                <div id="detailsContent">
                  {message.sender._id === userId ? (
                    <>
                      {message.reciever_pfp ? (
                        <img
                          id="recieverimage"
                          src={`http://localhost:8081/${message.reciever_pfp}`}
                          alt={`${message.reciever_firstname}'s profile picture`}
                        />
                      ) : (
                        <div id="noProfilePic"></div>
                      )}
                      <p id="recieverFullName">{message.reciever_firstname}</p>
                      <p id="detailsLine">View chat</p>
                    </>
                  ) : (
                    <>
                      {message.sender_pfp ? (
                        <img
                          id="recieverimage"
                          src={`http://localhost:8081/${message.sender_pfp}`}
                          alt={`${message.sender_firstname}'s profile picture`}
                        />
                      ) : (
                        <div id="noProfilePic"></div>
                      )}
                      <p id="recieverFullName">{message.sender_firstname}</p>
                      <p id="detailsLine">View chat</p>
                    </>
                  )}
                </div>
              </div>
            ))}
            {messagedetails.length === 0 && (
              <p id="noMessages">No messages found for this user.</p>
            )}
          </div>
          <div id="messagesContainer">
            {showDetails && (
              <>
                <p id="messagingTo"> Messaging to {recieverFirstname}</p>
                <button id="messageOptions" onClick={handleToogleSettings}>
                  <FontAwesomeIcon icon={faGear} />
                </button>
                <input
                  id="messagesInputbox"
                  type="text"
                  placeholder="Type a message.."
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                />
                <button id="sendMessageButton" onClick={handleNewMessageSave}>
                  <FontAwesomeIcon icon={faPaperPlane} />
                </button>
                {messages.map((message) => (
                  <div key={message._id}>
                    <p id="sender_name">
                      {message.sender === userId
                        ? "You"
                        : message.sender_username}
                      {message.status === "read" &&
                        message.sender === userId && (
                          <span id="messageSeen">
                            seen <FontAwesomeIcon icon={faCircleCheck} />
                          </span>
                        )}
                      {message.status === "read" &&
                        message.sender !== userId && (
                          <span id="sentTime">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                        )}
                    </p>
                    <div id="messageBackground">
                      <p id="message">{message.message}</p>
                    </div>
                    <button
                      id="messagesOption"
                      onClick={() => handleMoreOptions(message._id)}
                    >
                      <FontAwesomeIcon icon={faCaretDown} />
                    </button>
                  </div>
                ))}
                {settingOption && (
                  <div id="settingContainer">
                    <button
                      id="deleteChatButton"
                      onClick={handleDeleteAllChats}
                    >
                      Delete Chat
                    </button>
                    <button id="blockUserButton" onClick={handleBlockUsers}>
                      Block User
                    </button>
                    <button
                      id="markasunreadButton"
                      onClick={() => handleMarkAsUnread(selectedMessageId)}
                    >
                      Mark as unread!!
                    </button>
                  </div>
                )}
                {moreOption && (
                  <div id="optionsContainer">
                    <button
                      id="editMessage"
                      onClick={() => handleEditOneMessage(selectedMessageId)}
                    >
                      Edit
                    </button>
                    <button
                      id="deleteMessage"
                      onClick={() => handleDeleteOneMessage(selectedMessageId)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
          {editMessage && (
            <div id="editMessageModalBackground">
              <div id="editMessageModal">
                <p id="messageModalLine1">Old Message</p>
                <div id="oldMessageContainer">
                  <span id="selectedMessage">{selectedMessage.message}</span>
                </div>
                <p id="messageModalLine2">Edit Here</p>
                <textarea
                  id="newMessageInput"
                  placeholder="New Message"
                  value={messageTxt}
                  onChange={(e) => setMessageTxt(e.target.value)}
                ></textarea>
                <button
                  id="saveChangesButton"
                  onClick={() => handleSaveChangeToMessage(selectedMessageId)}
                >
                  Save Changes
                </button>
                <button
                  id="cancelChangesButton"
                  onClick={handleCancelEditMessage}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          {searchedUser && (
            <div id="searchedUserModalBackground">
              <div id="searchUserModal">
                <div id="userProfileSide">
                  <p id="searchuserUsername">@{searchedUserDetails.username}</p>
                  <button
                    id="closeSearchModal"
                    style={{
                      position: "relative",
                      padding: "6px 6px",
                      borderRadius: "5px",
                      fontFamily:
                        '"Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif',
                      cursor: "pointer",
                      left: isprofilepicUploaded ? "43px" : "44px",
                      top: isprofilepicUploaded ? "47px" : "107px",
                      backgroundColor: "lightcoral",
                    }}
                    onClick={handleCloseSearchModal}
                  >
                    Close
                  </button>
                  {searchedUserDetails.profilePic ? (
                    <img
                      id="searchuserProfilePic"
                      src={`http://localhost:8081/${searchedUserDetails.profilePic}`}
                      alt={`${searchedUserDetails.username}'s profile picture`}
                    />
                  ) : (
                    <div id="searchuserWhitePFP"></div>
                  )}
                </div>
                <p id="searchModalHeading">
                  Your chats with {searchedUserDetails.firstname}{" "}
                  {searchedUserDetails.lastname}
                </p>
                <div id="chatsContainer">
                  {searchedMessages.length > 0 ? (
                    searchedMessages.map((message) => (
                      <div key={message._id}>
                        <p id="fetched_sender_name">
                          {message.sender === userId
                            ? "You"
                            : message.sender_username}
                          {message.status === "read" &&
                            message.sender === userId && (
                              <span id="messageSeen">
                                seen <FontAwesomeIcon icon={faCircleCheck} />
                              </span>
                            )}
                          {message.status === "read" &&
                            message.sender !== userId && (
                              <span id="sentTime">
                                {new Date(
                                  message.timestamp
                                ).toLocaleTimeString()}
                              </span>
                            )}
                        </p>
                        <div id="fetchedMessageBackground">
                          <p id="message">{message.message}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No messages found.</p>
                  )}
                </div>
                <button id="viewChatsButton" onClick={viewChatOnFullScreen}>
                  View on full screen
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <MessageFooter />
    </>
  );
};

export default Messages;
