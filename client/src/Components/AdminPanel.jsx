// src/components/AdminPanel.js
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminPanel() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  

  useEffect(() => {
    if (!currentUser || !currentUser.isAdmin) {
      navigate("/"); // Redirect if not admin
    } else {
      fetchUsers(); // Fetch users if admin
    }
  }, [currentUser, navigate]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/admin/users", {
        headers: {
          Authorization: `Bearer ${currentUser.token}`, // Include JWT token
        },
      });
      setUsers(response.data);
    } catch (error) {
      setError("Error fetching users."); // Set error state
      console.error("Error fetching users:", error);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`/api/admin/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        });
        setUsers(users.filter((user) => user._id !== userId)); // Update state
      } catch (error) {
        setError("Error deleting user."); // Set error state
        console.error("Error deleting user:", error);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold">Admin Panel</h2>
      {error && <p className="text-red-500">{error}</p>}{" "}
      {/* Display error if exists */}
      <table className="min-w-full mt-4 border">
        <thead>
          <tr>
            <th className="border">Username</th>
            <th className="border">Email</th>
            <th className="border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user._id}>
                <td className="border">{user.username}</td>
                <td className="border">{user.email}</td>
                <td className="border">
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="border text-center">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
