// src/pages/admin/EditorDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import BreadCrumb from "../../components/BreadCrumb";
import { formatDate, formatTime } from "../../utils/time";

// Mock editor data
const MOCK_EDITORS = [
  {
    _id: "1",
    name: "Sandro Gelsomino",
    designation: "Professor of Cardiac Surgery",
    department: "Head of Cardiothoracic Surgery Research Program",
    university: "University of Maastricht, CARIM",
    city: "Maastricht",
    country: "The Netherlands",
    status: "Active",
    createdBy: { firstName: "Admin" },
    createdAt: new Date("2025-01-10T10:30:00").toISOString(),
    updatedBy: { firstName: "Admin" },
    updatedAt: new Date("2025-04-20T15:45:00").toISOString(),
  },
  {
    _id: "2",
    name: "Jane Smith",
    designation: "Assistant Professor",
    department: "Neuroscience",
    university: "Harvard University",
    city: "Cambridge",
    country: "USA",
    status: "Inactive",
    createdBy: { firstName: "Admin" },
    createdAt: new Date("2024-09-15T09:00:00").toISOString(),
    updatedBy: { firstName: "Editor" },
    updatedAt: new Date("2025-02-28T11:15:00").toISOString(),
  },
];

const EditorDetails = () => {
  const { id } = useParams(); // Editor ID from URL
  const [editor, setEditor] = useState(null);

  useEffect(() => {
    // Simulate fetching dynamic data
    const fetchEditor = () => {
      const foundEditor = MOCK_EDITORS.find((e) => e._id === id);
      if (!foundEditor) {
        toast.error("Editor not found!");
        setEditor(null);
      } else {
        setEditor(foundEditor);
      }
    };

    fetchEditor();
  }, [id]);

  if (!editor) return <p>Loading editor details...</p>;

  return (
    <>
      {/* Header + Breadcrumb */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <BreadCrumb subLabel="Admin" pageTitle="Editor Details" />
        <div className="d-flex gap-2 flex-wrap">
          <Link
            to="/admin/editors"
            className="btn btn-primary d-flex align-items-center"
          >
            <i className="ti ti-arrow-left f-24"></i> Back to Editors
          </Link>
          {/* <Link
            to={`/admin/editors/update/${editor._id}`}
            className="btn btn-warning d-flex align-items-center"
          >
            <i className="ti ti-edit f-24"></i> Edit
          </Link> */}
        </div>
      </div>

      {/* Editor Details Card */}
      <div className="card">
        <div className="card-header">
          <h5>Editor Information</h5>
        </div>
        <div className="card-body">
          <div className="row">
            {/* Left Column */}
            <div className="col-md-6">
              <p><strong>Name:</strong> {editor.name}</p>
              <p><strong>Designation:</strong> {editor.designation || "—"}</p>
              <p><strong>Department / Program:</strong> {editor.department || "—"}</p>
              <p><strong>University / Institute:</strong> {editor.university || "—"}</p>
            </div>

            {/* Right Column */}
            <div className="col-md-6">
              <p><strong>City:</strong> {editor.city || "—"}</p>
              <p><strong>Country:</strong> {editor.country || "—"}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={`badge ${editor.status === "Active" ? "bg-light-success" : "bg-light-danger"}`}>
                  {editor.status}
                </span>
              </p>
              <p><strong>Created By:</strong> {editor.createdBy?.firstName || "—"}</p>
              <p>
                <strong>Created At:</strong> {editor.createdAt ? formatDate(editor.createdAt) : "—"}{" "}
                <small>{editor.createdAt ? formatTime(editor.createdAt) : ""}</small>
              </p>
              <p><strong>Updated By:</strong> {editor.updatedBy?.firstName || "—"}</p>
              <p>
                <strong>Updated At:</strong> {editor.updatedAt ? formatDate(editor.updatedAt) : "—"}{" "}
                <small>{editor.updatedAt ? formatTime(editor.updatedAt) : ""}</small>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditorDetails;
