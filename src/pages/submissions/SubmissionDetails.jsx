import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Modal, Button, Form } from "react-bootstrap";
import BreadCrumb from "../../components/BreadCrumb";

const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = import.meta.env.VITE_BASE_URL;

const SubmissionDetails = () => {
    
    const { id } = useParams();
    const navigate = useNavigate();
    const [submission, setSubmission] = useState(null);
    const [loading, setLoading] = useState(true);

    // Status modal
    const [showModal, setShowModal] = useState(false);
    const [newStatus, setNewStatus] = useState("");

    // Fetch submission by ID
    const fetchSubmission = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const res = await axios.get(`${API_URL}/submissions/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.data.success) {
                setSubmission(res.data.data);
                setNewStatus(res.data.data.status || "Pending");
            } else {
                toast.error("Failed to fetch submission");
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubmission();
    }, [id]);

    // Update status
    const handleStatusUpdate = async () => {
        if (!submission) return;
        try {
            const token = localStorage.getItem("authToken");
            await axios.patch(
                `${API_URL}/submissions/${submission._id}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Status updated successfully");
            setShowModal(false);
            fetchSubmission(); // refresh
        } catch (err) {
            console.error(err);
            toast.error("Failed to update status");
        }
    };

    const handleFileDownload = async (file) => {
    try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(`${BASE_URL}/${file.fileUrl}`, {
            responseType: "blob", // important
            headers: { Authorization: `Bearer ${token}` },
        });

        // Create a blob link
        const blob = new Blob([response.data]);
        const url = window.URL.createObjectURL(blob);

        // Create a temporary link to trigger download
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", file.fileName || "download");
        document.body.appendChild(link);
        link.click();

        // Cleanup
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (err) {
        console.error("Download failed:", err);
        toast.error("Failed to download file");
    }
};

    if (loading) return <div>Loading...</div>;
    if (!submission) return <div>No submission found.</div>;

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <BreadCrumb subLabel="Submissions" pageTitle="Submission Details" />
                <div className="d-flex align-items-start gap-2 flex-wrap">
                    <Link to="/form-submissions" className="btn btn-primary d-flex align-items-center">
                        <i className="ti ti-chevron-left f-24"></i> Back to Submissions
                    </Link>
                </div>
            </div>
            <div className="container mt-3">


                <div className="card p-3 mb-3">
                    <div className="row">
                        <div className="col-10">
                            <h3>Submission Details</h3>
                        </div>
                        <div className="col-2 text-end">
                            <button className="btn btn-sm btn-light-primary me-2 " onClick={() => setShowModal(true)}>
                                <i className="ti ti-pencil f-18" />
                            </button>

                            {/* <button className="btn btn-sm btn-light-danger" onClick={() => setShowModal(true)}>
                                <i className="ti ti-trash f-18" />
                            </button> */}

                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">

                            <h5>Article Info</h5>
                            <p>
                                <strong>Title:</strong> {submission.articleTitle}
                                &nbsp;
                                <span
                                    className={`badge bg-light-${submission.status === "Approved"
                                        ? "success"
                                        : submission.status === "Rejected"
                                            ? "danger"
                                            : "warning"
                                        }`}
                                >
                                    {submission.status || "Pending"}
                                </span>
                                <br />
                                <strong>Type:</strong> {submission.articleType}
                                <br />
                                <strong>Journal:</strong> {submission.journal?.title}
                                <br />
                                <strong>Abstract:</strong> {submission.abstract}
                            </p>
                        </div>
                        <div className="col-md-6">

                            <h5>User Info</h5>
                            <p>
                                <strong>Name:</strong> {submission.name}
                                <br />
                                <strong>Email:</strong> {submission.email}
                                <br />
                                <strong>Country:</strong> {submission.country}
                            </p>
                        </div>

                    </div>


                    <h5>Files</h5>
                    {submission.files?.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-bordered table-hover">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>File Name</th>
                                        <th>Type</th>
                                        <th>Size (KB)</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {submission.files.map((file, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{file.fileName}</td>
                                            <td>{file.fileType}</td>
                                            <td>{(file.fileSize / 1024).toFixed(2)}</td>
                                            {/* <td>
                                                <a
                                                    href={`${BASE_URL}/${file.fileUrl}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-sm btn-light-primary"
                                                >
                                                    <i className="ti ti-eye"></i>
                                                </a>
                                            </td> */}

                                            <td>
  <button
    className="btn btn-sm btn-light-primary"
    onClick={() => handleFileDownload(file)}
  >
    <i className="ti ti-download"></i>
  </button>
</td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-muted">No files uploaded.</p>
                    )}



                </div>

                {/* Status Modal */}
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update Submission Status</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                        </Form.Select>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleStatusUpdate}>
                            Update Status
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
};

export default SubmissionDetails;
