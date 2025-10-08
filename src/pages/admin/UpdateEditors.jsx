// src/pages/admin/UpdateEditors.jsx
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import BreadCrumb from "../../components/BreadCrumb";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const UpdateEditors = () => {
  const { id } = useParams(); // 🔹 Editor ID from URL

  // 🔹 Default Data
  const [formData, setFormData] = useState({
    name: "Sandro Gelsomino",
    designation: "Professor of Cardiac Surgery",
    department: "Head of Cardiothoracic Surgery Research Program",
    university: "University of Maastricht, CARIM",
    city: "Maastricht	",
    country: "The Netherlands",
    status: "Active",
  });

  // 🔹 Fetch existing editor data
  useEffect(() => {
    const fetchEditor = async () => {
      try {
        const { data } = await axios.get(`/api/editors/${id}`);
        setFormData(data);
      } catch (err) {
        toast.error("Failed to load editor details! Showing default data.");
      }
    };
    fetchEditor();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter editor's name!");
      return;
    }

    try {
      await axios.put(`/api/editors/${id}`, formData);
      toast.success("Editor updated successfully!");
      console.log("Updated Editor Data:", formData);
    } catch (err) {
      toast.error("Failed to update editor!");
    }
  };

  return (
    <>
      {/* Header + Breadcrumb */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <BreadCrumb subLabel="Admin" pageTitle="Update Editor" />
        <div className="d-flex align-items-start gap-2 flex-wrap">
          <Link
            to="/admin/editors"
            className="btn btn-primary d-flex align-items-center"
          >
            <i className="ti ti-arrow-left f-24"></i> Back to Editors
          </Link>
        </div>
      </div>

      {/* Form Card */}
      <div className="card">
        <div className="card-header">
          <h5>Update Editor</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* Left Column */}
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter name"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Designation</label>
                  <input
                    type="text"
                    className="form-control"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    placeholder="Enter designation"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Department / Program</label>
                  <input
                    type="text"
                    className="form-control"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="Enter department / program"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">University / Institute</label>
                  <input
                    type="text"
                    className="form-control"
                    name="university"
                    value={formData.university}
                    onChange={handleChange}
                    placeholder="Enter university / institute"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    className="form-control"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Country</label>
                  <input
                    type="text"
                    className="form-control"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Enter country"
                  />
                </div>
              </div>
            </div>

            {/* Status Dropdown */}
            <div className="mb-3">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary mt-3">
              Update Editor
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateEditors;
