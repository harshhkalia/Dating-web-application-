import react from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserAuthentication from "./components/Authentication/UserAuthentication";
import Home from "./components/home/Home";
import { UserProvider } from "./UserContext";
import Profile from "./components/profile/Profile";
import Messages from "./components/messages/Messages";

const App = () => {
  return (
    <>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<UserAuthentication />} />
            <Route path="/home" element={<Home />} />
            <Route path="/viewprofile" element={<Profile />} />
            <Route path="/inbox" element={<Messages />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </>
  );
};

export default App;
