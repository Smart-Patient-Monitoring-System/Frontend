export default function FormRow({ label, name, type = "text", value, onChange, required, placeholder }) {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
            {/* Label */}
            <span className="font-bold text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] xl:text-[24px] w-full sm:w-[30%] md:w-[28%] lg:w-[26%] text-left">
                {label} {required && <span className="text-red-500">*</span>}
            </span>

            {/* Input */}
            <input
                type={type}
                name={name}
                value={value || ''}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="
          w-full sm:w-[65%] md:w-[70%] lg:w-[78%] xl:w-[74%]
          h-10 md:h-11 lg:h-12
          bg-white 
          rounded-full px-4
          border border-[#D9D9D9]
          outline-none focus:border-[#0090EE]
        "
            />
        </div>
    );
}
