import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EditUserForm.css";

function EditUserForm({ user, onClose, onUpdate }) {
  const [editedUser, setEditedUser] = useState(user);
  const [error, setError] = useState(null);

  useEffect(() => {
    setEditedUser(user);
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const birthDate = new Date(editedUser.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();

    if (age < 18) {
      setError("You must be at least 18 years old to register.");
      return;
    }

    try {
      // Send a PUT request to update the user data
      const response = await axios.put(
        `http://localhost:4000/api/userdata/${user._id}`,
        editedUser
      );

      onUpdate(response.data);

      localStorage.setItem("userEmail", editedUser.email);

      onClose();
    } catch (error) {
      console.error("Edit failed", error);
      setError("Edit failed. Please check your input and try again.");
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
    <div className="edit-popup">
      <h2>Edit User</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            name="name"
            id="name"
            value={editedUser.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="dateOfBirth">Date of Birth:</label>
          <input
            type="date"
            name="dateOfBirth"
            id="dateOfBirth"
            value={editedUser.dateOfBirth}
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
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            id="email"
            value={editedUser.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            id="password"
            value={editedUser.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="button-group">
          <button type="submit">Update</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditUserForm;
