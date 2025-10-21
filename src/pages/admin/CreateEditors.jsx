import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import BreadCrumb from "../../components/BreadCrumb";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = import.meta.env.VITE_BASE_URL;

const CreateEditor = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    designation: "",
    department: "",
    university: "",
    address: "",
    status: "Active",
  });

  const [coverImage, setCoverImage] = useState(null);
  const [preview, setPreview] = useState("");

  // Handle text fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error("Please enter full name!");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required!");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const submitData = new FormData();

      // append all text fields
      Object.entries(formData).forEach(([key, value]) =>
        submitData.append(key, value)
      );

      // append file if exists
      if (coverImage) submitData.append("coverImage", coverImage);

      const res = await axios.post(`${API_URL}/editors`, submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        toast.success("Editor created successfully!");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          designation: "",
          department: "",
          university: "",
          address: "",
          status: "Active",
        });
        setCoverImage(null);
        setPreview("");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create editor");
    }
  };

  return (
    <>
      {/* Header + Breadcrumb */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <BreadCrumb subLabel="Admin" pageTitle="Create Editor" />
        <Link to="/admin/editors" className="btn btn-primary">
          <i className="ti ti-arrow-left me-2"></i>Back to Editors
        </Link>
      </div>

      {/* Form Card */}
      <div className="card shadow-sm">
        <div className="card-header">
          <h5 className="mb-0">Create New Editor</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="row g-3">
              {/* First Name */}
              <div className="col-md-6 form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="firstName">First Name</label>
              </div>

              {/* Last Name */}
              <div className="col-md-6 form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="lastName">Last Name</label>
              </div>

              {/* Email */}
              <div className="col-md-6 form-floating">
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="email">Email</label>
              </div>

              {/* Designation */}
              <div className="col-md-6 form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="designation"
                  name="designation"
                  placeholder="Designation"
                  value={formData.designation}
                  onChange={handleChange}
                />
                <label htmlFor="designation">Designation</label>
              </div>

              {/* Department */}
              <div className="col-md-6 form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="department"
                  name="department"
                  placeholder="Department"
                  value={formData.department}
                  onChange={handleChange}
                />
                <label htmlFor="department">Department / Program</label>
              </div>

              {/* University */}
              <div className="col-md-6 form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="university"
                  name="university"
                  placeholder="University"
                  value={formData.university}
                  onChange={handleChange}
                />
                <label htmlFor="university">University / Institute</label>
              </div>

              {/* Address */}
              <div className="col-12 form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                />
                <label htmlFor="address">Address</label>
              </div>

              {/* Cover Image Upload */}
              <div className="col-md-6">
                <label className="form-label fw-bold">Profile Image</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {preview && (
                  <div className="mt-3">
                    <img
                      src={preview}
                      alt="Preview"
                      className="img-thumbnail"
                      style={{ maxWidth: "150px", borderRadius: "5px" }}
                    />
                  </div>
                )}
              </div>
            </div>

            <button type="submit" className="btn btn-primary mt-4">
              Create Editor
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateEditor;
