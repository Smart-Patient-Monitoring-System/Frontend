import React from 'react';
import doctor from "../../assets/images/doctor.png";
import patient from "../../assets/images/patient.png";
import admin from "../../assets/images/admin.png";
import gtMark from "../../assets/images/gtMark.png";
import { Link } from 'react-router-dom';

export default function RoleSelect() {
    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-[#F8FBFF] to-[#EEF6FF] flex flex-col overflow-x-hidden">

            {/* Header with HOME button */}
            <div className="w-full px-6 py-4">
                <Link to="/">
                    <button className="relative w-[110px] h-[40px] rounded-full bg-gradient-to-r from-[#057EF8] to-[#0DC0BD] flex items-center justify-center pl-9 hover:shadow-lg hover:scale-105 transition-all duration-300 shadow-md">
                        <img src={gtMark} alt="gt mark" className="absolute top-1 left-1 w-[32px] h-[32px] object-cover rounded-full" />
                        <span className="font-inter font-semibold text-[14px] text-white tracking-wide">HOME</span>
                    </button>
                </Link>
            </div>

            {/* Main content centered */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
                
                {/* Page title */}
                <h1 className="font-inter font-bold text-[32px] md:text-[36px] mb-2 text-gray-800">
                    Select Your Role
                </h1>

                {/* Subtitle */}
                <p className="font-inter font-light text-[16px] md:text-[18px] text-gray-600 mb-10">
                    Choose your role to continue to the portal
                </p>

                {/* Cards grid */}
                <div className="w-full max-w-[1000px] grid grid-cols-1 md:grid-cols-3 gap-6 px-4">

                    {/* Doctor Card */}
                    <Link to="/doctorLogin" className="w-full group">
                        <div className="bg-[#E9FCF9] rounded-3xl p-6 flex flex-col items-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer h-[280px] justify-between shadow-lg border border-[#00A696]/10">
                            <div className="w-24 h-24 bg-gradient-to-br from-[#00A696] to-[#00C9B7] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <img src={doctor} alt="Doctor" className="w-16 h-16 object-contain filter brightness-0 invert" />
                            </div>
                            <div className="flex flex-col items-center">
                                <h3 className="font-inter font-bold text-[24px] mb-2 text-gray-800">Doctor</h3>
                                <p className="font-inter text-[14px] text-center text-gray-600 leading-relaxed">Monitor patients and manage care</p>
                            </div>
                        </div>
                    </Link>

                    {/* Patient Card */}
                    <Link to="/patientLogin" className="w-full group">
                        <div className="bg-[#EBF3FE] rounded-3xl p-6 flex flex-col items-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer h-[280px] justify-between shadow-lg border border-[#2273FF]/10">
                            <div className="w-24 h-24 bg-gradient-to-br from-[#2273FF] to-[#4A90FF] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <img src={patient} alt="Patient" className="w-16 h-16 object-contain filter brightness-0 invert" />
                            </div>
                            <div className="flex flex-col items-center">
                                <h3 className="font-inter font-bold text-[24px] mb-2 text-gray-800">Patient</h3>
                                <p className="font-inter text-[14px] text-center text-gray-600 leading-relaxed">Access your health records and vitals</p>
                            </div>
                        </div>
                    </Link>

                    {/* Admin Card */}
                    <Link to="/adminLogin" className="w-full group">
                        <div className="bg-[#F7F3FF] rounded-3xl p-6 flex flex-col items-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer h-[280px] justify-between shadow-lg border border-[#A538FF]/10">
                            <div className="w-24 h-24 bg-gradient-to-br from-[#A538FF] to-[#C066FF] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <img src={admin} alt="Admin" className="w-16 h-16 object-contain filter brightness-0 invert" />
                            </div>
                            <div className="flex flex-col items-center">
                                <h3 className="font-inter font-bold text-[24px] mb-2 text-gray-800">Admin</h3>
                                <p className="font-inter text-[14px] text-center text-gray-600 leading-relaxed">System management and analytics</p>
                            </div>
                        </div>
                    </Link>

                </div>
            </div>
        </div>
    );
}