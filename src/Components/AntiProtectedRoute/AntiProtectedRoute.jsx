import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { authContext } from "../../Context/AuthContext";

export default function AntiProtectedRoute({ children }) {
  const { isAuthenticatedUser } = useContext(authContext);
  return (
    <>
      {isAuthenticatedUser ? <Navigate to={"/home"} /> : children}
    </>
  );
}
