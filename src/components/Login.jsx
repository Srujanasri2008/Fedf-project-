import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem("telemed_users") || "[]");
    const foundUser = users.find(
      (user) => user.email.toLowerCase() === formData.email.toLowerCase() && user.password === formData.password
    );

    if (!foundUser) {
      setError("Invalid email or password.");
      return;
    }

    localStorage.setItem("telemed_logged_in", "true");
    localStorage.setItem("telemed_current_user", JSON.stringify(foundUser));
    setError("");
    navigate("/dashboard");
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Login</h1>

        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter Email" required />
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter Password" required />

        <button onClick={handleLogin}>Login</button>

        {error && <p className="error-message">{error}</p>}

        <p>
          Don't have an account?
          <Link to="/signup"> Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;