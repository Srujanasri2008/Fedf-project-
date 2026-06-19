import React, { useState } from "react";

const DoctorNotes = () => {
  const appointment = JSON.parse(localStorage.getItem("telemed_appointments") || "[]")[0] || null;
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState("");

  return (
    <div className="module-box">
      <p>Write consultation observations and follow-up guidance.</p>
      <p className="success-message">Appointment context: {appointment ? `${appointment.patientName} with ${appointment.doctor} on ${appointment.date}` : "No appointment selected yet"}</p>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows="10"
        placeholder="Example: Patient reports mild fever, prescribed rest, hydration, and follow-up after 3 days."
      />

      <button onClick={() => setSaved(`Doctor notes saved for ${appointment?.patientName || "the patient"}.`)}>Save Notes</button>
      {saved && <p className="success-message">{saved}</p>}
    </div>
  );
};

export default DoctorNotes;