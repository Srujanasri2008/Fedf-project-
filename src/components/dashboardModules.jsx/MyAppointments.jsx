import React, { useEffect, useState } from "react";

const normalizeText = (value = "") =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .trim();

const MyAppointments = ({ viewMode = "My Appointments" }) => {
  const [appointments, setAppointments] = useState([]);
  const [currentUser, setCurrentUser] = useState(() =>
    JSON.parse(localStorage.getItem("telemed_current_user") || "{}")
  );
  const role = currentUser.role || "patient";

  useEffect(() => {
    const updateCurrentUser = () => {
      setCurrentUser(JSON.parse(localStorage.getItem("telemed_current_user") || "{}"));
    };

    updateCurrentUser();
    window.addEventListener("storage", updateCurrentUser);
    window.addEventListener("telemed:appointments-updated", updateCurrentUser);

    return () => {
      window.removeEventListener("storage", updateCurrentUser);
      window.removeEventListener("telemed:appointments-updated", updateCurrentUser);
    };
  }, []);

  useEffect(() => {
    const loadAppointments = () => {
      const savedAppointments = JSON.parse(localStorage.getItem("telemed_appointments") || "[]");
      const currentName = normalizeText(currentUser.name || "");
      const currentEmail = normalizeText(currentUser.email || "");

      let filteredAppointments =
        role === "doctor"
          ? savedAppointments.filter((item) => {
              const doctorName = normalizeText(item.doctor || "");
              const doctorEmail = normalizeText(item.doctorEmail || "");

              return (
                doctorName === currentName ||
                doctorName.includes(currentName) ||
                currentName.includes(doctorName) ||
                doctorEmail === currentEmail ||
                doctorEmail.includes(currentEmail) ||
                currentEmail.includes(doctorEmail)
              );
            })
          : role === "admin"
          ? savedAppointments
          : savedAppointments.filter((item) => {
              const patientName = normalizeText(item.patientName || "");
              const patientEmail = normalizeText(item.patientEmail || "");

              return (
                patientName === currentName ||
                patientEmail === currentEmail ||
                patientName.includes(currentName) ||
                patientEmail.includes(currentEmail)
              );
            });

      if (role === "doctor" && filteredAppointments.length === 0 && savedAppointments.length > 0) {
        filteredAppointments = savedAppointments;
      }

      setAppointments(filteredAppointments);
    };

    loadAppointments();
    window.addEventListener("storage", loadAppointments);
    window.addEventListener("telemed:appointments-updated", loadAppointments);

    return () => {
      window.removeEventListener("storage", loadAppointments);
      window.removeEventListener("telemed:appointments-updated", loadAppointments);
    };
  }, [currentUser, role, viewMode]);

  return (
    <div className="module-box">
      <p>View all booked patient appointments assigned to your care queue.</p>

      {appointments.length === 0 ? (
        <p className="error-message">No appointments have been booked yet.</p>
      ) : (
        appointments.map((item) => (
          <div key={item.id} className="history-card">
            <strong>{role === "doctor" ? item.patientName : item.doctor}</strong>
            <p>{role === "doctor" ? `Patient: ${item.patientName}` : `Doctor: ${item.doctor}`}</p>
            <p>Date: {item.date} at {item.time}</p>
            <p>Reason: {item.reason}</p>
            <p>Phone: {item.phone}</p>
            <p>Status: {item.status || "Scheduled"}</p>
            <p>Age/Gender: {item.age} yrs, {item.gender}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default MyAppointments;
