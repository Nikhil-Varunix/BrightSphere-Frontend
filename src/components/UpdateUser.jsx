// src/pages/admin/UpdateUser.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // To get userId from URL
import toast from "react-hot-toast";
import BreadCrumb from "../components/BreadCrumb";

const UpdateUser = () => {
  const { id } = useParams(); // assuming route like /admin/update-user/:id
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Viewer",
    status: "Active",
    phone: "",
    location: "",
    notes: "",
    profilePicture: null,
  });

  // Fetch existing user details
  useEffect(() => {
    // Example API call (replace with your backend endpoint)
    const fetchUser = async () => {
      try {
        // const response = await fetch(`/api/users/${id}`);
        // const data = await response.json();
        const data = {
          fullName: "John Doe",
          email: "john@example.com",
          phone: "9876543210",
          role: "Editor",
          status: "Active",
        }; // mock data

        setFormData({ ...formData, ...data });
      } catch (error) {
        toast.error("Failed to load user data");
      }
    };
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePicture") {
      setFormData({ ...formData, profilePicture: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    // Prepare payload (ignore password if empty)
    const payload = { ...formData };
    if (!payload.password) {
      delete payload.password;
      delete payload.confirmPassword;
    }

    console.log("Updated Data:", payload);
    toast.success("User updated successfully!");
    // Call your API here (PUT /api/users/:id)
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <BreadCrumb subLabel="Update User" />
      </div>

      <div className="card">
        <div className="card-header">
          <h5>Update User</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* Left Column */}
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mobile</label>
                  <input
                    type="text"
                    className="form-control"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter mobile number"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter new password"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    required
                  />
                </div>
                 <div className="mb-3">
                  <label className="form-label">Designation</label>
                  <select
                    className="form-select"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="Admin">Developer1</option>
                    <option value="Editor">Developer2</option>
                    <option value="Viewer">Developer3</option>
                  </select>
                </div>
                {/* <div className="mb-3">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                  />
                </div> */}
              </div>
            </div>

            <button type="submit" className="btn btn-primary mt-3">
              Update User
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateUser;
