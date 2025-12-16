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
    <section className="features">
      <div className="features-header">
        <div className="features-badge">
          <Sparkles size={16} />
          <span>Features</span>
        </div>
        <h2>Complete Healthcare Monitoring Suite</h2>
        <p>Advanced features designed for world-class healthcare facilities</p>
      </div>

      <div className="features-grid">
        {features.map((feature, index) => {
          const IconComponent = iconMap[feature.icon] || Activity
          const colorClass = iconColors[index % iconColors.length]

          return (
            <div className="feature-card" key={feature.id}>
              <div className={`feature-icon ${colorClass}`}>
                <IconComponent size={24} />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default Features
