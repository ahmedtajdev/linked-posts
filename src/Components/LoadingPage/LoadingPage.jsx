import React from "react";
import { RotatingLines } from "react-loader-spinner";

export default function LoadingPage() {
  return (
    <div className="h-screen flex justify-center items-center">
      <RotatingLines
        visible={true}
        height="40"
        width="40"
        color="#155DFC"
        strokeWidth="5"
        animationDuration="0.75"
        ariaLabel="rotating-lines-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
}
