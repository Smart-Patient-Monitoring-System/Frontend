import React from "react";
import { Link } from "react-router-dom";
import sup from "../../assets/images/sup.jpg";
import FormRow from "../../components/signup/FormRow";

export default function SignupPageAdmin() {
  return (
    <div
      className="relative w-full min-h-screen bg-cover bg-center flex items-center justify-center p-4 sm:p-6"
      style={{ backgroundImage: `url(${sup})` }}
    >
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/40"></div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-[1600px] flex flex-col lg:flex-row gap-6">

        {/* LEFT CARD */}
        <div className="
          w-full lg:w-1/2
          bg-white/20 backdrop-blur-xl
          border border-white/30
          shadow-[0_8px_40px_rgba(0,0,0,0.25)]
          rounded-[36px] lg:rounded-[56px]
          p-6 sm:p-8 md:p-10
          flex flex-col
        ">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-light mb-8 tracking-wide text-white">
            Admin’s Sign Up
          </h1>

          <div className="flex flex-col gap-5 w-full">
            <FormRow label="Name" />
            <FormRow label="Date of Birth" type="date" />
            <FormRow label="Address" />
            <FormRow label="E-Mail" type="email" />
            <FormRow label="NIC No" />

            {/* Gender */}
            <FormRow label="Gender">
  <div className="flex items-center gap-6 h-11">
    <label className="flex items-center gap-2 text-white/80">
      <input type="radio" name="gender" className="accent-[#00BAC5]" />
      Male
    </label>

    <label className="flex items-center gap-2 text-white/80">
      <input type="radio" name="gender" className="accent-[#00BAC5]" />
      Female
    </label>
  </div>
</FormRow>


            <FormRow label="Contact No" />
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="
          w-full lg:w-1/2
          bg-white/20 backdrop-blur-xl
          border border-white/30
          shadow-[0_8px_40px_rgba(0,0,0,0.25)]
          rounded-[36px] lg:rounded-[56px]
          p-6 sm:p-8 md:p-10
          flex flex-col justify-between
          min-h-[520px] max-h-[75vh]
        ">
          {/* Scrollable form */}
          <div className="flex flex-col gap-5 overflow-y-auto pr-2">
            <FormRow label="User Name" />
            <FormRow label="Password" type="password" />
            <FormRow label="Confirm Password" type="password" />
            <FormRow label="Contact No" />
          </div>

          {/* Actions */}
          <div className="flex flex-col items-center mt-6 gap-4">
            <button className="
              w-full sm:w-2/3 lg:w-[260px]
              h-12 sm:h-[58px]
              bg-gradient-to-r from-[#0090EE] to-[#00BAC5]
              rounded-full shadow-lg
              transition-all duration-300
              hover:scale-[1.04] hover:shadow-xl
              text-white text-lg font-semibold
            ">
              Sign Up
            </button>

            <p className="text-sm text-white/80">
              Already have an account?{" "}
              <Link
                to="/adminLogin"
                className="text-[#7DDFFF] font-semibold hover:underline"
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
