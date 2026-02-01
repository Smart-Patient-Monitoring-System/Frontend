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
              className="
                relative
                inline-flex items-center gap-3
                bg-white
                text-teal-700
                px-8 sm:px-10 py-4 sm:py-5
                rounded-xl
                font-bold text-base sm:text-lg
                border-2 border-teal-600
                shadow-[0_4px_0_0_rgb(13,148,136)]
                transition-all duration-200 ease-out
                hover:shadow-[0_2px_0_0_rgb(13,148,136)]
                hover:translate-y-0.5
                active:shadow-[0_0_0_0_rgb(13,148,136)]
                active:translate-y-1
                group
                overflow-hidden
              "
            >
              {/* Background pattern on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-teal-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Button content */}
              <span className="relative z-10 flex items-center gap-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <span className="tracking-wide">GET STARTED</span>
                <svg className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
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
              src="doc.webp"
              alt="doc"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
