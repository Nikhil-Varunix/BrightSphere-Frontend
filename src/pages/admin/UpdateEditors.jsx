// src/pages/admin/UpdateEditors.jsx
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import BreadCrumb from "../../components/BreadCrumb";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = import.meta.env.VITE_BASE_URL;

const UpdateEditors = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    designation: "",
    department: "",
    university: "",
    address: "",
    status: "Active",
    coverImage: "",
  });

  // 🔹 Fetch editor details
  useEffect(() => {
    const fetchEditor = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get(`${API_URL}/editors/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          const e = res.data.data.editor || res.data.data;
          setFormData({
            firstName: e.firstName || "",
            lastName: e.lastName || "",
            designation: e.designation || "",
            department: e.department || "",
            university: e.university || "",
            address: e.address || "",
            status: e.status ? "Active" : "Inactive",
            coverImage: e.coverImage || "",
          });
          setPreviewImage(e.coverImage ? `${BASE_URL}/${e.coverImage}` : null);
        } else {
          toast.error("Editor not found!");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load editor details!");
      } finally {
        setLoading(false);
      }
    };

    fetchEditor();
  }, [id]);

  // 🔹 Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "coverImage") {
      const file = files[0];
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // 🔹 Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error("Please enter the editor's first and last name!");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const data = new FormData();

      for (const key in formData) {
        if (key !== "coverImage") data.append(key, formData[key]);
      }
      if (imageFile) data.append("coverImage", imageFile);

      await axios.put(`${API_URL}/editors/update/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Editor updated successfully!");
      setTimeout(() => navigate(`/admin/editors/details/${id}`), 1000);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update editor!");
    }
  };

  if (loading) return <p>Loading editor data...</p>;

  return (
    <>
      {/* Header */}
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
      <div className="card shadow-sm">
        <div className="card-header">
          <h5>Update Editor</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} encType="multipart/form-data" className="row">
            {/* Left Column */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label fw-bold">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  required
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label fw-bold">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  required
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label fw-bold">Designation</label>
                <input
                  type="text"
                  className="form-control"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="Enter designation"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label fw-bold">Department / Program</label>
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
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label fw-bold">University / Institute</label>
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
                <label className="form-label fw-bold">Status</label>
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
              <div className="mb-3">
                <label className="form-label fw-bold">Address</label>
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                />
              </div>
            </div>
            <div className="col-md-6">



              <div className="mb-3">
                <label className="form-label fw-bold">Profile Image</label>
                <input
                  type="file"
                  className="form-control"
                  name="coverImage"
                  accept="image/*"
                  onChange={handleChange}
                />
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Editor"
                    className="rounded shadow mt-3"
                    style={{ width: "170px", height: "170px", objectFit: "cover" }}
                  />
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="col-12">
              <button type="submit" className="btn btn-primary">
                Update Editor
              </button>
            </div>
          </form>
        </div >
      </div >
    </>
  );
};

export default UpdateEditors;
