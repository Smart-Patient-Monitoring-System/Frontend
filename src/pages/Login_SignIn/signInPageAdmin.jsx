import React from 'react';
import sup from "../../assets/images/sup.jpg";
import FormRow from '../../components/signin/FormRow';

export default function SignInPageAdmin() {
    return (
        <div
            className="w-full min-h-screen flex flex-col lg:flex-row items-center justify-center bg-cover bg-center p-4 sm:p-6"
            style={{ backgroundImage: `url(${sup})` }}
        >
            {/* Left Card */}
            <div className="
                w-full sm:w-[90%] md:w-[85%] lg:w-[48%] 
                bg-[#D9D9D9] 
                rounded-[32px] sm:rounded-[48px] md:rounded-[64px] lg:rounded-[80px]  /* slightly more rounded */
                opacity-80 
                p-8 sm:p-10 md:p-12 lg:p-16 
                m-1 sm:m-2  /* reduced gap between cards */
                flex flex-col
            ">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extralight mb-6 sm:mb-8">
                    Admin’s Sign Up
                </h1>

                <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 w-full">
                    <FormRow label="Name" />
                    <FormRow label="Date of Birth" />
                    <FormRow label="Address" />
                    <FormRow label="E-Mail" />
                    <FormRow label="NIC No" />

                    <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 sm:gap-4">
                        <span className="text-lg sm:text-xl md:text-2xl font-bold w-full sm:w-auto">Gender</span>
                        <label className="flex items-center gap-2 text-sm sm:text-lg md:text-xl font-bold">
                            <input type="radio" name="gender" className="w-5 h-5 sm:w-6 sm:h-6" />
                            Male
                        </label>
                        <label className="flex items-center gap-2 text-sm sm:text-lg md:text-xl font-bold">
                            <input type="radio" name="gender" className="w-5 h-5 sm:w-6 sm:h-6" />
                            Female
                        </label>
                    </div>
                    <FormRow label="Contact No" />
                </div>
            </div>

            {/* Right Card */}
            <div className="
                w-full sm:w-[90%] md:w-[85%] lg:w-[48%] 
                bg-[#D9D9D9] 
                rounded-[32px] sm:rounded-[48px] md:rounded-[64px] lg:rounded-[80px]  /* slightly more rounded */
                opacity-80 
                p-10 sm:p-10 md:p-14 lg:p-20
                m-1 sm:m-2  /* reduced gap between cards */
                flex flex-col justify-between   
                max-h-[720px] lg:h-[720px]     
            ">
                {/* Scrollable content */}
                <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 w-full overflow-y-auto">
                    <FormRow label="User Name" />
                    <FormRow label="Password" />
                    <FormRow label="Confirm Password" />
                    <FormRow label="Contact No" />
                </div>

                {/* Sign Up Button at bottom */}
                <div className="flex justify-center mt-4 w-full">
                    <button className="
                        w-full sm:w-2/3 lg:w-[273px] 
                        h-12 sm:h-[65px] 
                        bg-gradient-to-r from-[#0090EE] to-[#00BAC5] 
                        rounded-full shadow-md 
                        flex items-center justify-center
                        transform transition-transform duration-200 ease-in-out
                        hover:scale-105
                    ">
                        <span className="text-white text-lg sm:text-2xl md:text-3xl font-semibold text-center">
                            Sign Up
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}
