import { Sparkles, Activity, Heart, Brain, MessageSquare, Shield, Wifi } from "lucide-react"

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
    <section className="py-16 px-8 bg-white">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-emerald-50 px-5 py-2 rounded-full mb-4">
          <Sparkles size={16} className="text-teal-600" />
          <span className="text-teal-600 font-semibold">Features</span>
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Complete Healthcare Monitoring Suite</h2>
        <p className="text-slate-600">Advanced features designed for world-class healthcare facilities</p>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const IconComponent = iconMap[feature.icon] || Activity
          const colorClass = iconColors[index % iconColors.length]
          const bgColor =
            colorClass === "teal"
              ? "bg-gradient-to-br from-teal-600 to-teal-500"
              : "bg-gradient-to-br from-pink-500 to-pink-400"

          return (
            <div
              className="bg-slate-50 p-6 rounded-2xl hover:-translate-y-1 hover:shadow-xl transition-all"
              key={feature.id}
            >
              <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center mb-4`}>
                <IconComponent size={24} className="text-white" />
              </div>
              <h3 className="text-base font-semibold text-slate-800 mb-2">{feature.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default Features
