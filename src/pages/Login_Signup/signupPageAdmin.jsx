import React from 'react';
import { Link } from "react-router-dom";
import sup from "../../assets/images/sup.jpg";
import FormRow from '../../components/signup/FormRow';

export default function SignupPageAdmin() {
    return (
        <div
            className="relative w-full min-h-screen bg-cover bg-center flex items-center justify-center p-4 sm:p-6"
            style={{ backgroundImage: `url(${sup})` }}
        >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/30"></div>

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-[1600px] flex flex-col lg:flex-row gap-4">

                {/* LEFT CARD */}
                <div className="
                    w-full lg:w-1/2
                    bg-white/85 backdrop-blur-md
                    shadow-2xl border border-white/40
                    rounded-[32px] sm:rounded-[48px] lg:rounded-[64px]
                    p-6 sm:p-8 md:p-10
                    flex flex-col
                ">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-light mb-6 tracking-wide">
                        Admin’s Sign Up
                    </h1>

                    <div className="flex flex-col gap-4 w-full">
                        <FormRow label="Name" />
                        <FormRow label="Date of Birth" />
                        <FormRow label="Address" />
                        <FormRow label="E-Mail" />
                        <FormRow label="NIC No" />

                        <div className="flex flex-wrap items-center gap-4">
                            <span className="text-lg md:text-xl font-semibold">
                                Gender
                            </span>
                            <label className="flex items-center gap-2 text-base font-medium">
                                <input type="radio" name="gender" className="w-5 h-5 accent-[#00BAC5]" />
                                Male
                            </label>
                            <label className="flex items-center gap-2 text-base font-medium">
                                <input type="radio" name="gender" className="w-5 h-5 accent-[#00BAC5]" />
                                Female
                            </label>
                        </div>

                        <FormRow label="Contact No" />
                    </div>
                </div>

                {/* RIGHT CARD */}
                <div className="
                    w-full lg:w-1/2
                    bg-white/85 backdrop-blur-md
                    shadow-2xl border border-white/40
                    rounded-[32px] sm:rounded-[48px] lg:rounded-[64px]
                    p-6 sm:p-8 md:p-10
                    flex flex-col justify-between
                    min-h-[520px] max-h-[75vh]
                ">
                    {/* Scrollable form area */}
                    <div className="flex flex-col gap-4 overflow-y-auto pr-2">
                        <FormRow label="User Name" />
                        <FormRow label="Password" />
                        <FormRow label="Confirm Password" />
                        <FormRow label="Contact No" />
                    </div>

                    {/* Button + Login Link */}
                    <div className="flex flex-col items-center mt-4 mb-4 gap-3">
                        <button className="
                            w-full sm:w-2/3 lg:w-[260px]
                            h-12 sm:h-[60px]
                            bg-gradient-to-r from-[#0090EE] to-[#00BAC5]
                            rounded-full shadow-lg
                            flex items-center justify-center
                            transition-all duration-200
                            hover:scale-105 hover:shadow-xl
                        ">
                            <span className="text-white text-lg sm:text-xl font-semibold">
                                Sign Up
                            </span>
                        </button>

                        <p className="text-sm sm:text-base text-gray-700">
                            Already have an account?{" "}
                            <Link
                                to="/adminLogin"
                                className="text-[#0090EE] font-semibold hover:underline"
                            >
                                Login
                            </Link>
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
