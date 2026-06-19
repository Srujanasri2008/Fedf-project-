import React from "react";

const PostCallSummary = () => {
  const appointment = JSON.parse(localStorage.getItem("telemed_appointments") || "[]")[0] || null;

  return (
    <div className="module-box">
      <p>Review the consultation outcome and next steps after the call.</p>

      <div className="history-card">
        <p><strong>Patient:</strong> {appointment?.patientName || "No appointment yet"}</p>
        <p><strong>Doctor:</strong> {appointment?.doctor || "Awaiting doctor assignment"}</p>
        <p><strong>Diagnosis:</strong> {appointment ? "Consultation notes will be updated from the live booking." : "No data available yet"}</p>
        <p><strong>Recommendation:</strong> {appointment ? `Follow-up on ${appointment.date} at ${appointment.time}.` : "No recommendation available yet."}</p>
      </div>
    </div>
  );
};

export default PostCallSummary;
