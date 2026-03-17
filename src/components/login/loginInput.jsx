import React from 'react';

export default function LoginInput({ label }) {
    return (
        <>
            {/* Label */}
            <div className="absolute left-[16px] top-[374px] w-[169px] h-[29px] flex items-center justify-center">
                <span className="font-inter font-medium text-[24px] leading-[100%] tracking-[0%] text-center text-[#0A0000]">
                    {label}
                </span>
            </div>

            {/* Input panel */}
            <div className="absolute left-[44px] top-[437px] w-[706px] h-[60px] rounded-[12px] bg-[#F3F3F5] border border-[#7D7D7D] flex items-center px-4">
                <input
                    type="text"
                    placeholder="Enter text here..."
                    className="w-full h-full bg-transparent outline-none text-[#000] text-lg sm:text-xl placeholder:text-[#7D7D7D]"
                />
            </div>
        </>
    );
}
