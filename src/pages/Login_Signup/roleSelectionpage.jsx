import React from 'react';
import Cart from '../../components/login/cart';
import doctor from "../../assets/images/doctor.png";
import patient from "../../assets/images/patient.png";
import admin from "../../assets/images/admin.png";
import nurse from "../../assets/images/nurse.png";
import gtMark from "../../assets/images/gtMark.png";
import { Link } from 'react-router-dom';

export default function RoleSelect() {
    return (
        <div className="min-h-screen w-full bg-[#F8FBFF] flex flex-col items-center pt-6 px-4 sm:px-8">

            {/* HOME button */}
<div className="w-full flex justify-start mb-6 px-4 sm:px-6 md:px-8">
  <Link to="/">
    <button
      className="relative w-[140px] sm:w-[160px] md:w-[180px] h-[45px] sm:h-[51px] rounded-full 
      bg-gradient-to-r from-[#057EF8] to-[#0DC0BD] flex items-center justify-center 
      pl-12 sm:pl-14 md:pl-16 scale-100 hover:scale-105 
      transition-transform duration-300 cursor-pointer"
    >
      <img
        src={gtMark}
        alt="gt mark"
        className="absolute top-0 left-0 w-[40px] sm:w-[50px] md:w-[55px] h-[40px] sm:h-[50px] md:h-[55px] object-cover rounded-md"
      />
      <span className="font-inter font-medium text-[20px] sm:text-[24px] md:text-[28px] leading-[100%] tracking-[0%] text-white">
        HOME
      </span>
    </button>
  </Link>
</div>


            {/* Page title */}
            <div className="text-center mb-2 px-4 sm:px-0">
                <span className="font-inter font-bold text-[24px] sm:text-[28px] md:text-[32px] lg:text-[36px] leading-[100%] tracking-[0%]">
                    Select Your Role
                </span>
            </div>

            {/* Subtitle */}
            <div className="text-center mb-10 px-4 sm:px-0">
                <span className="font-inter font-light text-[18px] sm:text-[24px] md:text-[28px] lg:text-[32px] leading-[100%] tracking-[0%]">
                    Choose your role to continue to the portal
                </span>
            </div>

            {/* Cards grid */}
            <div className="w-full max-w-[1280px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 px-4 sm:px-6 lg:px-0 justify-items-center">

                <div className="w-full flex justify-center scale-95 sm:scale-100 md:scale-100 
                hover:scale-105 transition-transform duration-300 cursor-pointer">
                    <Link to="/doctorLogin">
                        <Cart
                            image={doctor}
                            text1="Doctor"
                            text2="Monitor patients and manage care"
                            bgMain="bg-[#E9FCF9]"
                            bgCircle="bg-[#00A696]"
                        />
                    </Link>
                </div>

                <div className="w-full flex justify-center scale-95 sm:scale-100 md:scale-100 
                hover:scale-105 transition-transform duration-300 cursor-pointer">
                    <Link to="/patientLogin">
                        <Cart
                            image={patient}
                            text1="Patient"
                            text2="System management and analytics"
                            bgMain="bg-[#EBF3FE]"
                            bgCircle="bg-[#2273FF]"
                        />
                    </Link>
                </div>

                <div className="w-full flex justify-center scale-95 sm:scale-100 md:scale-100 
                hover:scale-105 transition-transform duration-300 cursor-pointer">
                    <Link to="/nurseLogin">
                        <Cart
                            image={nurse}
                            text1="Nurse"
                            text2="Monitor patients and manage care"
                            bgMain="bg-[#E8F0B6]"
                            bgCircle="bg-[#B5A738]"
                        />
                    </Link>
                </div>

                <div className="w-full flex justify-center scale-95 sm:scale-100 md:scale-100 
                hover:scale-105 transition-transform duration-300 cursor-pointer">
                    <Link to="/adminLogin">
                        <Cart
                            image={admin}
                            text1="Admin"
                            text2="Access your health records and vitals"
                            bgMain="bg-[#F7F3FF]"
                            bgCircle="bg-[#A538FF]"
                        />
                    </Link>
                </div>


            </div>
        </div>
    );
}
