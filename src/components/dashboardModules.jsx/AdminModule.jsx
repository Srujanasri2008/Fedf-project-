import React, { useEffect, useMemo, useState } from "react";

const normalizeText = (value = "") =>
  value.toString().toLowerCase().replace(/[^a-z0-9]/g, "");

const getStatusClass = (status = "") => {
  const value = status.toLowerCase();
  if (value.includes("complete") || value === "approved") return "status-pill success";
  if (value.includes("cancel") || value === "rejected") return "status-pill danger";
  if (value.includes("pending") || value === "scheduled") return "status-pill pending";
  return "status-pill";
};

const AdminModule = ({ mode = "overview" }) => {
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [note, setNote] = useState("");
  const [priority, setPriority] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = () => {
      const storedUsers = JSON.parse(localStorage.getItem("telemed_users") || "[]");
      const storedAppointments = JSON.parse(localStorage.getItem("telemed_appointments") || "[]");
      setUsers(storedUsers);
      setAppointments(storedAppointments);
    };

    loadData();
    window.addEventListener("storage", loadData);
    window.addEventListener("telemed:appointments-updated", loadData);
    window.addEventListener("telemed:users-updated", loadData);

    return () => {
      window.removeEventListener("storage", loadData);
      window.removeEventListener("telemed:appointments-updated", loadData);
      window.removeEventListener("telemed:users-updated", loadData);
    };
  }, []);

  const patients = useMemo(
    () => users.filter((user) => user.role === "patient"),
    [users]
  );
  const doctors = useMemo(
    () => users.filter((user) => user.role === "doctor"),
    [users]
  );
  const admins = useMemo(
    () => users.filter((user) => user.role === "admin"),
    [users]
  );
  const pendingAppointments = useMemo(
    () => appointments.filter((item) => (item.status || "Scheduled") !== "Completed"),
    [appointments]
  );
  const completedAppointments = useMemo(
    () => appointments.filter((item) => (item.status || "Scheduled") === "Completed"),
    [appointments]
  );
  const cancelledAppointments = useMemo(
    () => appointments.filter((item) => (item.status || "Scheduled") === "Cancelled"),
    [appointments]
  );

  const completionRate = appointments.length
    ? Math.round((completedAppointments.length / appointments.length) * 100)
    : 0;
  const pendingRate = appointments.length
    ? Math.round((pendingAppointments.length / appointments.length) * 100)
    : 0;

  const filteredUsers = useMemo(() => {
    const term = normalizeText(searchTerm);
    if (!term) return users;
    return users.filter((user) =>
      [user.name, user.email, user.role].some((field) => normalizeText(field).includes(term))
    );
  }, [users, searchTerm]);

  const filteredDoctors = useMemo(() => {
    const term = normalizeText(searchTerm);
    if (!term) return doctors;
    return doctors.filter((doctor) =>
      [doctor.name, doctor.email, doctor.specialty].some((field) => normalizeText(field).includes(term))
    );
  }, [doctors, searchTerm]);

  const filteredAppointments = useMemo(() => {
    const term = normalizeText(searchTerm);
    if (!term) return appointments;
    return appointments.filter((item) =>
      [item.patientName, item.doctor, item.date, item.time, item.status].some((field) =>
        normalizeText(field).includes(term)
      )
    );
  }, [appointments, searchTerm]);

  const updateAppointmentStatus = (id, newStatus) => {
    const updatedAppointments = appointments.map((item) =>
      item.id === id ? { ...item, status: newStatus } : item
    );
    setAppointments(updatedAppointments);
    localStorage.setItem("telemed_appointments", JSON.stringify(updatedAppointments));
    window.dispatchEvent(new Event("telemed:appointments-updated"));
  };

  const toggleDoctorAvailability = (email) => {
    const updatedUsers = users.map((user) =>
      user.email === email
        ? {
            ...user,
            availability: user.availability === "Available" ? "On Leave" : "Available",
          }
        : user
    );
    setUsers(updatedUsers);
    localStorage.setItem("telemed_users", JSON.stringify(updatedUsers));
    window.dispatchEvent(new Event("telemed:users-updated"));
  };

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
      setLoading(false);
      setMessage(`Alert created successfully for ${priority} priority.`);
      setNote("");
      setPriority("medium");
    }, 700);
  };

  const renderOverview = () => (
    <>
      <div className="admin-grid">
        <div className="admin-card">
          <span className="admin-card-label">Patients</span>
          <strong>{patients.length}</strong>
        </div>
        <div className="admin-card">
          <span className="admin-card-label">Doctors</span>
          <strong>{doctors.length}</strong>
        </div>
        <div className="admin-card">
          <span className="admin-card-label">Pending</span>
          <strong>{pendingAppointments.length}</strong>
        </div>
        <div className="admin-card">
          <span className="admin-card-label">Completed</span>
          <strong>{completedAppointments.length}</strong>
        </div>
      </div>

      <div className="history-card admin-highlight-card">
        <strong>System overview</strong>
        <p>{appointments.length} appointments • {cancelledAppointments.length} cancelled</p>
      </div>

      <div className="admin-two-col">
        <div className="history-card">
          <strong>Recent appointments</strong>
          {appointments.slice(0, 5).map((item) => (
            <div key={item.id || `${item.patientName}-${item.date}`} className="recent-item">
              <span>{item.patientName}</span>
              <span>{item.status || "Scheduled"}</span>
            </div>
          ))}
        </div>

        <div className="history-card">
          <strong>Admin controls</strong>
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
        </div>
      </div>
    </>
  );

  const renderUsers = () => (
    <>
      <div className="admin-toolbar">
        <div>
          <strong>User Management</strong>
          <p>{filteredUsers.length} user(s) found</p>
        </div>
        <input
          className="admin-search"
          type="search"
          placeholder="Search by name, email, or role"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={`${user.email}-${user.name}`}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td><span className={getStatusClass(user.status || "Active")}>{user.status || "Active"}</span></td>
                <td>
                  <button className="admin-action-btn primary">View</button>
                  <button className="admin-action-btn">Suspend</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderDoctors = () => (
    <>
      <div className="admin-toolbar">
        <div>
          <strong>Doctor Management</strong>
          <p>{filteredDoctors.length} doctor(s) found</p>
        </div>
        <input
          className="admin-search"
          type="search"
          placeholder="Search by doctor name or specialty"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Specialty</th>
              <th>Availability</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDoctors.map((doctor) => (
              <tr key={`${doctor.email}-${doctor.name}`}>
                <td>{doctor.name}</td>
                <td>{doctor.email}</td>
                <td>{doctor.specialty || "General Practice"}</td>
                <td><span className={getStatusClass(doctor.availability || "Available")}>{doctor.availability || "Available"}</span></td>
                <td>
                  <button className="admin-action-btn primary" onClick={() => toggleDoctorAvailability(doctor.email)}>
                    {doctor.availability === "Available" ? "Mark On Leave" : "Mark Available"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderAppointments = () => (
    <>
      <div className="admin-toolbar">
        <div>
          <strong>Appointment Overview</strong>
          <p>{filteredAppointments.length} appointment(s) found</p>
        </div>
        <input
          className="admin-search"
          type="search"
          placeholder="Search by patient, doctor, date, or status"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((item) => (
              <tr key={item.id || `${item.patientName}-${item.date}-${item.time}`}>
                <td>{item.patientName}</td>
                <td>{item.doctor}</td>
                <td>{item.date}</td>
                <td>{item.time}</td>
                <td><span className={getStatusClass(item.status || "Scheduled")}>{item.status || "Scheduled"}</span></td>
                <td>
                  <button className="admin-action-btn primary" onClick={() => updateAppointmentStatus(item.id, "Completed")}>Complete</button>
                  <button className="admin-action-btn danger" onClick={() => updateAppointmentStatus(item.id, "Cancelled")}>Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderAnalytics = () => (
    <>
      <div className="admin-grid">
        <div className="admin-card">
          <span className="admin-card-label">Bookings</span>
          <strong>{appointments.length}</strong>
        </div>
        <div className="admin-card">
          <span className="admin-card-label">Completed</span>
          <strong>{completedAppointments.length}</strong>
        </div>
        <div className="admin-card">
          <span className="admin-card-label">Pending</span>
          <strong>{pendingAppointments.length}</strong>
        </div>
        <div className="admin-card">
          <span className="admin-card-label">Cancelled</span>
          <strong>{cancelledAppointments.length}</strong>
        </div>
      </div>
      <div className="analytics-layout">
        <div className="history-card analytics-panel">
          <strong>Completion rate</strong>
          <div className="analytics-progress">
            <div className="analytics-fill" style={{ width: `${completionRate}%` }} />
          </div>
          <p>{completionRate}% of appointments completed</p>
        </div>
        <div className="history-card analytics-panel">
          <strong>Pending follow-up</strong>
          <div className="analytics-progress">
            <div className="analytics-fill pending" style={{ width: `${pendingRate}%` }} />
          </div>
          <p>{pendingRate}% still require attention</p>
        </div>
      </div>
      <div className="analytics-layout">
        <div className="history-card">
          <strong>Patient vs doctor ratio</strong>
          <p>{patients.length} patients • {doctors.length} doctors</p>
        </div>
        <div className="history-card">
          <strong>Admin coverage</strong>
          <p>{admins.length} admin users available</p>
        </div>
      </div>
    </>
  );

  const renderSettings = () => (
    <>
      <div className="history-card">
        <strong>System Settings</strong>
        <p>Manage alerts, access controls, and operational notices.</p>
      </div>
      <div className="admin-two-col">
        <div className="history-card">
          <strong>Create alert</strong>
          <form className="admin-form" onSubmit={handleCreateAlert}>
            <label htmlFor="admin-note-settings">Admin note</label>
            <textarea
              id="admin-note-settings"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter a message for the admin alert"
            />
            <label htmlFor="priority-settings">Priority</label>
            <select id="priority-settings" value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <button type="submit" disabled={loading}>
              {loading ? "Creating alert..." : "Create Alert"}
            </button>
          </form>
        </div>
        <div className="history-card">
          <strong>Quick stats</strong>
          <p>Doctors available: {doctors.filter((doctor) => (doctor.availability || "Available") === "Available").length}</p>
          <p>Patients registered: {patients.length}</p>
          <p>Pending tasks: {pendingAppointments.length}</p>
        </div>
      </div>
      {error ? <p className="error-message">{error}</p> : null}
      {message ? <p className="success-message">{message}</p> : null}
    </>
  );

  return (
    <div className="module-box">
      {mode === "users" && renderUsers()}
      {mode === "doctors" && renderDoctors()}
      {mode === "appointments" && renderAppointments()}
      {mode === "analytics" && renderAnalytics()}
      {mode === "settings" && renderSettings()}
      {mode === "overview" && renderOverview()}
    </div>
  );
};

export default AdminModule;
