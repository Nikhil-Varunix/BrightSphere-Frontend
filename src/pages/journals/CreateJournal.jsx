import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; 
import Select from "react-select";
import BreadCrumb from "../../components/BreadCrumb";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

export default function CreateJournal() {
  const quillRef = useRef();
  const [formData, setFormData] = useState({
    title: "",
    subTitle: "",
    content: "",
    coverImage: null,
  });
  const [editorsOptions, setEditorsOptions] = useState([]);
  const [selectedEditors, setSelectedEditors] = useState([]);
  
  useEffect(() => {
    const fetchEditors = async () => {
      try {

        const token = localStorage.getItem("authToken");
        const res = await axios.get(`${API_URL}/editors`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setEditorsOptions(
            res.data.data.map((e) => ({
              value: e._id,
              label: `${e.firstName} ${e.lastName}`,
            }))
          );
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load editors");
      }
    };
    fetchEditors();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "coverImage" ? files[0] : value,
    }));
  };

  const handleContentChange = (value) =>
    setFormData((prev) => ({ ...prev, content: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("subTitle", formData.subTitle);
      payload.append("content", formData.content);
      payload.append(
        "editors",
        JSON.stringify(selectedEditors.map((o) => o.value))
      );
      if (formData.coverImage) payload.append("coverImage", formData.coverImage);

      const token = localStorage.getItem("authToken");
      await axios.post(`${API_URL}/journals`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Journal created successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.response.data.message);
    }
  };


  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <BreadCrumb subLabel="Create Journal" />
        <Link to="/journals" className="btn btn-primary">
          <i className="ti ti-arrow-left"></i> Back to Journals
        </Link>
      </div>

      <div className="container mt-4">
        <div className="card shadow-sm">
          <div className="card-header bg-light-primary text-white">
            <h5>Create Journal</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-12">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="col-12">
                <label>Sub Title</label>
                <input
                  type="text"
                  name="subTitle"
                  value={formData.subTitle}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="col-12">
                <label>Editorials</label>
                <Select
                  isMulti
                  options={editorsOptions}
                  value={selectedEditors}
                  onChange={setSelectedEditors}
                  classNamePrefix="select"
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: "0.375rem",
                      minHeight: "52px",
                      boxShadow: "none",
                      borderColor: "#303f50",
                      backgroundColor: "transparent",
                    }),
                    menu: (base) => ({
                      ...base,
                      borderRadius: "0.375rem",
                      backgroundColor: "#f8f9fa",
                      padding: "4px",
                      zIndex: 9999,
                    }),
                    option: (base, state) => ({
                      ...base,
                      borderRadius: "4px",
                      padding: "10px 12px",
                      fontWeight: 500,
                      backgroundColor: state.isSelected
                        ? "#04a9f5"
                        : state.isFocused
                          ? "#e3f2fd"
                          : "transparent",
                      color: state.isSelected ? "white" : "#212529",
                      cursor: "pointer",
                    }),
                    multiValue: (base) => ({
                      ...base,
                      backgroundColor: "#04a9f5",
                      borderRadius: "10px",
                      padding: "4px 6px",
                    }),
                    multiValueLabel: (base) => ({
                      ...base,
                      color: "white",
                      fontWeight: 600,
                      fontSize: "14px",
                    }),
                    multiValueRemove: (base) => ({
                      ...base,
                      color: "white",
                      ":hover": {
                        color: "white",
                      },
                    }),
                  }}
                />
              </div>

              <div className="col-12">
                <label>Journal Image</label>
                <input
                  type="file"
                  name="coverImage"
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="mb-3 mt-4">
                <label className="form-label">Content</label>
                <ReactQuill
                  ref={quillRef}
                  theme="snow"
                  value={formData.content}
                  onChange={handleContentChange}
                  placeholder="Write your article here..."
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, false] }],
                      ["bold", "italic", "underline"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["link"],
                      ["clean"],
                    ],
                  }}
                  formats={[
                    "header",
                    "bold",
                    "italic",
                    "underline",
                    "list",
                    "bullet",
                    "link",
                  ]}
                  style={{ height: "300px", marginBottom: "50px" }}
                />

              </div>

              <div className="col-12">
                <button type="submit" className="btn btn-primary">
                  Submit Journal
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

