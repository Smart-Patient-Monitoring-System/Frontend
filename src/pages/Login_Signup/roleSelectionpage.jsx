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
        <div className="min-h-screen w-full bg-[#F8FBFF] flex flex-col items-center
                        pt-6 pb-6 sm:pb-8 md:pb-10 px-4 sm:px-8">

            {/* HOME button */}
            <div className="w-full flex justify-start mb-6 px-4 sm:px-6 md:px-8">
                <Link to="/">
                    <button
                        className="
                            relative w-[140px] sm:w-[160px] md:w-[170px] lg:w-[150px] xl:w-[140px] h-[45px] sm:h-[50px] md:h-[48px] lg:h-[42px] xl:h-[40px]
                            rounded-full bg-gradient-to-r from-[#057EF8] to-[#0DC0BD] flex items-center px-3 sm:px-4 text-sm md:text-base
                            lg:text-sm font-semibold text-white hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
                    >
            {/* Left icon space */}
                    <div className="w-[26px] sm:w-[28px] flex justify-center">
                        <img
                        src={gtMark}
                        alt="gt mark"
                        className="
                            w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] lg:w-[16px] lg:h-[16px] object-contain"
                        />
                    </div>

            {/* Center text */}
                    <span className="flex-1 text-center font-inter font-medium">
                        HOME
                    </span>

            {/* Right balance space */}
                    <div className="w-[26px] sm:w-[28px]" />
                </button>
            </Link>
            </div>


            {/* Page title */}
            <div className="text-center mb-2 px-4 sm:px-0">
                <span className="font-inter font-bold text-[16px] sm:text-[20px] md:text-[24px] lg:text-[28px] leading-[100%] tracking-[0%]">
                    Select Your Role
                </span>
            </div>

            {/* Subtitle */}
            <div className="text-center mb-10 px-4 sm:px-0">
                <span className="font-inter font-light text-[12px] sm:text-[16px] md:text-[20px] lg:text-[24px] leading-[100%] tracking-[0%]">
                    Choose your role to continue to the portal
                </span>
            </div>

            {/* Cards grid */}
            <div className="w-full max-w-[1200px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 px-4 sm:px-6 lg:px-0 justify-items-center">

                <div className="w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[55%] flex justify-center
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

                <div className="w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[55%] flex justify-center
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

                <div className="w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[55%] flex justify-center
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

                <div className="w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[55%] flex justify-center
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
