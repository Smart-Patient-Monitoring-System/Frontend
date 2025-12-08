import React from 'react'
import Cart from '../../components/login/cart'
import doctor from "../../assets/images/doctor.png";
import patient from "../../assets/images/patient.png";
import admin from "../../assets/images/admin.png";
import nurse from "../../assets/images/nurse.png";
import gtMark from "../../assets/images/gtMark.png";

export default function RoleSelect() {
    return (
        <div className="
            w-[1920px] h-[1080px]
            border border-black bg-[#F8FBFF]
            flex items-center justify-center relative
        ">


            <div className="absolute top-[31px] left-[160px] w-[160px] h-[51px]   flex items-center justify-center rounded-md">
                <button className="relative w-[160px] h-[51px] rounded-[51px] bg-gradient-to-r from-[#057EF8] to-[#0DC0BD] flex items-center justify-center pl-[54px]">
                    <img
                        src={gtMark}
                        alt="gt mark"
                        className="absolute top-0 left-0 w-[50px] h-[50px] object-cover rounded-md"
                    />
                    <span className="font-inter font-medium text-[24px] leading-[100%] tracking-[0%] text-white">
                        HOME
                    </span>
                </button>
            </div>


            <div className="absolute top-[100px] left-[640px] w-[640px] h-[44px]  flex items-center justify-center">
                <span className="font-inter font-bold text-[36px] leading-[100%] tracking-[0%] text-center">
                    Select Your Role
                </span>
            </div>
            <div className="absolute top-[153px] left-[479px] w-[960px] h-[39px] flex items-center justify-center">
                <span className="font-inter font-light text-[32px] leading-[100%] tracking-[0%] text-center">
                    Choose your role to continue to the portal
                </span>
            </div>


            <div>
                <div className="absolute top-[260px] left-[320px] w-[480px] h-[350px]   flex items-center justify-center rounded-md">
                    <Cart
                        image={doctor}
                        text1="Doctor"
                        text2="Monitor patients and manage care"
                        bgMain="bg-[#E9FCF9]"
                        bgCircle="bg-[#00A696]"
                    />
                </div>
                <div className="absolute top-[260px] left-[1120px] w-[480px] h-[350px]   flex items-center justify-center rounded-md">
                    <Cart
                        image={patient}
                        text1="Patient"
                        text2="System management and analytics"
                        bgMain="bg-[#EBF3FE]"
                        bgCircle="bg-[#2273FF]"
                    />

                </div>
                <div className="absolute top-[657px] left-[320px] w-[480px] h-[350px]   flex items-center justify-center rounded-md">
                    <Cart
                        image={nurse}
                        text1="Nurse"
                        text2="Monitor patients and manage care"
                        bgMain="bg-[#E8F0B6]"
                        bgCircle="bg-[#B5A738]"
                    />
                </div>
                <div className="absolute top-[657px] left-[1120px] w-[480px] h-[350px]  flex items-center justify-center rounded-md">
                    <Cart
                        image={admin}
                        text1="Admin"
                        text2="Access your health records and vitals"
                        bgMain="bg-[#F7F3FF]"
                        bgCircle="bg-[#A538FF]"
                    />
                </div>
            </div>
        </div>
    )
}
