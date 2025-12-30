import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Hero({ stats }) {
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-br from-teal-50 to-cyan-50 py-12 sm:py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-teal-100 px-3 py-1.5 rounded-full mb-4 sm:mb-6">
            <Sparkles size={16} className="text-teal-600" />
            <span className="text-teal-700 font-medium text-xs sm:text-sm">
              World-Class Healthcare Technology
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight text-balance">
            AI-Driven Smart Patient Monitoring & Awareness System
          </h1>

          <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6 sm:mb-8 text-pretty">
            Next-generation healthcare platform combining IoT sensors, real-time vital monitoring, advanced ECG
            analysis, and AI-powered predictions. Built for modern healthcare facilities with enterprise-grade security
            and reliability.
          </p>

          <div className="mb-8 sm:mb-12">
            <button
              onClick={() => navigate("/role-selection")}
              className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl"
            >
              SIGN-UP
            </button>
          </div>

          <div className="flex flex-wrap gap-6 sm:gap-8 lg:gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center sm:text-left">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative order-first lg:order-last">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-teal-200">
            <img
              src="/download.jpg"
              alt="Healthcare professional using monitoring system"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
