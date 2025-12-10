import React from 'react';

export default function Cart(props) {
    return (
        <div className={`relative w-[300px] sm:w-[350px] lg:w-[480px] 
                        h-[220px] sm:h-[270px] lg:h-[350px] 
                        rounded-[25px] sm:rounded-[35px] lg:rounded-[50px] 
                        shadow-[0_4px_100px_15px_rgba(0,0,0,0.25)] 
                        flex flex-col items-center pt-6 sm:pt-8 ${props.bgMain}`}>

            {/* Circle with image */}
            <div className={`w-[60px] sm:w-[75px] lg:w-[95px] 
                            h-[60px] sm:h-[75px] lg:h-[95px] 
                            rounded-full shadow-[0_0_30px_4px_rgba(0,0,0,0.25)] 
                            flex items-center justify-center mb-4 ${props.bgCircle}`}>
                <div className="w-[28px] sm:w-[35px] lg:w-[45px] 
                                h-[28px] sm:h-[35px] lg:h-[45px] 
                                rounded-full overflow-hidden flex justify-center items-center">
                    <img src={props.image} alt="Role" className="w-full h-full object-cover" />
                </div>
            </div>

            {/* Title */}
            <div className="w-[160px] sm:w-[200px] lg:w-[245px] 
                            h-[28px] sm:h-[36px] lg:h-[44px] 
                            flex justify-center items-center mb-2">
                <span className="font-inter font-normal text-[20px] sm:text-[28px] lg:text-[36px] leading-[100%] text-center">
                    {props.text1}
                </span>
            </div>

            {/* Description */}
            <div className="w-[180px] sm:w-[240px] lg:w-[320px] 
                            h-[50px] sm:h-[60px] lg:h-[70px] 
                            flex justify-center items-center px-2">
                <span className="font-inter font-extralight text-[14px] sm:text-[18px] lg:text-[24px] leading-[100%] text-center break-words">
                    {props.text2}
                </span>
            </div>

        </div>
    );
}
