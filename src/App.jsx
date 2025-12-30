import Header from "./pages/HomePage/components/Header"
import Hero from "./pages/HomePage/components/Hero"
import Features from "./pages/HomePage/components/Features"
import FooterCTA from "./pages/HomePage/components/FooterCTA"

function App() {
  const stats = [
    { value: "24/7", label: "Monitoring" },
    { value: "99.9%", label: "Uptime" },
    { value: "AI-POWERED", label: "Predictions" },
  ]

  const features = [
    {
      id: 1,
      icon: "activity",
      title: "Real-Time Vitals",
      description: "Continuous monitoring with ESP32, DS18B20, MAX30102 sensors",
    },
    {
      id: 2,
      icon: "heart",
      title: "Advanced ECG",
      description: "12-lead visualization with AI arrhythmia detection",
    },
    {
      id: 3,
      icon: "brain",
      title: "AI Predictions",
      description: "Machine learning risk assessment and early warnings",
    },
    {
      id: 4,
      icon: "message",
      title: "AI Assistant",
      description: "Intelligent chatbot for health insights and guidance",
    },
    {
      id: 5,
      icon: "shield",
      title: "Enterprise Security",
      description: "HIPAA-compliant with role-based access control",
    },
    {
      id: 6,
      icon: "wifi",
      title: "IoT Management",
      description: "Real-time device monitoring and fleet management",
    },
  ]

  return (
    <>
      <Header />
      <Hero stats={stats} />
      <Features features={features} />
      <FooterCTA />
    </>
  )
}

export default App
