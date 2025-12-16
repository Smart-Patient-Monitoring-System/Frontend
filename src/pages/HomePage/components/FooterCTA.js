import { HeartPulse } from "lucide-react"

function FooterCTA() {
  return (
    <footer className="footer-cta">
      <div className="footer-icons">
        <div className="footer-icon">
          <HeartPulse size={24} />
        </div>
        <div className="footer-icon">
          <HeartPulse size={24} />
        </div>
      </div>

      <h2>Ready to Transform Patient Care?</h2>
      <p>Join leading healthcare facilities using AI-driven monitoring technology</p>

      <div className="hotline">HOTLINE-0112221456</div>
    </footer>
  )
}

export default FooterCTA
