import React, { useContext, useEffect, useState } from "react";
import "./Home.css";
import HomeNav from "../PageElements.js/HomeNav";
import HomeSideBar from "../PageElements.js/HomeSideBar";
import { userContext } from "../../UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faMars,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import HomeFooter from "../PageElements.js/HomeFooter";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [reciever, setReciever] = useState({
    username: "",
    profilePic: "",
    firstname: "",
    lastname: "",
  });
  const [messageId, setMessageId] = useState("");
  const [messageText, setMessageText] = useState("");
  const [searchModal, setSearchModal] = useState(false);
  const [messageModal, setMessageModal] = useState(false);
  const [userData, setUserData] = useState([]);
  const { userId } = useContext(userContext);
  const [isProfilePicUploaded, setIsProfilePicUploaded] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/getAllUsers/${userId}`
        );
        // console.log("Fetched users:", response.data);
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch the users:", error);
      }
    };
    getUsers();
  }, [userId]);

  const handleNotInterestedUsers = async (id) => {
    try {
      const response = await axios.post(
        `http://localhost:8081/api/notInterestedUsers/${userId}`,
        { notInterestedUserId: id }
      );
      console.log("Marked user as not interested:", response.data);
      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Failed to mark user as not interested:", error);
    }
  };

  const handleShowModal = async (e) => {
    e.preventDefault();

    if (!searchUser) {
      window.alert("username can not be empty!!");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8081/api/searchUser/${userId}`,
        { searchUser }
      );
      console.log("Searched user:", response.data);
      setUserData(response.data);
      setSearchModal(true);
    } catch (error) {
      console.error("Failed to search user:", error);
      window.alert("You searched for wrong user, please re-check the username");
    }
  };

  const handleCloseSearchModal = () => {
    setSearchModal(false);
    setSearchUser("");
  };

  const handleSendMessage = async (id) => {
    try {
      const senderInfo = await axios.get(
        `http://localhost:8081/api/fetchSenderUsername/${userId}`
      );
      const { senderusername, senderprofilepic, senderfirstname } =
        senderInfo.data;
      console.log("data", senderInfo);

      const recieverInfo = await axios.get(
        `http://localhost:8081/api/userInfo/${id}`
      );
      const reciverData = recieverInfo.data;
      setReciever(reciverData);
      setIsProfilePicUploaded(!!reciverData.profilePic);

      const checkSendMessage = await axios.get(
        `http://localhost:8081/api/messageSent/${userId}/${id}`
      );
      const alreadySentMessage = checkSendMessage.data;
      if (alreadySentMessage.length > 0) {
        navigate("/inbox");
        return;
      }

      const response = await axios.post(
        `http://localhost:8081/api/sendMessage/${userId}`,
        {
          receiverId: id,
          username: reciverData.username,
          profilePic: reciverData.profilePic,
          firstname: reciverData.firstname,
          lastname: reciverData.lastname,
          senderUsername: senderusername,
          senderFirstname: senderfirstname,
          senderPfp: senderprofilepic,
        }
      );
      setMessageModal(true);
      setSearchModal(false);
      const { messageId } = response.data;
      setMessageId(messageId);
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Failed to send the message:", error);
      window.alert("Failed to send the message, please try again ");
    }
  };

  const handleCancelMessage = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8081/api/cancelMessage/${messageId}`
      );
      console.log("Message deleted successfully:", response.data);
      setMessageModal(false);
      setSearchUser("");
    } catch (error) {
      console.error("Failed to cancel the message:", error);
      window.alert("Failed to cancel the message, please try again");
    }
  };

  const handleConfirmMessage = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `http://localhost:8081/api/confirmMessage/${messageId}`,
        { messageText: messageText }
      );
      console.log("Message confirmed successfully:", response.data);
      setMessageModal(false);
      setSearchUser("");
      navigate("/inbox", { replace: true });
    } catch (error) {
      console.error("Failed to send the message:", error);
      window.alert("Failed to send the message, please try again");
    }
  };

  return (
    <>
      <HomeNav />
      <HomeSideBar />
      <div id="mainContainer">
        <form id="searchForm">
          <input
            id="searchBar"
            type="text"
            placeholder="Enter username"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            required
          />
          <button id="searchData" type="button" onClick={handleShowModal}>
            Search My Friend
          </button>
        </form>
        <h4 id="mainContainerHeading">Suggestions</h4>
        <div id="suggLine"></div>
        <div id="accountContainer">
          {users.length > 0 ? (
            <ul id="usersList">
              {users.map((user) => (
                <li key={user._id}>
                  <div id="dataBackground">
                    <p id="dbusername">
                      <strong>{user.username}</strong>{" "}
                      <span id="dbgender">
                        {" "}
                        <FontAwesomeIcon id="dbgenderIcon" icon={faUser} />
                        {user.gender.toLocaleUpperCase()}
                      </span>
                    </p>
                    {user.profilePic ? (
                      <img
                        id="dbuserimage"
                        src={`http://localhost:8081/${user.profilePic}`}
                        alt={`${user.profilePic}'s profile picture`}
                      ></img>
                    ) : (
                      <div id="noprofilepic"></div>
                    )}
                    <p id="dbage">
                      <strong>{user.age}</strong> years old
                    </p>
                    <p id="dbuserbio">" {user.bio} "</p>
                    <button
                      id="sendNewMessage"
                      onClick={() => handleSendMessage(user._id)}
                    >
                      Message User
                    </button>
                    <button
                      id="not-interested"
                      onClick={() => handleNotInterestedUsers(user._id)}
                    >
                      &times;
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p id="no-user-found">No user found !!</p>
          )}
        </div>
      </div>
      {searchModal && (
        <div id="searchModal">
          <div id="searchModalContent">
            {userData && userData.length > 0 ? (
              userData.map((user) => (
                <div key={user._id}>
                  <p
                    id="searchedUsername"
                    style={{
                      position: "relative",
                      fontFamily:
                        '"Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif',
                      left: user.profilePic ? "130px" : "150px",
                      bottom: user.profilePic ? "" : "6px",
                      color: "black",
                      fontSize: "1.2em",
                    }}
                  >
                    @
                    <strong>
                      <u>{user.username}</u>
                    </strong>
                  </p>
                  {user.profilePic ? (
                    <img
                      id="searchedUserImage"
                      src={`http://localhost:8081/${user.profilePic}`}
                      alt={`${user.username}'s profile picture`}
                    />
                  ) : (
                    <div id="nouserPFP"></div>
                  )}
                  <p id="searchedUserFullName">
                    {user.firstname} {user.lastname}
                  </p>
                  <p id="searchedUserAge">
                    {user.age} years old,{" "}
                    <FontAwesomeIcon id="searchedGender" icon={faMars} />{" "}
                    {user.gender ? user.gender.toLocaleUpperCase() : ""}
                  </p>
                  <button
                    id="sendMessageToUser"
                    onClick={() => handleSendMessage(user._id)}
                  >
                    Send Message
                  </button>
                  <p id="searchedUserLocation">
                    From{" "}
                    <FontAwesomeIcon
                      id="searchedLocation"
                      icon={faLocationDot}
                    />
                    <strong>{user.location}</strong>
                  </p>
                  <div id="searchedBioBackground">
                    <p id="searchedBio">" {user.bio} "</p>
                  </div>
                  <button id="closeUserModal" onClick={handleCloseSearchModal}>
                    Close
                  </button>
                </div>
              ))
            ) : (
              <p id="no-user-found">No users found.</p>
            )}
          </div>
        </div>
      )}
      {messageModal && (
        <div id="messageModal">
          <div id="msgModalBackground">
            {reciever && reciever.username && (
              <div id="recieverusername">
                @<u>{reciever.username}</u>
              </div>
            )}
            {reciever && reciever.profilePic ? (
              <img
                id="recieverprofilepic"
                src={`http://localhost:8081/${reciever.profilePic}`}
                alt={`${reciever.username}'s profile picture`}
              />
            ) : (
              <div id="noPFP"></div>
            )}
            {reciever && reciever.firstname && reciever.lastname && (
              <div
                id="recieverFullname"
                style={{
                  position: "relative",
                  fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
                  fontSize: "0.8em",
                  color: "black",
                  left: "128px",
                  bottom: isProfilePicUploaded ? "77px" : "74px",
                }}
              >
                {reciever.firstname} {reciever.lastname}
              </div>
            )}
            <form id="messageForm">
              <button
                id="putMessage"
                style={{
                  position: "relative",
                  padding: "6px 6px",
                  backgroundColor: "lightgreen",
                  color: "black",
                  fontFamily:
                    "Franklin Gothic Medium, Arial Narrow, Arial, sans-serif",
                  cursor: "pointer",
                  borderRadius: "6px",
                  left: "130px",
                  bottom: isProfilePicUploaded ? "73px" : "69px",
                }}
                onClick={handleConfirmMessage}
              >
                Send
              </button>
              <button
                id="cancelMessage"
                style={{
                  position: "relative",
                  padding: "6px 6px",
                  backgroundColor: "lightcoral",
                  color: "black",
                  fontFamily:
                    "Franklin Gothic Medium, Arial Narrow, Arial, sans-serif",
                  cursor: "pointer",
                  borderRadius: "6px",
                  left: "140px",
                  bottom: isProfilePicUploaded ? "73px" : "69px",
                }}
                onClick={handleCancelMessage}
              >
                Cancel
              </button>
              <textarea
                id="messageContent"
                placeholder="Type Message"
                style={{
                  position: "relative",
                  width: "230px",
                  height: "120px",
                  borderRadius: "7px",
                  fontFamily:
                    "Franklin Gothic Medium, Arial Narrow, Arial, sans-serif",
                  bottom: isProfilePicUploaded ? "50px" : "42px",
                  textIndent: "8px",
                  left: "12px",
                }}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                required
              ></textarea>
            </form>
          </div>
        </div>
      )}
      <HomeFooter />
    </>
  );
};

export default Home;
