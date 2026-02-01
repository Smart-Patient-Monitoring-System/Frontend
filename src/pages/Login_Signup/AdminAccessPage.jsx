import React from "react";
import { useNavigate } from "react-router-dom";
import gtMark from "../../assets/images/gtMark.png";
import heart from "../../assets/images/heart.png";
import admin from "../../assets/images/admin.png";

export default function AdminAccessPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#F8FBFF] to-[#EEF6FF] flex items-center justify-center px-4">
      <div className="w-full max-w-[600px]">
        {/* Home Button */}
        <button
          onClick={() => navigate("/")}
          className="relative w-[120px] h-[42px] rounded-full 
            bg-gradient-to-r from-[#057EF8] to-[#0DC0BD]
            flex items-center justify-center pl-9
            hover:scale-105 transition-all shadow-md mb-8"
        >
          <img
            src={gtMark}
            alt="Home"
            className="absolute left-1 top-1 w-[34px] h-[34px] rounded-full"
          />
          <span className="text-white font-semibold">HOME</span>
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-10">
          <div className="flex items-center justify-center mb-6">
            <div className="w-[120px] h-[120px] rounded-3xl 
              bg-gradient-to-tr from-[#A538FF] to-[#C066FF] 
              shadow-xl flex items-center justify-center">
              <img src={admin} alt="Admin" className="w-[80px] filter invert" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
            System Administration
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Authorized access only
          </p>

          {/* Options */}
          <div className="space-y-4">
            <button
              onClick={() => navigate("/adminLogin")}
              className="w-full h-[56px] rounded-full bg-gradient-to-r from-[#A538FF] to-[#C066FF]
                text-white font-semibold text-lg hover:scale-105 transition shadow-lg
                flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Login to Admin Portal
            </button>

            <button
              onClick={() => navigate("/adminSignup")}
              className="w-full h-[56px] rounded-full bg-white border-2 border-[#A538FF]
                text-[#A538FF] font-semibold text-lg hover:bg-[#F7F3FF] transition shadow-md
                flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Admin Account
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              This is a restricted area. Unauthorized access is prohibited.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
