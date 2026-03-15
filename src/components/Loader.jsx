import React from "react";
import logo from "../assets/images/smartcare-logo.png";

function Loader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-[9999]">
      
      {/* Logo */}
      <img
        src={logo}
        alt="SmartCare Monitor"
        className="w-32 animate-pulseLogo"
      />

      {/* Text */}
      <h1 className="mt-4 text-2xl font-semibold text-teal-600 tracking-wide">
        SmartCare Monitor
      </h1>

      {/* Loading dots */}
      <div className="flex gap-2 mt-4">
        <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"></span>
        <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce delay-150"></span>
        <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce delay-300"></span>
      </div>

    </div>
  );
}

export default Loader;