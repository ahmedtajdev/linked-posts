import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../Footer/Footer";
import MyNavbar from "../Navbar/Navbar";

export default function Layout() {
  return (
    <>
      <MyNavbar />
      <div className="container w-[95%] md:w-[80%] mx-auto min-h-screen">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
