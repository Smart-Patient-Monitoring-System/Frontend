import { Sparkles } from "lucide-react"

function Hero({ stats }) {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-text-section">
          <div className="hero-badge">
            <Sparkles size={16} />
            <span>World-Class Healthcare Technology</span>
          </div>

          <h2>AI-Driven Smart Patient Monitoring & Awareness System</h2>

          <p>
            Next-generation healthcare platform combining IoT sensors, real-time vital monitoring, advanced ECG
            analysis, and AI-powered predictions. Built for modern healthcare facilities with enterprise-grade security
            and reliability.
          </p>

          <button className="signup-btn">SIGN-UP</button>

          <div className="stats">
            {stats.map((stat, index) => (
              <div className="stat-item" key={index}>
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-image-container">
          <div className="hero-image-wrapper">
            <img src="/download.jpg" alt="doctor using computer" className="hero-image" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
