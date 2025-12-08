export default function Cart(props) {
    return (
        <div className={`relative w-[480px] h-[350px] rounded-[50px] shadow-[0_4px_100px_15px_rgba(0,0,0,0.25)] flex justify-center ${props.bgMain}`}>

            <div className={`absolute top-[31px] left-1/2 transform -translate-x-1/2
                w-[95px] h-[95px] rounded-full shadow-[0_0_30px_4px_rgba(0,0,0,0.25)]
                flex justify-center items-center ${props.bgCircle}`}>

                <div className="w-[45px] h-[45px] rounded-full overflow-hidden flex justify-center items-center">
                    <img src={props.image} alt="Doctor" className="w-full h-full object-cover" />
                </div>
            </div>

            <div className="absolute top-[158px] w-[245px] h-[44px] flex justify-center items-center rounded-md">
                <span className="font-inter font-normal text-[36px] leading-[100%] tracking-[0%] text-center">
                    {props.text1}
                </span>
            </div>

            <div className="absolute top-[225px] w-[320px] h-[70px] flex justify-center items-center rounded-md px-2">
                <span className="font-inter font-extralight text-[24px] leading-[100%] tracking-[0%] text-center break-words">
                    {props.text2}
                </span>
            </div>

        </div>
    );
}
