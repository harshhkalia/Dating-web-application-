import React, { useContext, useEffect, useState } from "react";
import { userContext } from "../../UserContext";
import axios from "axios";
import "./ProfileSideBar.css";
import { useNavigate } from "react-router-dom";

const ProfileSideBar = () => {
  const [data, setData] = useState({
    username: "",
    profilePic: "",
  });
  const [isProfilePicUploaded, setIsProfilePicUploaded] = useState(false);

  const navigate = useNavigate();
  const { userId } = useContext(userContext);

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        try {
          const response = await axios.get(
            `http://localhost:8081/api/getUser/${userId}`
          );
          console.log("Response from getUser API:", response.data);
          setData(response.data);
          if (response.data.profilePic) {
            setIsProfilePicUploaded(true);
          }
        } catch (error) {
          console.error("Failed to fetch the data of user:", error);
        }
      }
    };
    fetchUserData();
  }, [userId]);

  const handleNavigateHome = () => {
    navigate("/home");
  };

  const handleViewInbox = () => {
    navigate("/inbox");
  };

  return (
    <>
      <div id="profileSideContainer">
        {data.username && (
          <>
            <h4 id="profileDetail">Viewing profile of</h4>
            <p id="profileUsername">
              @<u>{data.username}</u>
            </p>
            <button
              id="homeButton"
              onClick={handleNavigateHome}
              style={{
                position: "relative",
                padding: "8px 8px",
                borderRadius: "7px",
                backgroundcolor: "yellow",
                color: "black",
                cursor: "pointer",
                fontFamily:
                  '"Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif',
                left: "70px",
                top: isProfilePicUploaded ? "150px" : "230px",
              }}
            >
              HOME
            </button>
            <button
              id="inboxButton"
              style={{
                position: "relative",
                padding: "8px 8px",
                borderRadius: "7px",
                backgroundcolor: "yellow",
                color: "black",
                cursor: "pointer",
                fontFamily:
                  '"Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif',
                left: "109px",
                top: isProfilePicUploaded ? "150px" : "230px",
              }}
              onClick={handleViewInbox}
            >
              INBOX
            </button>
          </>
        )}
        {data.profilePic && (
          <>
            <img
              id="profilePicture"
              src={`http://localhost:8081/${data.profilePic}`}
              alt="PFP"
            />
          </>
        )}
      </div>
    </>
  );
};

export default ProfileSideBar;
