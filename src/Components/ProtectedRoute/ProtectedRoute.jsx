import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { authContext } from "../../Context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticatedUser } = useContext(authContext);

  return (
    <>
      {isAuthenticatedUser ? children : <Navigate to={"/linked-posts/login"} />}
    </>
  );
}
