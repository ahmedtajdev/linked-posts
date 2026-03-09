import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { authContext } from "../../Context/authContext";

export default function AntiProtectedRoute({ children }) {
  const { isAuthenticatedUser } = useContext(authContext);
  return <>{isAuthenticatedUser ? <Navigate to={"/home"} /> : children}</>;
}
