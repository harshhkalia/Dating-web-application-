import React, { useContext, useState, useEffect } from "react";
import ProfileNav from "../PageElements.js/ProfileNav";
import ProfileSideBar from "../PageElements.js/ProfileSideBar";
import "./Profile.css";
import { userContext } from "../../UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProfileFooter from "../PageElements.js/Footer";

const Profile = () => {
  const [data, setData] = useState({
    username: "",
    firstname: "",
    lastname: "",
    phoneNumber: "",
    email: "",
    age: "",
    gender: "",
    location: "",
    bio: "",
    interests: "",
    profilePic: "",
  });
  const [isProfilePicUploaded, setIsProfilePicUploaded] = useState(false);
  const [file, setFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    username: data.username,
    firstname: data.firstname,
    lastname: data.lastname,
    phoneNumber: data.phoneNumber,
    email: data.email,
    age: data.age,
    gender: data.gender,
    location: data.location,
    bio: data.bio,
    interests: data.interests,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChangePassModal, setIsChangePassModal] = useState(false);
  const [isLogOutModal, setIsLogOutModal] = useState(false);
  const [isDeleteAccountModal, setIsDeleteAccountModal] = useState(false);
  const [isBlockedModal, setIsBlockedModal] = useState(false);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [logoutPassword, setLogoutPassword] = useState("");
  const [deletePass, setDeletePass] = useState("");
  const [blockedUsers, setBlockedUsers] = useState([]);

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
          setUpdatedData(response.data);
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

  useEffect(() => {
    const getBlockedUsers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/getblockedusers/${userId}`
        );
        setBlockedUsers(response.data);
        console.log("Blocked users data is : ", response.data);
      } catch (error) {
        console.error("Failed to get blocked users:", error);
      }
    };
    if (isBlockedModal) {
      getBlockedUsers();
    }
  }, [userId, isBlockedModal]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const triggerFileInput = () => {
    document.getElementById("profilePicInput").click();
  };

  const triggerImageInput = () => {
    document.getElementById("imageChange").click();
  };

  const handleFileUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      const response = await axios.post(
        `http://localhost:8081/api/uploadProfilePic/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Response:", response.data);
      setIsProfilePicUploaded(true);
      setData((prevData) => ({
        ...prevData,
        profilePic: response.data.profilePic,
      }));
      setFile(null);
      if (response.status === 200) {
        navigate("/home");
      }
    } catch (error) {
      console.error("Failed to upload the pic:", error);
      alert("Failed to upload the pic, please try again!!!!");
    }
  };

  const handlePFPChange = async () => {
    if (!image) return;
    const formData = new FormData();
    formData.append("profilePic", image);
    try {
      const response = await axios.put(
        `http://localhost:8081/api/updateUserPFP/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setIsEditing(false);
      setData((prevData) => ({
        ...prevData,
        profilePic: response.data.updateUser.profilePic,
      }));
      setImage(null);
      if (response.status === 200) {
        navigate("/home");
      }
    } catch (error) {
      console.error("Failed to change the profile pic:", error);
      alert("Failed to change the profile pic, please try again");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDeleteImage = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8081/api/deleteProfilePic/${userId}`
      );
      console.log(response.data);
      setData((prevData) => ({
        ...prevData,
        profilePic: "",
      }));
      setIsProfilePicUploaded(false);
      setIsEditing(false);
      if (response.status === 200) {
        navigate("/home");
      }
    } catch (error) {
      console.error("Failed to delete the image:", error);
      alert("Failed to delete the image, please try again");
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:8081/api/updateUserProfile/${userId}`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Data response:", response.data);
      setIsEditing(false);
      setData(response.data.updateData);
    } catch (error) {
      console.error("Failed to update the data:", error);
      alert("Failed to edit the data, please try again");
    }
  };

  const handleShowModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChangePassModal = () => {
    setIsModalOpen(false);
    setIsChangePassModal(true);
  };

  const handleLogOutModal = () => {
    setIsModalOpen(false);
    setIsLogOutModal(true);
  };

  const handleDeleteAccountModal = () => {
    setIsModalOpen(false);
    setIsDeleteAccountModal(true);
  };

  const handleBlockedUsersModal = () => {
    setIsModalOpen(false);
    setIsBlockedModal(true);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!password || !newPassword) {
      return alert("Please enter a value to change password");
    }
    try {
      const response = await axios.put(
        `http://localhost:8081/api/changePassword/${userId}`,
        { password, newPassword },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setIsChangePassModal(false);
      window.alert(response.data.message);
      if (response.status === 200) {
        navigate("/");
      }
    } catch (error) {
      console.error("Failed to change the password:", error);
      window.alert("Failed to change the password, please try again!!");
    }
  };

  const handleLogoutUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:8081/api/logoutUser/${userId}`,
        { logoutPassword },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setIsLogOutModal(false);
      window.alert(response.data.message);
      if (response.status === 200) {
        navigate("/");
      }
    } catch (error) {
      console.error("Failed to logout the user:", error);
      window.alert("Failed to log-out, please try again ");
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:8081/api/deleteUser/${userId}`,
        { deletePass },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setIsDeleteAccountModal(false);
      window.alert(response.data.message);
      if (response.status === 200) {
        navigate("/");
      }
    } catch (error) {
      console.error("Failed to delete the account:", error);
      window.alert("Failed to delete the account, please try again");
    }
  };

  const handleUnblockUser = async (blockedId) => {
    try {
      const response = await axios.put(
        `http://localhost:8081/api/unblockuser/${userId}/${blockedId}`
      );
      console.log("unblocked user data is : ", response.data);
      setBlockedUsers((prevUser) => {
        prevUser.filter((user) => user._id !== blockedId);
      });
      setIsBlockedModal(false);
    } catch (error) {
      console.error("Failed to unblock the user:", error);
      window.alert("Failed to unblock the user, please try again");
    }
  };

  return (
    <>
      <ProfileNav />
      <ProfileSideBar />
      <div id="profileDataContainer">
        <h4 id="containerHeading">YOUR-DATA</h4>
        <div id="containerLine"></div>
        {!isEditing ? (
          <>
            {data.username && (
              <h4 id="dataUsername">
                UserName : <b>{data.username}</b>
              </h4>
            )}
            {data.firstname && (
              <h4 id="dataFirstname">
                First Name : <b>{data.firstname}</b>
              </h4>
            )}
            {data.lastname && (
              <h4 id="dataLastname">
                Last Name : <b>{data.lastname}</b>
              </h4>
            )}
            {data.phoneNumber && (
              <h4 id="dataPhonenumber">
                Mobile Number: <b>{data.phoneNumber}</b>
              </h4>
            )}
            {data.email && (
              <h4 id="dataEmail">
                Email : <b>{data.email}</b>
              </h4>
            )}
            {data.gender && (
              <h4 id="dataGender">
                <FontAwesomeIcon id="genderIcon" icon={faUser} />
                <b>{data.gender.toLocaleUpperCase()}</b>
              </h4>
            )}
            {data.location && (
              <h4 id="dataLocation">
                <FontAwesomeIcon id="locationIcon" icon={faLocationDot} />
                <b>{data.location}</b>
              </h4>
            )}
            {data.bio && (
              <div id="bioBackground">
                <h4 id="dataBio">
                  <b id="bioContent">"{data.bio}"</b>
                </h4>
              </div>
            )}
            {data.age && data.interests && (
              <p id="dataAgeNDinterests">
                You are <b>"{data.age}yrs"</b> old and interested in{" "}
                <b>"{data.interests}"</b>
              </p>
            )}
            <input
              type="file"
              id="profilePicInput"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <button
              id="addPicBtn"
              onClick={triggerFileInput}
              style={{
                display: file || isProfilePicUploaded ? "none" : "block",
              }}
            >
              Add PFP
            </button>
            {file && (
              <button id="fileUploadButton" onClick={handleFileUpload}>
                UPLOAD PIC
              </button>
            )}
            {data.profilePic && (
              <img
                id="fetchedPFP"
                src={`http://localhost:8081/${data.profilePic}`}
                alt="PFP"
              />
            )}
            <button
              id="editProfile"
              style={{
                position: "relative",
                padding: "7px 7px",
                borderRadius: "8px",
                backgroundColor: "yellow",
                color: "black",
                fontFamily:
                  '"Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif',
                cursor: "pointer",
                bottom: isProfilePicUploaded ? "505px" : "370px",
                left: isProfilePicUploaded ? "255px" : "490px",
              }}
              onClick={() => setIsEditing(true)}
            >
              EDIT PROFILE
            </button>
            <button
              id="morePFsettings"
              style={{
                position: "relative",
                padding: "7px 7px",
                borderRadius: "8px",
                backgroundColor: "yellow",
                color: "black",
                fontFamily:
                  '"Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif',
                cursor: "pointer",
                bottom: isProfilePicUploaded ? "425px" : "320px",
                left: isProfilePicUploaded ? "199px" : "385px",
              }}
              onClick={handleShowModal}
            >
              MORE OPTIONS
            </button>
            {isModalOpen && (
              <div id="fullPageModal">
                <div id="modalBackground">
                  <button
                    id="changePasswordBtn"
                    onClick={handleChangePassModal}
                  >
                    CHANGE PASS
                  </button>
                  <button id="logoutBtn" onClick={handleLogOutModal}>
                    LOG-OUT
                  </button>
                  <button id="deleteAccBtn" onClick={handleDeleteAccountModal}>
                    DEL-ACC
                  </button>
                  <button
                    id="blockedUsersBtn"
                    onClick={handleBlockedUsersModal}
                  >
                    BLOCKED
                  </button>
                </div>
                <button id="closeModal" onClick={handleCloseModal}>
                  CLOSE THE MODAL
                </button>
              </div>
            )}
            {isChangePassModal && (
              <div id="fullPageModal">
                <div id="chnPassModal">
                  <h4 id="chnModalHeading">CHANGE PASSWORD</h4>
                  <div id="headLine"></div>
                  <form id="changePassForm">
                    <input
                      type="password"
                      id="prevPassInput"
                      name="prevPass"
                      placeholder="Current Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <input
                      type="password"
                      id="newPassInput"
                      name="newPass"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <button
                      id="savePassword"
                      type="button"
                      onClick={handleChangePassword}
                    >
                      SAVE
                    </button>
                  </form>
                  <button
                    id="closePassModal"
                    onClick={() => setIsChangePassModal(false)}
                  >
                    CLOSE
                  </button>
                </div>
              </div>
            )}
            {isLogOutModal && (
              <div id="fullPageModal">
                <div id="logOutModal">
                  <h4 id="logoutHeading">LOG-OUT YOUR ACCOUNT</h4>
                  <div id="logoutLine"></div>
                  <h5 id="logoutVerifyLine">Enter password for verification</h5>
                  <form id="logoutPassForm">
                    <input
                      id="logoutPass"
                      type="password"
                      value={logoutPassword}
                      onChange={(e) => setLogoutPassword(e.target.value)}
                      required
                    />
                    <button
                      id="logoutButton"
                      type="button"
                      onClick={handleLogoutUser}
                    >
                      LOG-OUT
                    </button>
                  </form>
                  <button
                    id="closeLogOutModal"
                    onClick={() => setIsLogOutModal(false)}
                  >
                    CLOSE
                  </button>
                </div>
              </div>
            )}
            {isDeleteAccountModal && (
              <div id="fullPageModal">
                <div id="deleteModalBackground">
                  <h5 id="deleteModalHeading">DELETE THIS ACCOUNT !!</h5>
                  <div id="modalHeadLine"></div>
                  <h5 id="delModalHeading">Enter password for confirmation</h5>
                  <form id="deleteAccountForm">
                    <input
                      type="password"
                      id="deleteAccountPassword"
                      value={deletePass}
                      onChange={(e) => setDeletePass(e.target.value)}
                      required
                    />
                    <button
                      id="delteAccountButton"
                      type="button"
                      onClick={handleDeleteAccount}
                    >
                      DELETE
                    </button>
                  </form>
                  <button
                    id="closeDeleteModal"
                    onClick={() => setIsDeleteAccountModal(false)}
                  >
                    CLOSE
                  </button>
                </div>
              </div>
            )}
            {isBlockedModal && (
              <div id="fullPageModal">
                <div id="blockedUsersModal">
                  <h5 id="blockedUsersHeading">BLOCKED USERS</h5>
                  <div id="modalSepLine"></div>
                  <div id="blockedUsersContainer">
                    {blockedUsers.length > 0 ? (
                      blockedUsers.map((user) => (
                        <div key={user._id}>
                          <div id="blockedUsersBackground">
                            <p id="blockuserUsername">@{user.username}</p>
                            {user.profilePic ? (
                              <img
                                id="blockuserImage"
                                src={`http://localhost:8081/${user.profilePic}`}
                                alt={`${user.username}'s profile picture`}
                              />
                            ) : (
                              <div id="blockusernoPFP"></div>
                            )}
                            <p
                              id="blockuserHeading"
                              style={{
                                position: "relative",
                                fontFamily:
                                  "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
                                color: "white",
                                bottom: user.profilePic ? "74px" : "68px",
                                fontSize: "0.5em",
                                left: "68px",
                              }}
                            >
                              This user is blocked and you can't chat with them.
                            </p>
                            <button
                              id="unblockButton"
                              style={{
                                position: "relative",
                                padding: "3px 3px",
                                backgroundColor: "lightgreen",
                                fontFamily:
                                  "Franklin Gothic Medium, Arial Narrow, Arial, sans-serif",
                                borderRadius: "6px",
                                cursor: "pointer",
                                bottom: user.profilePic ? "73px" : "69px",
                                left: "209px",
                              }}
                              onClick={() => handleUnblockUser(user._id)}
                            >
                              Unblock
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p id="noblockusers">No blocked users found !!</p>
                    )}
                  </div>
                  <button
                    id="closeBlockedUsers"
                    type="button"
                    onClick={() => setIsBlockedModal(false)}
                  >
                    CLOSE
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div id="formContainer">
            <form id="updatePFform">
              <input
                type="text"
                id="editUsernameInput"
                name="username"
                value={updatedData.username}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                id="editFirstnameInput"
                name="firstname"
                value={updatedData.firstname}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                id="editLastnameInput"
                name="lastname"
                value={updatedData.lastname}
                onChange={handleInputChange}
                required
              />
              <input
                type="email"
                id="editEmailInput"
                name="email"
                value={updatedData.email}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                id="editPhoneNoInput"
                name="phoneNumber"
                value={updatedData.phoneNumber}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                id="editLocationInput"
                name="location"
                value={updatedData.location}
                onChange={handleInputChange}
                required
              />
              <input
                type="number"
                id="editAgeInput"
                name="age"
                value={updatedData.age}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                id="editInterestInput"
                name="interests"
                value={updatedData.interests}
                onChange={handleInputChange}
                required
              />
              <textarea
                id="editBioInput"
                name="bio"
                value={updatedData.bio}
                onChange={handleInputChange}
                required
              />
              <input
                type="file"
                style={{ display: "none" }}
                id="imageChange"
                onChange={handleImageChange}
              />
              <button
                id="changeImage"
                type="button"
                onClick={triggerImageInput}
                style={{
                  display: image ? "none" : "block",
                }}
              >
                CHANGE IMAGE
              </button>
              <button
                id="save-button"
                type="button"
                onClick={handleUpdateUser}
                style={{
                  position: "relative",
                  bottom: image ? "11px" : "58px",
                  padding: "3px 3px",
                  borderRadius: "4px",
                  backgroundcolor: "white",
                  color: "black",
                  fontFamily:
                    '"Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif',
                  cursor: "pointer",
                  left: image ? "-200px" : "310px",
                }}
              >
                SAVE
              </button>
              <button
                id="cancel-button"
                type="button"
                onClick={() => setIsEditing(false)}
                style={{
                  position: "relative",
                  bottom: image ? "37px" : "58px",
                  padding: "3px 3px",
                  borderRadius: "4px",
                  backgroundcolor: "white",
                  color: "black",
                  fontFamily:
                    '"Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif',
                  cursor: "pointer",
                  left: image ? "360px" : "330px",
                }}
              >
                CANCEL
              </button>
              <p
                id="form-line"
                style={{
                  position: "relative",
                  bottom: image ? "72px" : "90px",
                  color: "black",
                  fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
                  left: image ? "" : "538px",
                }}
              >
                Edit Info
              </p>
            </form>
            <button
              id="delete-image"
              type="button"
              onClick={handleDeleteImage}
              style={{
                position: "relative",
                bottom: image ? "446px" : "468px",
                padding: "3px 3px",
                borderRadius: "4px",
                backgroundcolor: "white",
                color: "black",
                fontFamily:
                  '"Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif',
                cursor: "pointer",
                left: image ? "" : "492px",
              }}
            >
              DELETE IMAGE
            </button>
            {image && (
              <button id="changePFPButton" onClick={handlePFPChange}>
                CONFIRM!!
              </button>
            )}
          </div>
        )}
      </div>
      <ProfileFooter />
    </>
  );
};

export default Profile;
