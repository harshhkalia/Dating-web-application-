import React, { useContext, useEffect, useState } from "react";
import { userContext } from "../../UserContext";
import axios from "axios";
import "./MessageSideBar.css";
import { useNavigate } from "react-router-dom";

const MessageSideBar = () => {
  const [data, setData] = useState({
    firstname: "",
    lastname: "",
    profilePic: "",
    phoneNumber: "",
  });
  const [isProfilePicUploaded, setIsProfilePicUpload] = useState(false);

  const navigate = useNavigate();
  const { userId } = useContext(userContext);

  useEffect(() => {
    const fetchMyData = async () => {
      if (userId) {
        try {
          const response = await axios.get(
            `http://localhost:8081/api/getUser/${userId}`
          );
          console.log("Response from backend:", response.data);
          setData(response.data);
          setIsProfilePicUpload(!!response.data.profilePic);
        } catch (error) {
          console.error("Failed to fetch the data:", error);
        }
      }
    };
    fetchMyData();
  }, [userId]);

  const handleNavHome = () => {
    navigate("/home");
  };

  const handleNavProfile = () => {
    navigate("/viewprofile");
  };

  return (
    <>
      <div id="messageSideBar">
        {data.firstname && data.lastname && (
          <>
            <h4
              id="myFullName"
              style={{
                position: "relative",
                fontFamily:
                  '"Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif',
                textalign: "center",
                fontsize: "1.4em",
                top: "205px",
                right: "3px",
                color: "black",
              }}
            >
              {data.firstname} {data.lastname}
            </h4>
          </>
        )}
        {data.phoneNumber && (
          <>
            <p
              id="myPhoneNumber"
              style={{
                position: "relative",
                fontFamily: `'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif`,
                textAlign: "center",
                fontSize: "1.1em",
                top: "178px",
                right: "5px",
                color: "black",
              }}
            >
              {data.phoneNumber}
            </p>
          </>
        )}
        {data.profilePic && (
          <img
            id="myProfilePic"
            src={`http://localhost:8081/${data.profilePic}`}
            alt="PFP"
          />
        )}
        <button
          id="navHome"
          onClick={handleNavHome}
          style={{
            position: "relative",
            padding: "8px 8px",
            borderRadius: 7,
            backgroundColor: "yellow",
            color: "black",
            cursor: "pointer",
            fontFamily:
              '"Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif',
            left: isProfilePicUploaded ? -20 : 70,
            top: isProfilePicUploaded ? 90 : 165,
          }}
        >
          Home
        </button>
        <button
          id="navProfile"
          onClick={handleNavProfile}
          style={{
            position: "elative",
            padding: "8px 8px",
            borderRadius: 7,
            backgroundColor: "yellow",
            color: "black",
            cursor: "pointer",
            fontFamily:
              '"Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif',
            top: isProfilePicUploaded ? 90 : 165,
            left: isProfilePicUploaded ? 0 : 100,
          }}
        >
          Profile
        </button>
      </div>
    </>
  );
};

export default MessageSideBar;
