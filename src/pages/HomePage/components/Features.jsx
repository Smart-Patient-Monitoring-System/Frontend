import { Activity, Heart, Brain, MessageSquare, Shield, Wifi } from "lucide-react"

const iconMap = {
  activity: Activity,
  heart: Heart,
  brain: Brain,
  message: MessageSquare,
  shield: Shield,
  wifi: Wifi,
}

const iconColors = ["teal", "pink", "teal", "pink", "pink", "teal"]

function Features({ features }) {
  return (
    <section className="bg-gradient-to-br from-gray-50 to-teal-50 py-12 sm:py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-teal-100 px-3 py-1.5 rounded-full mb-4 sm:mb-6">
            <span className="text-teal-700 font-medium text-xs sm:text-sm">Features</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 text-balance">
            Complete Healthcare Monitoring Suite
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto text-pretty">
            Advanced features designed for world-class healthcare facilities
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, index) => {
            const IconComponent = iconMap[feature.icon] || Activity
            const colorClass = iconColors[index % iconColors.length]
            const bgColor = colorClass === "teal" ? "bg-teal-500" : "bg-pink-500"

            return (
              <div
                className="bg-white border border-gray-200 p-6 sm:p-8 rounded-2xl hover:border-teal-400 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                key={feature.id}
              >
                <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center mb-4`}>
                  <IconComponent size={24} className="text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Features
