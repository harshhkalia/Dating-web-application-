import React, { createContext, useState, useEffect } from "react";

export const userContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);

  return (
    <userContext.Provider
      value={{
        userId,
        setUserId,
      }}
    >
      {children}
    </userContext.Provider>
  );
};
