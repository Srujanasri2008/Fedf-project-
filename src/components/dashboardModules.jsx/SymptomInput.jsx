import React, { useState } from "react";

const SymptomInput = () => {
  const currentUser = JSON.parse(localStorage.getItem("telemed_current_user") || "{}");
  const appointment = JSON.parse(localStorage.getItem("telemed_appointments") || "[]")[0] || null;
  const [symptoms, setSymptoms] = useState("");
  const [saved, setSaved] = useState("");

  return (
    <div className="module-box">
      <p>Record the patient's symptoms before the consultation begins.</p>
      <p className="success-message">Current consultation: {appointment ? `${appointment.patientName} with ${appointment.doctor}` : "No live appointment selected yet"}</p>

      <textarea
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
        placeholder="Example: fever, headache, fatigue, cough..."
        rows="8"
      />

      <button onClick={() => setSaved(`Symptoms saved for ${currentUser.name || "the patient"}.`) }>Save Symptoms</button>
      {saved && <p className="success-message">{saved}</p>}
    </div>
  );
};

export default SymptomInput;