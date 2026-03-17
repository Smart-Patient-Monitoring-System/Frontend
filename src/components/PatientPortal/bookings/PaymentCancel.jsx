import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentCancel() {
  const nav = useNavigate();
  useEffect(() => { nav("/patient-portal"); }, []);
  return <h2>❌ Payment Cancelled — redirecting...</h2>;
}
