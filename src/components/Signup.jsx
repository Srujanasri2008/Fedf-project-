import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = () => {
    const { name, email, password, role } = formData;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name.trim() || !email.trim() || !password.trim() || !role) {
      setError("Please fill in all fields to create your account.");
      return;
    }

    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
     if (!email.includes('@')) { 
      setError('Enter valid email'); 
      return; 
    } 

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("telemed_users") || "[]");

    if (users.some((user) => user.email.toLowerCase() === email.toLowerCase())) {
      setError("This email is already registered.");
      return;
    }

    users.push({ name, email, password, role });
    localStorage.setItem("telemed_users", JSON.stringify(users));
    setError("");
    navigate("/login");
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Sign Up</h1>

        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter Name" required />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter Email" required />
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter Password" required />

        <select name="role" id="role" value={formData.role} onChange={handleChange} required>
          <option value="">Select Role</option>
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
          <option value="admin">Admin</option>
        </select>

        <button onClick={handleSignup}>Create Account</button>

        {error && <p className="error-message">{error}</p>}

        <p>
          Already have an account?
          <Link to="/login"> Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;