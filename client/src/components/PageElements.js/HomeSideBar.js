import React, { useContext, useEffect, useState } from "react";
import { userContext } from "../../UserContext";
import axios from "axios";
import "./HomeSideBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLocationDot,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const HomeSideBar = () => {
  const [data, setData] = useState({
    firstname: "",
    lastname: "",
    phoneNumber: "",
    gender: "",
    location: "",
    profilePic: "",
  });
  const [isProfilePicUploaded, setIsProfilePicUpload] = useState(false);

  const navigate = useNavigate();
  const { userId } = useContext(userContext);

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        try {
          const response = await axios.get(
            `http://localhost:8081/api/getUser/${userId}`
          );
          // console.log("Response from getUser API:", response.data);
          setData(response.data);
          setIsProfilePicUpload(!!response.data.profilePic);
        } catch (error) {
          console.error("Failed to fetch the data of user:", error);
        }
      }
    };
    fetchUserData();
  }, [userId]);

  const handleViewProfile = () => {
    navigate("/viewprofile");
  };

  const handleViewInbox = () => {
    navigate("/inbox");
  };

  return (
    <>
      <div id="dataContainer">
        {data.firstname && data.lastname && (
          <>
            <h4 id="firstname">
              {data.firstname} {""}
              {data.lastname}
            </h4>
          </>
        )}
        {data.phoneNumber && (
          <>
            <h4 id="phonenumber">{data.phoneNumber}</h4>
          </>
        )}
        {data.gender && data.location && (
          <>
            <h4 id="gender">
              <FontAwesomeIcon id="genderIcon" icon={faUser} />
              {data.gender.toLocaleUpperCase()}
              {""}
              <FontAwesomeIcon id="locationIcon" icon={faLocationDot} />
              {data.location}
            </h4>
          </>
        )}
        <button
          id="viewProfileBtn"
          onClick={handleViewProfile}
          style={{
            position: "relative",
            padding: "7px 7px",
            backgroundColor: "yellow",
            cursor: "pointer",
            color: "black",
            borderRadius: "6px",
            bottom: isProfilePicUploaded ? "-60px" : "-146px",
            left: "88px",
            fontFamily:
              '"Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif',
          }}
        >
          View My Profile
        </button>
        {data.profilePic && (
          <>
            <img
              id="profilePic"
              src={`http://localhost:8081/${data.profilePic}`}
              alt="PFP"
            />
          </>
        )}
        <button
          id="navMessages"
          style={{
            position: "relative",
            padding: "7px 7px",
            backgroundColor: "yellow",
            cursor: "pointer",
            color: "black",
            borderRadius: "6px",
            bottom: isProfilePicUploaded ? "-60px" : "-146px",
            left: isProfilePicUploaded ? "-2px" : "100px",
            fontFamily:
              '"Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif',
          }}
          onClick={handleViewInbox}
        >
          <FontAwesomeIcon icon={faEnvelope} />
        </button>
      </div>
    </>
  );
};

export default HomeSideBar;
