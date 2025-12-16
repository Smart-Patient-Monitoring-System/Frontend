"use client"

import { useState, useEffect } from "react"
import Header from "./components/Header"
import Hero from "./components/Hero"
import Features from "./components/Features"
import FooterCTA from "./components/FooterCTA"

function App() {
  const [stats, setStats] = useState([])
  const [features, setFeatures] = useState([])

  useEffect(() => {
    // Fetch stats from API
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => setStats(data.stats))
      .catch(() => {
        // Fallback data if API not available
        setStats([
          { value: "24/7", label: "Monitoring" },
          { value: "99.9%", label: "Uptime" },
          { value: "AI-POWERED", label: "Predictions" },
        ])
      })

    // Fetch features from API
    fetch("/api/features")
      .then((res) => res.json())
      .then((data) => setFeatures(data.features))
      .catch(() => {
        // Fallback data if API not available
        setFeatures([
          {
            id: 1,
            title: "Real-Time Vitals",
            description: "Continuous monitoring with ESP32, DS18B20, MAX30102 sensors",
            icon: "activity",
          },
          {
            id: 2,
            title: "Advanced ECG",
            description: "12-lead visualization with AI arrhythmia detection",
            icon: "heart",
          },
          {
            id: 3,
            title: "AI Predictions",
            description: "Machine learning risk assessment and early warnings",
            icon: "brain",
          },
          {
            id: 4,
            title: "AI Assistant",
            description: "Intelligent chatbot for health insights and guidance",
            icon: "message",
          },
          {
            id: 5,
            title: "Enterprise Security",
            description: "HIPAA-compliant with role-based access control",
            icon: "shield",
          },
          {
            id: 6,
            title: "IoT Management",
            description: "Real-time device monitoring and fleet management",
            icon: "wifi",
          },
        ])
      })
  }, [])

  return (
    <div className="app">
      <Header />
      <Hero stats={stats} />
      <Features features={features} />
      <FooterCTA />
    </div>
  )
}

export default App
