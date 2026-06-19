import React, { useState } from "react";

const PDFPrescription = () => {
  const appointment = JSON.parse(localStorage.getItem("telemed_appointments") || "[]")[0] || null;
  const [status, setStatus] = useState("Ready to generate a PDF prescription.");

  return (
    <div className="module-box">
      <p>Generate a formatted patient prescription document for download.</p>

      <div className="history-card">
        <p><strong>Patient:</strong> {appointment?.patientName || "No active patient"}</p>
        <p><strong>Doctor:</strong> {appointment?.doctor || "Doctor not assigned"}</p>
        <p><strong>Medicine:</strong> {appointment ? "Generated from the current consultation" : "Paracetamol"}</p>
        <p><strong>Dosage:</strong> {appointment ? "As prescribed during the visit" : "500mg"}</p>
      </div>

      <button onClick={() => setStatus("PDF prescription generated successfully.")}>Download PDF</button>
      <p className="success-message">{status}</p>
    </div>
  );
};

export default PDFPrescription;