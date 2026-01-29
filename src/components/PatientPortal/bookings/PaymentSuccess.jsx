import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const nav = useNavigate();
  useEffect(() => { nav("/patient/bookings"); }, []);
  return <h2>✅ Payment Successful</h2>;
}
