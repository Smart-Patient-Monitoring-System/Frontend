import React from 'react';
import sup from "../../assets/images/sup.jpg";
import FormRow from '../../components/signup/FormRow';

export default function SignupPagePatient() {
    return (
        <div
            className="w-full min-h-screen flex flex-col lg:flex-row items-center justify-center bg-cover bg-center p-4 sm:p-6"
            style={{ backgroundImage: `url(${sup})` }}
        >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/30"></div>

            {/* Content wrapper */}
            <div className="relative z-10 w-full max-w-[1600px] flex flex-col lg:flex-row gap-4">
                {/* Left Card */}
                <div className="
                    w-full lg:w-1/2
                    bg-white/85 backdrop-blur-md
                    shadow-2xl border border-white/40
                    rounded-[32px] sm:rounded-[48px] lg:rounded-[64px]
                    p-6 sm:p-8 md:p-10
                    flex flex-col
                ">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-normal mb-6 text-gray-800">
                        Patient's Sign Up
                    </h1>

                    <div className="flex flex-col gap-4 w-full">
                        <FormRow label="Name" />
                        <FormRow label="Date of Birth" type="date" />
                        <FormRow label="Address" />
                        <FormRow label="E-Mail" type="email" />
                        <FormRow label="NIC No" />

                        <div className="flex flex-wrap items-center gap-4">
                            <span className="text-base sm:text-lg text-gray-700 min-w-[140px]">
                                Gender
                            </span>
                            <label className="flex items-center gap-2 text-base text-gray-600 cursor-pointer">
                                <input type="radio" name="gender" className="w-5 h-5 accent-[#00BAC5]" />
                                Male
                            </label>
                            <label className="flex items-center gap-2 text-base text-gray-600 cursor-pointer">
                                <input type="radio" name="gender" className="w-5 h-5 accent-[#00BAC5]" />
                                Female
                            </label>
                        </div>

                        <FormRow label="Contact No" type="tel" />
                        <FormRow label="Guardian's Name" />
                    </div>
                </div>

                {/* Right Card */}
                <div className="
                    w-full lg:w-1/2
                    bg-white/85 backdrop-blur-md
                    shadow-2xl border border-white/40
                    rounded-[32px] sm:rounded-[48px] lg:rounded-[64px]
                    p-6 sm:p-8 md:p-10
                    flex flex-col justify-between
                    min-h-[520px] max-h-[75vh]
                ">
                    {/* Scrollable content */}
                    <div className="flex flex-col gap-4 overflow-y-auto pr-2">
                        <FormRow label="Guardian's Contact No" type="tel" />
                        <FormRow label="User Name" />
                        <FormRow label="Password" type="password" />
                        <FormRow label="Confirm Password" type="password" />
                        <FormRow label="Blood type" />
                    </div>

                    {/* Sign Up Button at bottom */}
                    <div className="flex justify-center mt-6 mb-4">
                        <button className="
                            w-full sm:w-2/3 lg:w-[260px]
                            h-12 sm:h-[56px]
                            bg-gradient-to-r from-[#0090EE] to-[#00BAC5]
                            rounded-full shadow-md
                            flex items-center justify-center
                            transition-all duration-200
                            hover:scale-[1.02] hover:shadow-lg
                        ">
                            <span className="text-white text-base sm:text-lg font-normal">
                                Sign Up
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}