import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProtectedTable.css";
import EditUserForm from "./EditUserForm.js";

function ProtectedTable() {
  const [userData, setUserData] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const currentUserEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      axios
        .get("http://localhost:4000/api/userdata", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const responseData = response.data;

          if (Array.isArray(responseData)) {
            setUserData(responseData);
          } else {
            console.error("Invalid response data:", responseData);
          }
        })
        .catch((error) => {
          console.error(error);
          navigate("/login");
        });
    }
  }, [navigate, token]);

  const handleEdit = (user) => {
    setEditUser(user);
    setIsEditModalOpen(true);
  };

  const handleCloseEdit = () => {
    setEditUser(null);
    setIsEditModalOpen(false);
  };

  const handleUpdateUser = (updatedUser) => {
    const updatedUserData = userData.map((user) =>
      user._id === updatedUser._id ? updatedUser : user
    );
    setUserData(updatedUserData);
  };

  return (
    <div className="table-container">
      <h2>Protected Table</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Date of Birth</th>
            <th>Email</th>
            <th>Password</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {userData.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.dateOfBirth}</td>
              <td>{user.email}</td>
              <td>
                {user.email === currentUserEmail ? user.password : "**********"}
              </td>
              <td>
                {user.email === currentUserEmail && (
                  <button
                    className="edit-button"
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="link-container">
        <p>
          <Link
            to="/login"
            onClick={() => {
              localStorage.removeItem("userEmail");
              localStorage.removeItem("token");

              navigate("/login");
            }}
          >
            Logout
          </Link>
        </p>
      </div>

      {isEditModalOpen && (
        <div>
          <div className="overlay open" onClick={handleCloseEdit}></div>
          <div className="edit-modal open">
            <EditUserForm
              user={editUser}
              onClose={() => {
                handleCloseEdit();
              }}
              onUpdate={handleUpdateUser}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ProtectedTable;
