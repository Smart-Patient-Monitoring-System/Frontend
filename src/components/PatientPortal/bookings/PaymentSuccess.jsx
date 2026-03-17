import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../../api.js";
import axios from "axios";

export default function PaymentSuccess() {
  const nav = useNavigate();
  useEffect(() => {
    // Dev bypass: auto-mark pending appointments as SUCCESS
    axios.get(`${API_BASE_URL}/api/payments/dev-success-all`)
      .catch((err) => console.log("Bypass error:", err))
      .finally(() => nav("/patient-portal"));
  }, []);
  return <h2>✅ Payment Successful — redirecting…</h2>;
}
