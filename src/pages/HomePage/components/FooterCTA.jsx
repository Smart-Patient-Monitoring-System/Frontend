function FooterCTA() {
  return (
    <footer className="bg-gradient-to-r from-teal-600 to-cyan-600 py-6 sm:py-8 lg:py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-12 text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6 text-balance">
          Ready to transform patient care?
        </h2>
        <p className="text-base sm:text-lg text-teal-50 mb-8 sm:mb-10 text-pretty">
          Join leading healthcare facilities using AI-driven monitoring technology
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 sm:mb-12">
          <button className="bg-white text-teal-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-teal-50 transition-colors shadow-lg">
            Contact Sales
          </button>
          <button className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors">
            Schedule Demo
          </button>
        </div>

        <div className="pt-6 sm:pt-8 border-t border-teal-400">
          <p className="text-teal-100 text-sm">
            24/7 Support Hotline: <span className="text-white font-semibold">0112221456</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default FooterCTA
