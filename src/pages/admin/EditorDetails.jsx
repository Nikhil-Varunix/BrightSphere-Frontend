// src/pages/admin/EditorDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import BreadCrumb from "../../components/BreadCrumb";
import { formatDate, formatTime } from "../../utils/time";

const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = import.meta.env.VITE_BASE_URL;

const EditorDetails = () => {
  const { id } = useParams();
  const [editor, setEditor] = useState(null);
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEditorDetails = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get(`${API_URL}/editors/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          const { editor, journals } = res.data.data;
          setEditor(editor);
          setJournals(journals || []);
        } else {
          toast.error("Editor not found!");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch editor details");
      } finally {
        setLoading(false);
      }
    };

    fetchEditorDetails();
  }, [id]);

  if (loading) return <p>Loading editor details...</p>;
  if (!editor) return <p>Editor not found.</p>;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <BreadCrumb subLabel="Admin" pageTitle="Editor Details" />
        <div className="d-flex gap-2 flex-wrap">
          <Link
            to="/admin/editors"
            className="btn btn-primary d-flex align-items-center"
          >
            <i className="ti ti-arrow-left f-24"></i> Back to Editors
          </Link>
        </div>
      </div>

      {/* Editor Details Card */}
      <div className="card mb-3">
        <div className="card-header d-flex align-items-center justify-content-between">
          <h5>Editor Information</h5>
          <Link className="btn btn-light d-inline-flex" to={`/admin/editors/update/${editor._id}`}><i className="ti ti-pencil f-18"></i> Update Editor</Link>
        </div>
        <div className="card-body">
          <div className="row">
            {/* Left Column: Image */}
            <div className="col-md-3 text-center">
              {editor.coverImage ? (
                <img
                  src={`${BASE_URL}/${editor.coverImage}`}
                  alt={editor.fullname}
                  style={{ width: "100%", borderRadius: "8px", objectFit: "cover" }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "200px",
                    backgroundColor: "#e9ecef",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "8px",
                  }}
                >
                  No Image
                </div>
              )}
            </div>

            {/* Right Column: Info */}
            <div className="col-md-9">
              <p><strong className="text-info">Name:</strong> {editor.firstName} {editor.lastName}</p>
              <p><strong className="text-info">Designation:</strong> {editor.designation || "—"}</p>
              <p><strong className="text-info">Department / Program:</strong> {editor.department || "—"}</p>
              <p><strong className="text-info">University / Institute:</strong> {editor.university || "—"}</p>
              <p><strong className="text-info">Address:</strong> {editor.address || "—"}</p>
              <p>
                <strong className="text-info">Status:</strong>{" "}
                <span className={`badge ${editor.status ? "bg-light-success" : "bg-light-danger"}`}>
                  {editor.status ? "Active" : "Inactive"}
                </span>
              </p>
              <p>
                <strong className="text-info">Created At:</strong> {editor.createdAt ? formatDate(editor.createdAt) : "—"}{" "}
                <small>{editor.createdAt ? formatTime(editor.createdAt) : ""}</small>
              </p>
              
            </div>
          </div>
        </div>
      </div>

      {/* Journals Table */}
      <div className="card">
        <div className="card-header">
          <h5>Journals Associated</h5>
        </div>
        <div className="card-body">
          {journals.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Journal Title</th>
                    <th>ISSN</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {journals.map((j, index) => (
                    <tr key={j._id}>
                      <td>{index + 1}</td>
                      <td><Link to={`/admin/journals/journal-details/${j._id}`}>
                      {j.title}</Link></td>
                      <td>{j.issn || "—"}</td>
                      <td>
                        <span className={`badge ${j.status ? "bg-light-success" : "bg-light-danger"}`}>
                          {j.status ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No journals assigned to this editor.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default EditorDetails;
