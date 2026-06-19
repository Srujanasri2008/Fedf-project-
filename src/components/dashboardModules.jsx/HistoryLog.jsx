import React, { useEffect, useMemo, useState } from "react";

const HistoryLog = () => {
  const currentUser = useMemo(() => JSON.parse(localStorage.getItem("telemed_current_user") || "{}"), []);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const loadAppointments = () => {
      const savedAppointments = JSON.parse(localStorage.getItem("telemed_appointments") || "[]");
      setAppointments(savedAppointments);
    };

    loadAppointments();
    window.addEventListener("storage", loadAppointments);
    window.addEventListener("telemed:appointments-updated", loadAppointments);

    return () => {
      window.removeEventListener("storage", loadAppointments);
      window.removeEventListener("telemed:appointments-updated", loadAppointments);
    };
  }, [currentUser]);

  return (
    <div className="module-box">
      <p>View previous appointments, reports, and medical follow-ups.</p>

      {appointments.length === 0 ? (
        <p className="error-message">No appointment history is available yet.</p>
      ) : (
        appointments.map((item) => (
          <div key={item.id} className="history-card">
            {item.date} — {currentUser.role === "doctor" ? item.patientName : item.doctor} booked for {item.reason}
          </div>
        ))
      )}
    </div>
  );
};

export default HistoryLog;
