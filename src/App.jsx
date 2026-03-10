import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Components/Layout/Layout";
import Home from "./Components/Home/Home";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import Notfound from "./Components/Notfound/Notfound";
import { HeroUIProvider } from "@heroui/react";
import Profile from "./Components/Profile/Profile";
import AuthContextProvider from "./Context/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import AntiProtectedRoute from "./Components/AntiProtectedRoute/AntiProtectedRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PostDetails from "./Components/PostDetails/PostDetails";
import { ToastContainer } from "react-toastify";
import UserProfile from "./Components/UserProfile/UserProfile";
import MyProfile from "./Components/Profile/Profile";

const router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "home",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "login",
        element: (
          <AntiProtectedRoute>
            <Login />
          </AntiProtectedRoute>
        ),
      },
      {
        path: "register",
        element: (
          <AntiProtectedRoute>
            <Register />
          </AntiProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <MyProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "postDetails/:id",
        element: (
          <ProtectedRoute>
            <PostDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "userProfile/:userId",
        element: (
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        ),
      },
      { path: "*", element: <Notfound /> },
    ],
  },
]);

const queryClientConfig = new QueryClient();

export default function App() {
  return (
    <>
      <QueryClientProvider client={queryClientConfig}>
        <AuthContextProvider>
          <HeroUIProvider>
            <RouterProvider router={router} />
            <ToastContainer />
          </HeroUIProvider>
        </AuthContextProvider>
      </QueryClientProvider>
    </>
  );
}
