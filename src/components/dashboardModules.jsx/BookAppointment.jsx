import React, { useState } from "react";

const fallbackDoctorOptions = [
  { value: "Dr. John - Cardiologist", email: "dr.john@telemed.test" },
  { value: "Dr. Smith - Dermatologist", email: "dr.smith@telemed.test" },
  { value: "Dr. Emily - General Physician", email: "dr.emily@telemed.test" },
];

const BookAppointment = () => {
  const currentUser = JSON.parse(localStorage.getItem("telemed_current_user") || "{}");
  const registeredDoctors = JSON.parse(localStorage.getItem("telemed_users") || "[]")
    .filter((user) => user.role === "doctor")
    .map((user) => ({
      value: user.name || user.email,
      email: user.email,
    }));

  const doctorOptions = registeredDoctors.length > 0 ? registeredDoctors : fallbackDoctorOptions;

  const [formData, setFormData] = useState({
    patientName: currentUser.name || "",
    age: "",
    gender: "",
    doctor: "",
    date: "",
    time: "",
    reason: "",
    phone: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: digitsOnly }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAppointment = () => {
    const { patientName, age, gender, doctor, date, time, reason, phone } = formData;

    if (
      !patientName.trim() ||
      !age.trim() ||
      !gender ||
      !doctor ||
      !date ||
      !time ||
      !reason.trim() ||
      !phone.trim()
    ) {
      setMessage("Please fill in all fields before booking your appointment.");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      setMessage("Phone number must be exactly 10 digits.");
      return;
    }

    const doctorProfile = doctorOptions.find((item) => item.value === doctor) || doctorOptions[0];

    const appointment = {
      id: Date.now(),
      patientName: patientName.trim(),
      patientEmail: currentUser.email || "",
      patientId: currentUser.email || `patient-${Date.now()}`,
      age,
      gender,
      doctor,
      doctorEmail: doctorProfile.email,
      date,
      time,
      reason: reason.trim(),
      phone,
      status: "Scheduled",
      bookedBy: currentUser.name || "Patient",
      bookedAt: new Date().toISOString(),
    };

    const existingAppointments = JSON.parse(localStorage.getItem("telemed_appointments") || "[]");
    localStorage.setItem("telemed_appointments", JSON.stringify([appointment, ...existingAppointments]));
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new CustomEvent("telemed:appointments-updated", { detail: appointment }));

    setMessage("Appointment Booked Successfully ✅");
    setFormData({
      patientName: "",
      age: "",
      gender: "",
      doctor: "",
      date: "",
      time: "",
      reason: "",
      phone: "",
    });
  };

  return (

    <div className="module-box">

      <input
        type="text"
        name="patientName"
        value={formData.patientName}
        onChange={handleChange}
        placeholder="Patient Name"
        required
      />

      <div className="double-input">

        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          placeholder="Age"
          required
        />

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="">Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

      </div>

      <select
        name="doctor"
        value={formData.doctor}
        onChange={handleChange}
        required
      >
        <option value="">Select Doctor</option>
        {doctorOptions.map((option) => (
          <option key={option.value} value={option.value}>{option.value}</option>
        ))}
      </select>

      <div className="double-input">

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
        />

      </div>

      <textarea
        name="reason"
        value={formData.reason}
        onChange={handleChange}
        placeholder="Reason for Visit"
        required
      ></textarea>

      <input
        type="text"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Phone Number"
        maxLength={10}
        inputMode="numeric"
        required
      />

      <button onClick={handleAppointment}>
        Book Appointment
      </button>

      {message && (
        <p className="success-message">
          {message}
        </p>
      )}

    </div>
  );
};

export default BookAppointment;