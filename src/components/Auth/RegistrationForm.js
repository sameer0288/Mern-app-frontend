import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./RegistrationForm.css";

function RegistrationForm() {
  const [formData, setFormData] = useState({
    name: "",
    dateOfBirth: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const birthDate = new Date(formData.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();

    if (age < 18) {
      setError("You must be at least 18 years old to register.");
      return;
    }

    try {
      // Send a POST request to your registration API endpoint
      const response = await axios.post(
        "http://localhost:4000/api/register",
        formData
      );

      navigate("/login");
    } catch (error) {
      console.error("Registration failed", error);
      setError("Registration failed. Please check your input and try again."); // Set the error message
    }
  };

  function getMaxDate() {
    const today = new Date();
    const maxDate = new Date(today);
    maxDate.setFullYear(today.getFullYear() - 18);
    return maxDate.toISOString().split("T")[0];
  }

  function getMinDate() {
    const minDate = new Date("1900-01-01");
    return minDate.toISOString().split("T")[0];
  }

  return (
    <div className="registration-form">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Date of Birth:</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
            max={getMaxDate()}
            min={getMinDate()}
            className="date-input"
          />
          <p className="hint">
            Please enter your date of birth. You must be at least 18 years old
            to register.
          </p>
        </div>
        {error && <p className="error">{error}</p>}
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}{" "}
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

export default RegistrationForm;
