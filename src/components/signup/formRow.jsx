export default function FormRow({ label, type = "text", children }) {
  return (
    <div className="
      flex items-center
      w-full
      min-h-[56px]
      gap-3
    ">
      {/* Label */}
      <span className="
        text-white/90
        text-[15px] sm:text-[16px] md:text-[17px]
        w-[30%]
      ">
        {label}
      </span>

      {/* Input / Custom Field */}
      <div className="w-[70%]">
        {children ? (
          children
        ) : (
          <input
  type={type}
  className="
    w-full h-11
    bg-white/35 backdrop-blur-md
    rounded-full px-5
    border border-white/40

    text-gray-900 font-medium
    caret-gray-900
    placeholder-gray-600

    focus:outline-none
    focus:ring-2 focus:ring-[#00BAC5]/50
    focus:bg-white/45

    transition-all duration-200
  "
/>


        )}
      </div>
    </div>
  );
}
