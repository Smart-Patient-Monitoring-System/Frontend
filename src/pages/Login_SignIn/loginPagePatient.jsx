import React from "react";
import gtMark from "../../assets/images/gtMark.png";
import heart from "../../assets/images/heart.png";
import patient from "../../assets/images/patient.png";

export default function LoginPagePatient() {
    return (
        <div className="w-full min-h-screen bg-[#F8FBFF] flex justify-center items-center p-4">
            <div className="w-full max-w-[1800px] grid grid-cols-1 lg:grid-cols-2 gap-10">

                <div className="flex flex-col items-center lg:items-start gap-10 p-4">

                    <button className="relative w-[140px] h-[48px] sm:w-[160px] sm:h-[51px] rounded-full bg-gradient-to-r from-[#057EF8] to-[#0DC0BD] flex items-center justify-center pl-10">
                        <img
                            src={gtMark}
                            alt="gt mark"
                            className="absolute left-0 w-[45px] h-[45px]"
                        />
                        <span className="text-white font-medium text-lg sm:text-2xl">HOME</span>
                    </button>

                    <div className="w-[150px] h-[150px] sm:w-[215px] sm:h-[205px] rounded-3xl bg-gradient-to-tr from-[#0DC0BD] to-[#057EF8] shadow-[0_0_8px_8px_#0090EE40] flex justify-center items-center">
                        <img src={heart} alt="heart" className="w-[120px] sm:w-[162px]" />
                    </div>

                    <div className="text-center lg:text-left">
                        <p className="text-4xl sm:text-6xl font-extralight">WELCOME!</p>
                        <p className="text-xl sm:text-3xl font-extralight mt-2">
                            Sign in to access your dashboard
                        </p>
                    </div>

                    <div className="w-full max-w-[520px] bg-[#EBF3FE] rounded-3xl shadow-xl p-6 relative">
                        <div className="flex items-center gap-6">
                            <div className="w-[85px] h-[85px] rounded-full bg-[#2273FF] shadow-[0_0_20px_rgba(0,0,0,0.25)] flex items-center justify-center">
                                <img src={patient} alt="Patient" className="w-[45px] h-[45px]" />
                            </div>
                            <div>
                                <p className="text-3xl font-medium text-center md:text-left">Patient</p>
                                <p className="text-lg font-light">
                                    System management and analytics
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="w-full max-w-[520px] h-[50px] bg-[#F5F1F1] rounded-2xl shadow-md flex items-center justify-center 
                scale-100 hover:scale-105 transition-transform duration-300 cursor-pointer">
                        <span className="text-xl font-semibold">SignUp</span>
                    </div>
                </div>

                <hr
                    className="
    hidden
    lg:block
    absolute left-1/2 top-1/2 
    w-[1102px] 
    border-t border-black 
    rotate-90 
    -translate-x-1/2 -translate-y-1/2
  "
                />

                <div className="flex justify-center p-4">
                    <div className="w-full max-w-[650px] bg-white rounded-[40px] shadow-2xl p-8 sm:p-10">
                        <h1 className="text-3xl sm:text-4xl font-normal mb-3 text-left">Login</h1>
                        <p className="text-lg font-light mb-20 text-left">
                            Enter your credentials to continue
                        </p>

                        <label className="text-xl font-medium text-left block">
                            User Name
                        </label>

                        <input
                            type="text"
                            placeholder="Enter your username"
                            className="w-full h-[60px] bg-[#F3F3F5] border border-[#7D7D7D] rounded-xl px-4 mt-2 mb-10 outline-none"
                        />

                        <label className="text-xl font-medium text-left block">
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            className="w-full h-[60px] bg-[#F3F3F5] border border-[#7D7D7D] rounded-xl px-4 mt-2 mb-10 outline-none"
                        />

                        <button className="w-full h-[65px] rounded-full bg-gradient-to-r from-[#057EF8] to-[#0DC0BD] 
                   flex items-center justify-center 
                   scale-100 hover:scale-105 
                   transition-transform duration-300 cursor-pointer">
                            <span className="text-white text-xl font-medium">Log In</span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
