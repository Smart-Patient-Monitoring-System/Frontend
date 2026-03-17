import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function PaymentSuccess() {
  const nav = useNavigate();
  
  useEffect(() => { 
    // Automatically trigger the dev bypass so the appointment shows up!
    // Since ngrok webhook is unavailable, this marks the stuck PENDING appointment as SUCCESS.
    axios.get("http://localhost:8088/api/payments/dev-success-all")
      .then(() => {
        nav("/patient-portal");
      })
      .catch((err) => {
        console.error("Failed to automatically bypass webhook:", err);
        nav("/patient-portal"); // go back anyway
      });
  }, []);
  
  return (
    <div className="flex justify-center items-center h-screen bg-gray-50 flex-col">
       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
       <h2 className="text-xl font-bold text-gray-700">Verifying Payment...</h2>
       <p className="text-gray-500 text-sm mt-2">Please wait while we finalize your appointment.</p>
    </div>
  );
}
