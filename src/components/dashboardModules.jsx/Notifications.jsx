import React, { useEffect, useMemo, useState } from "react";

const initialNotifications = [
  { id: 1, text: "New prescription update available for patient John Doe.", unread: true },
  { id: 2, text: "Reminder: consultation starts at 2:30 PM today.", unread: true },
  { id: 3, text: "Doctor notes were updated successfully.", unread: false },
];

const Notifications = () => {
  const currentUser = JSON.parse(localStorage.getItem("telemed_current_user") || "{}");
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const syncNotifications = () => {
      const appointments = JSON.parse(localStorage.getItem("telemed_appointments") || "[]");

      const dynamicNotifications = appointments
        .filter((item) => {
          if (currentUser.role === "doctor") {
            return (item.doctorEmail || "").toLowerCase() === (currentUser.email || "").toLowerCase();
          }
          return (item.patientEmail || "").toLowerCase() === (currentUser.email || "").toLowerCase();
        })
        .slice(0, 6)
        .map((item) => ({
          id: `appointment-${item.id}`,
          text:
            currentUser.role === "doctor"
              ? `New booking from ${item.patientName} with ${item.doctor} on ${item.date} at ${item.time}.`
              : `Your appointment with ${item.doctor} is scheduled for ${item.date} at ${item.time}.`,
          unread: true,
        }));

      setNotifications([...initialNotifications, ...dynamicNotifications]);
    };

    syncNotifications();
    window.addEventListener("storage", syncNotifications);
    window.addEventListener("telemed:appointments-updated", syncNotifications);

    return () => {
      window.removeEventListener("storage", syncNotifications);
      window.removeEventListener("telemed:appointments-updated", syncNotifications);
    };
  }, [currentUser]);

  const filteredNotifications = useMemo(() => {
    if (filter === "unread") return notifications.filter((item) => item.unread);
    return notifications;
  }, [filter, notifications]);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, unread: false } : item))
    );
    setMessage("Notification marked as read.");
  };

  const markAllAsRead = () => {
    setLoading(true);
    setMessage("");

    window.setTimeout(() => {
      setNotifications((prev) => prev.map((item) => ({ ...item, unread: false })));
      setLoading(false);
      setMessage("All notifications marked as read.");
    }, 500);
  };

  return (
    <div className="module-box">
      <p>Stay updated with doctor messages, reminders, and new appointment alerts.</p>

      <div className="notification-tools">
        <button className="ghost-btn" onClick={markAllAsRead} disabled={loading}>
          {loading ? "Updating..." : "Mark all as read"}
        </button>

        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="unread">Unread</option>
        </select>
      </div>

      {filteredNotifications.map((item) => (
        <div key={item.id} className={`notification ${item.unread ? "unread" : ""}`}>
          <span>{item.text}</span>
          {item.unread ? (
            <button className="ghost-btn small" onClick={() => markAsRead(item.id)}>
              Mark read
            </button>
          ) : null}
        </div>
      ))}

      {message ? <p className="success-message">{message}</p> : null}
    </div>
  );
};

export default Notifications;
