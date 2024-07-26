import React, { useContext, useState } from "react";
import "./UserAuthentication.css";
import Navbar from "../PageElements.js/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { userContext } from "../../UserContext";

const UserAuthentication = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignupModal, setIsSignupModal] = useState(false);
  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [location, setLocation] = useState("");
  const [interests, setInterests] = useState("");
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("");
  const [loginData, setLoginData] = useState("");
  const [loginPass, setLoginPass] = useState("");

  const { userId, setUserId } = useContext(userContext);

  const navigate = useNavigate();

  const handleShowSignup = () => {
    setShowLogin(false);
  };

  const handleShowLogin = () => {
    setShowLogin(true);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords does not match, please enter correct passwords!!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8081/api/createAccount",
        {
          number,
          email,
          password,
        }
      );
      setUserId(response.data.userId);
      setIsSignupModal(true);
    } catch (error) {
      console.error("Failed to create the account!!");
      alert("Failed to create account, please try again");
    }
  };

  const handleCompleteProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:8081/api/completeAccount?id=${userId}`,
        {
          userName,
          firstName,
          lastName,
          age,
          location,
          interests,
          bio,
          gender,
        }
      );
      window.alert(response.data.message);
      setIsSignupModal(false);
      setTimeout(() => {
        window.location.reload();
      });
    } catch (error) {
      console.error("Failed to complete the account:", error);
      alert("Failed to complete the account, please try again!");
    }
  };

  const handleCancelCreation = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8081/api/cancelCreation?id=${userId}`
      );
      window.alert(response.data.message);
      setIsSignupModal(false);
      setNumber("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Failed to cancel account creation:", error);
      alert("Failed to cancel account creation, please try again!!");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8081/api/login", {
        loginData: loginData,
        loginPass: loginPass,
      });
      setUserId(response.data.userId);
      if (response.status === 200) {
        navigate("/home");
      }
    } catch (error) {
      console.error("Failed to login:", error);
      alert("Failed to login, please try again!!!");
    }
  };

  return (
    <>
      <Navbar />
      {showLogin ? (
        <div
          id="loginContainer"
          style={{ display: showLogin ? "block" : "none" }}
        >
          <h4 id="loginHeading">LOGIN FORM</h4>
          <div id="seperateLine"></div>
          <form id="loginForm" onSubmit={handleLogin}>
            <input
              id="emailAndPhoneInput"
              type="text"
              placeholder="Enter Phone or Email"
              value={loginData}
              onChange={(e) => setLoginData(e.target.value)}
              required
            />
            <input
              type="password"
              id="loginPass"
              placeholder="Enter the password"
              value={loginPass}
              onChange={(e) => setLoginPass(e.target.value)}
              required
            />
            <button id="loginButton" type="submit">
              LOGIN
            </button>
          </form>
          <a id="signupatag" href="#" onClick={handleShowSignup}>
            SIGN-UP ?
          </a>
        </div>
      ) : (
        <div
          id="signupContainer"
          style={{ display: !showLogin ? "block" : "none" }}
        >
          <h4 id="signupHeading">SIGNUP FORM</h4>
          <div id="seperateLine2"></div>
          <form id="signupForm" onSubmit={handleSignup}>
            <input
              type="number"
              id="numberInput"
              placeholder="Enter your number here"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              required
            />
            <input
              type="email"
              id="emailInput"
              placeholder="Enter your email here"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              id="signupPassword"
              placeholder="Create new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              id="passwordConfirm"
              placeholder="Re-Enter the password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button id="signupButton" type="submit">
              CREATE ACCOUNT
            </button>
          </form>
          <a id="loginatag" href="#" onClick={handleShowLogin}>
            LOGIN ?
          </a>
        </div>
      )}
      {isSignupModal && (
        <div>
          <div id="signupModalBackground"></div>
          <div id="signupModal">
            <h4 id="modalHeading">Complete Your Profile</h4>
            <div id="modalLine"></div>
            <form id="profileDataForm" onSubmit={handleCompleteProfile}>
              <input
                id="usernameInput"
                type="text"
                placeholder="Create a username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
              <input
                type="text"
                id="firstnameInput"
                placeholder="Enter first Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <input
                type="text"
                id="lastnameInput"
                placeholder="Enter last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
              <input
                id="ageInput"
                type="number"
                placeholder="Enter your age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
              />
              <select
                id="genderInput"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="" disabled selected>
                  Select Gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              <input
                type="text"
                id="locationInput"
                placeholder="Where you live ?"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
              <input
                type="text"
                id="interestsInput"
                placeholder="Your interests ?"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                required
              />
              <textarea
                id="profileBioInput"
                placeholder="Add bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                required
              />
              <button id="saveProfileData" type="submit">
                SAVE
              </button>
            </form>
            <button id="cancelProfileBtn" onClick={handleCancelCreation}>
              CANCEL THIS ACTION !!
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default UserAuthentication;
