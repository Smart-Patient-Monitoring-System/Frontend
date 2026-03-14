import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "./assets/images/smartcare-logo.png";

function Header() {
  const navigate = useNavigate();

  return (
    <header className="bg-gradient-to-r from-teal-600 to-cyan-600 px-4 sm:px-6 lg:px-8 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2 sm:gap-3">
          <img 
            src={logo} 
            alt="Logo" 
            className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 object-contain flex-shrink-0"
          />
          <div>
            <h1 className="text-white text-lg sm:text-xl lg:text-2xl font-bold">
              SmartCare Monitor
            </h1>
            <p className="text-teal-100 text-xs sm:text-sm">
              AI-Powered Healthcare
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/role-selection")}
          className="bg-white text-teal-600 px-4 sm:px-6 py-2 rounded-lg font-semibold text-sm hover:bg-teal-50 transition-colors flex items-center gap-2"
        >
          LOGIN
        </button>

      </div>
    </header>
  );
}

export default Header;
