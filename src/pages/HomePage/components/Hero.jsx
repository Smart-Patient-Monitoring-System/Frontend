import { Sparkles } from "lucide-react"

function Hero({ stats }) {
  return (
    <section className="py-12 px-8 bg-gradient-to-b from-teal-50 to-slate-50">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-50 to-cyan-100 px-4 py-2 rounded-full mb-4">
            <Sparkles size={16} className="text-teal-600" />
            <span className="bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent font-semibold">
              World-Class Healthcare Technology
            </span>
          </div>

          <h2 className="text-xl font-bold text-slate-800 mb-2">
            AI-Driven Smart Patient Monitoring & Awareness System
          </h2>

          <p className="text-slate-600 leading-relaxed mb-6">
            Next-generation healthcare platform combining IoT sensors, real-time vital monitoring, advanced ECG
            analysis, and AI-powered predictions. Built for modern healthcare facilities with enterprise-grade security
            and reliability.
          </p>

          <button className="bg-slate-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-700 transition-colors mb-8">
            SIGN-UP
          </button>

          <div className="flex gap-6">
            {stats.map((stat, index) => (
              <div className="text-center px-6 py-4 border-r border-slate-200 last:border-r-0" key={index}>
                <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
                <p className="text-slate-600 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <div className="bg-gradient-to-br from-teal-500/20 to-cyan-500/20 p-1 rounded-2xl shadow-xl">
            <img
              src="/download.jpg"
              alt="doctor"
              className="w-full max-w-md rounded-xl object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
