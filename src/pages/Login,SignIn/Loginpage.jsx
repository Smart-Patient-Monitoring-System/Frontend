import React from 'react'
import gtMark from "../../assets/images/gtMark.png";
import heart from "../../assets/images/heart.png";
import doctor from "../../assets/images/doctor.png";




export default function Loginpage() {
  return (
    <div className="
        w-[1920px] h-[1080px]
        border border-black bg-[#F8FBFF]
        flex items-center justify-center relative
    ">
      <div className="absolute top-[95px] left-[165px] w-[160px] h-[51px]   flex items-center justify-center rounded-md">
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
      <div
        className=" absolute top-[214px] left-[400px] w-[215px] h-[205px] rounded-[25px] 
                 bg-gradient-to-tr from-[#0DC0BD] to-[#057EF8] shadow-[0_0_4px_11px_#0090EE40] flex justify-center items-center"
      >
        <div className="w-[162px] h-[162px] ">
          <img
            src={heart}
            alt="heart"
            className="w-[162px] h-[162px] object-contain"
          />
        </div>

      </div>
      <div className=" absolute left-[165px] top-[540px] w-[667px] h-[77px]  text-left">
        <span className="font-inter font-extralight text-[64px] leading-[64px] tracking-[0px]">
          WELCOME!
        </span>
      </div>

      <div className="absolute left-[165px] top-[636px] w-[580px] h-[58px]  text-left">
        <span className="font-inter font-extralight text-[32px] leading-[32px] tracking-[0px]">
          Sign in to access your dashboard
        </span>
      </div>

      <div className="flex absolute left-[160px] top-[711px] w-[652px] h-[148px] rounded-[30px] shadow-[0_0_10px_0_#00000040] bg-[#E9FCF9]">


        <div
          className=" absolute top-[27px] left-[39px]
                   w-[95px] h-[95px] rounded-full shadow-[0_0_30px_4px_rgba(0,0,0,0.25)]
                   flex justify-center items-center bg-[#00A696]"
        >
          <div className="w-[45px] h-[45px] overflow-hidden flex justify-center items-center">
            <img src={doctor} alt="Doctor" className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="absolute top-[28px] left-[154px] w-[245px] h-[58px] flex justify-center items-center  p-[10px]">
          <span className="font-inter font-normal text-[48px] leading-[100%] tracking-[0%] text-center">
            Doctor
          </span>
        </div>
        <div className="absolute top-[98px] left-[145px] w-[498px] h-[46px] flex justify-center  items-center  px-2 ">
          <span className="font-inter font-extralight text-[24px] leading-[100%] tracking-[0%] text-center break-words">
            Monitor patients and manage care
          </span>
        </div>


      </div>
      <div className=" flex absolute left-[158px] top-[889px] w-[652px] h-[44px] rounded-[30px] shadow-[0_0_10px_#00000040] bg-[#F5F1F1] justify-center items-center">
        <span className="font-inter font-semibold text-[24px] leading-[100%] tracking-[0%] text-center">
          SignUp
        </span>

      </div>




      <div
        className="
          absolute left-1/2 top-1/2
          w-[1102px] h-0
          border border-black
          -translate-x-1/2 -translate-y-1/2
          rotate-90
        "
      ></div>
      <div className="absolute left-[1072px] top-[214px] w-[789px] h-[734px] rounded-[50px] shadow-[0_0_25px_#00000040] bg-white justify-center">
        <div className=" absolute top-[21px] left-[16px] w-[169px] h-[44px] flex items-center justify-center ">
          <span className="font-inter font-normal text-[36px] leading-[100%] tracking-[0%] text-center">
            Login
          </span>
        </div>
        <div className="absolute top-[84px] left-[44px] w-[499px] h-[46px] flex p-[10px]">
          <span className="font-inter font-extralight text-[24px] leading-[100%] tracking-[0%]">
            Your Text
          </span>
        </div>






        <div className="absolute left-[21px] top-[231px] w-[169px] h-[29px] flex items-center justify-center">
          <span className="font-inter font-medium text-[24px] leading-[100%] tracking-[0%] text-center text-[#0A0000]">
            Your Text
          </span>
        </div>
        <div className="absolute left-[44px] top-[287px] w-[706px] h-[60px] rounded-[12px] bg-[#F3F3F5] border border-[#7D7D7D]">
        </div>

        <div className="absolute left-[16px] top-[374px] w-[169px] h-[29px] flex items-center justify-center">
          <span className="font-inter font-medium text-[24px] leading-[100%] tracking-[0%] text-center text-[#0A0000]">
            Your Text
          </span>
        </div>
        <div className="absolute left-[44px] top-[437px] w-[706px] h-[60px] rounded-[12px] bg-[#F3F3F5] border border-[#7D7D7D]">
        </div>

        <div className="absolute top-[576px] left-[258px] w-[273px] h-[65px]   flex items-center justify-center rounded-md">
          <button className="relative w-[273px] h-[65px] rounded-[51px] bg-gradient-to-r from-[#057EF8] to-[#0DC0BD] flex items-center justify-center ">

            <span className="font-inter font-medium text-[24px] leading-[100%] tracking-[0%] text-white">
              HOME
            </span>
          </button>
        </div>






      </div>



    </div>
  )
}
