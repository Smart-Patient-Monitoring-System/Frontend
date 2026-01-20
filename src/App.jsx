import { HashRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./pages/HomePage/components/Header";
import Hero from "./pages/HomePage/components/Hero";
import Features from "./pages/HomePage/components/Features";
import FooterCTA from "./pages/HomePage/components/FooterCTA";

import RoleSelectionPage from "./pages/Login_Signup/roleSelectionpage";
import LoginDoctor from "./pages/Login_Signup/loginPageDoctor";
import LoginPatient from "./pages/Login_Signup/loginPagePatient";
import LoginAdmin from "./pages/Login_Signup/loginPageAdmin";

import SignupDoctor from "./pages/Login_Signup/signupPageDoctor";
import SignupPatient from "./pages/Login_Signup/signupPagePatient";

import ForgotPasswordPage from "./pages/Login_Signup/ForgotPasswordPage";
import ResetPasswordPage from "./pages/Login_Signup/ResetPasswordPage";

import PatientPortal from "./pages/PatientPortal/PatientPortal";
import AdminDashboard from "./components/AdminPortal/AdminDashboard";
import DocDashboard from "./pages/DoctorsPage/DocDashboard";


function HomePage() {
  const stats = [
    { value: "24/7", label: "Monitoring" },
    { value: "99.9%", label: "Uptime" },
    { value: "AI-POWERED", label: "Predictions" },
  ];

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
  ];

  return (
    <>
      <Header />
      <Hero stats={stats} />
      <Features features={features} />
      <FooterCTA />
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/role-selection" element={<RoleSelectionPage />} />
        <Route path="/doctorLogin" element={<LoginDoctor />} />
        <Route path="/patientLogin" element={<LoginPatient />} />
        <Route path="/adminLogin" element={<LoginAdmin />} />
        <Route path="/doctorSignup" element={<SignupDoctor />} />
        <Route path="/patientSignup" element={<SignupPatient />} />

        {/* Password reset routes */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route path="/patient-portal" element={<PatientPortal />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/DocDashboard" element={<DocDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
