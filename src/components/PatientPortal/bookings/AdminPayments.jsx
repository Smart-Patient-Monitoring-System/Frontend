import { useEffect, useState } from "react";
import { getAllPayments } from "../api/api";

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    getAllPayments().then((res) => setPayments(res.data));
  }, []);

  return (
    <div>
      <h1>All Payments</h1>
      <table border={1}>
        <thead>
          <tr>
            <th>Payment ID</th>
            <th>Appointment ID</th>
            <th>Doctor</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.appointment.id}</td>
              <td>{p.appointment.doctor.name}</td>
              <td>{p.amount}</td>
              <td>{p.paymentStatus}</td>
              <td>{new Date(p.paymentDate).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
