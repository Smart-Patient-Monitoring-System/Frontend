"use client"

import { useState } from "react"
import { Heart, Users } from "lucide-react"

function Header() {
  const [isToggled, setIsToggled] = useState(false)

  const handleToggle = () => {
    setIsToggled(!isToggled)
  }

  return (
    <header className="bg-gradient-to-r from-teal-700 via-teal-600 to-teal-500 px-8 py-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/40">
          <Heart size={28} className="text-white" />
        </div>
        <div>
          <h1 className="text-white text-2xl font-bold">Smart Patient Monitoring</h1>
          <p className="text-white/80 text-sm">AI-Powered Healthcare</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          className={`w-14 h-7 rounded-full relative transition-all cursor-pointer border-0 ${
            isToggled ? "bg-white/40" : "bg-white/20"
          }`}
          onClick={handleToggle}
          aria-label="Toggle theme"
        >
          <span
            className={`absolute w-6 h-6 bg-white rounded-full top-0.5 transition-transform ${
              isToggled ? "translate-x-7 left-0.5" : "left-0.5"
            }`}
          />
        </button>
        <button className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-cyan-400 text-white px-6 py-3 rounded-full font-semibold text-base shadow-lg shadow-cyan-500/40 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-500/50 transition-all">
          <Users size={20} />
          LOGIN
        </button>
      </div>
    </header>
  )
}

export default Header
