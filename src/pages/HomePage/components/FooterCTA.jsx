import { HeartPulse } from "lucide-react"

function FooterCTA() {
  return (
    <footer className="bg-gradient-to-r from-teal-700 via-teal-600 to-teal-500 py-12 px-8 text-center relative overflow-hidden">
      <div className="flex justify-center gap-96 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-400 rounded-xl flex items-center justify-center">
          <HeartPulse size={24} className="text-white" />
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-400 rounded-xl flex items-center justify-center">
          <HeartPulse size={24} className="text-white" />
        </div>
      </div>

      <h2 className="text-white text-2xl font-bold mb-2">Ready to Transform Patient Care?</h2>
      <p className="text-white/90 mb-6">Join leading healthcare facilities using AI-driven monitoring technology</p>

      <div className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-pink-400 bg-clip-text text-transparent">
        HOTLINE-0112221456
      </div>
    </footer>
  )
}

export default FooterCTA
