import React, { useEffect, useState } from "react";

const AdminModule = () => {
  const [stats, setStats] = useState({
    patients: 0,
    doctors: 0,
    pending: 0,
  });
  const [appointments, setAppointments] = useState([]);
  const [note, setNote] = useState("");
  const [priority, setPriority] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("telemed_users") || "[]");
    const savedAppointments = JSON.parse(localStorage.getItem("telemed_appointments") || "[]");

    setAppointments(savedAppointments);
    setStats({
      patients: users.filter((user) => user.role === "patient").length,
      doctors: users.filter((user) => user.role === "doctor").length,
      pending: savedAppointments.filter((item) => (item.status || "Scheduled") !== "Completed").length,
    });
  }, []);

  const handleCreateAlert = (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!note.trim()) {
      setError("Please enter an admin note before creating an alert.");
      return;
    }

    setLoading(true);

    window.setTimeout(() => {
      setStats((prev) => ({ ...prev, pending: prev.pending + 1 }));
      setLoading(false);
      setMessage(`Alert created successfully for ${priority} priority.`);
      setNote("");
      setPriority("medium");
    }, 700);
  };

  return (
    <div className="module-box">
      <p>Manage platform users, appointments, and system activity from this section.</p>

      <div className="admin-grid">
        <div className="admin-card">Total Patients: {stats.patients}</div>
        <div className="admin-card">Active Doctors: {stats.doctors}</div>
        <div className="admin-card">Pending Appointments: {stats.pending}</div>
        <div className="admin-card">System Status: Stable</div>
      </div>

      <div className="history-card">
        <strong>Live appointment overview</strong>
        <p>{appointments.length} appointment record(s) currently stored.</p>
      </div>

      {appointments.slice(0, 5).map((item) => (
        <div key={item.id} className="history-card">
          <strong>{item.patientName}</strong>
          <p>Doctor: {item.doctor}</p>
          <p>Date/Time: {item.date} • {item.time}</p>
          <p>Status: {item.status || "Scheduled"}</p>
        </div>
      ))}

      <form className="admin-form" onSubmit={handleCreateAlert}>
        <label htmlFor="admin-note">Admin note</label>
        <textarea
          id="admin-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Enter a message for the admin alert"
        />

        <label htmlFor="priority">Priority</label>
        <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Creating alert..." : "Create Alert"}
        </button>
      </form>

      {error ? <p className="error-message">{error}</p> : null}
      {message ? <p className="success-message">{message}</p> : null}
    </div>
  );
};

export default AdminModule;
