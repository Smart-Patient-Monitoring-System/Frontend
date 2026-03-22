import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const nav = useNavigate();
  
  useEffect(() => {
    // The backend already marked it as SUCCESS before redirecting here.
    const timer = setTimeout(() => {
      nav("/patient-portal");
    }, 2000);
    return () => clearTimeout(timer);
  }, [nav]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
        <p className="text-gray-500">Your appointment has been confirmed.</p>
        <p className="text-sm text-gray-400 mt-4">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
