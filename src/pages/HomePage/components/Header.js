"use client"

import { useState } from "react"
import { Heart, Users } from "lucide-react"

function Header() {
  const [isToggled, setIsToggled] = useState(false)

  const handleToggle = () => {
    setIsToggled(!isToggled)
  }

  return (
    <header className="header">
      <div className="header-logo">
        <div className="logo-icon">
          <Heart size={28} />
        </div>
        <div className="header-title">
          <h1>Smart Patient Monitoring</h1>
          <p>AI-Powered Healthcare</p>
        </div>
      </div>

      <div className="header-actions">
        <button
          className={`theme-toggle ${isToggled ? "active" : ""}`}
          onClick={handleToggle}
          aria-label="Toggle theme"
        />
        <button className="login-btn">
          <Users size={20} />
          LOGIN
        </button>
      </div>
    </header>
  )
}

export default Header
