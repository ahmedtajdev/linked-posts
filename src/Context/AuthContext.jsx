import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
export const authContext = createContext();

export default function AuthContextProvider({ children }) {
  const [userToken, setUserToken] = useState(() =>
    localStorage.getItem("userToken"),
  ); // lazy initialization
  const isAuthenticatedUser = !!userToken; // derived state
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  function setAuthenticatedUserToken(tkn) {
    setUserToken(tkn);
  }

  function clearUserToken() {
    setUserToken(null);
  }

  function decodeUserToken() {
    const decodedUserToken = jwtDecode(userToken);
    setLoggedInUserId(decodedUserToken.user);
    
  }

  useEffect(() => {
    userToken && decodeUserToken();
  }, [userToken]);
	
  return (
    <authContext.Provider
      value={{
        userToken,
        isAuthenticatedUser,
        loggedInUserId,
        setAuthenticatedUserToken,
        clearUserToken,
      }}
    >
      {children}
    </authContext.Provider>
  );
}
