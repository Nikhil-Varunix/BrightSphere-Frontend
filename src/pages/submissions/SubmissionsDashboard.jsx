import BreadCrumb from "../../components/BreadCrumb";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";

const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = import.meta.env.VITE_BASE_URL;

const SubmissionsDashboard = () => {
    const [submissions, setSubmissions] = useState([]);
    const [filters, setFilters] = useState({ search: "" });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        totalPages: 1,
        total: 0,
    });

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [currentSubmission, setCurrentSubmission] = useState(null);
    const [newStatus, setNewStatus] = useState("");

    // Fetch submissions
    const fetchSubmissions = async (page = 1, limit = 10, search = "") => {
        try {
            const token = localStorage.getItem("authToken");
            const res = await axios.get(
                `${API_URL}/submissions/all?page=${page}&limit=${limit}&search=${search}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                setSubmissions(res.data.data);
                setPagination({
                    page: res.data.pagination?.page || 1,
                    limit: res.data.pagination?.limit || 10,
                    totalPages: res.data.pagination?.totalPages || 1,
                    total: res.data.pagination?.total || res.data.data.length,
                });
            } else toast.error("Failed to fetch submissions");
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong while fetching submissions");
        }
    };


    useEffect(() => {
        fetchSubmissions(pagination.page, pagination.limit, filters.search);
    }, []);

    // Handle search
    const handleSearch = (e) => {
        const value = e.target.value;
        setFilters((prev) => ({ ...prev, search: value }));
        fetchSubmissions(1, pagination.limit, value); // reset to page 1 on search
    };


    // Pagination
    const handlePageChange = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > pagination.totalPages) return;
        fetchSubmissions(pageNumber, pagination.limit, filters.search);
    };


    // Soft delete
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this submission?")) return;
        try {
            const token = localStorage.getItem("authToken");
            await axios.delete(`${API_URL}/submissions/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Submission deleted successfully");
            fetchSubmissions(pagination.page, pagination.limit, filters.search);
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete submission");
        }
    };

    // Open status modal
    const openStatusModal = (submission) => {
        setCurrentSubmission(submission);
        setNewStatus(submission.status || "Pending");
        setShowModal(true);
    };

    // Update submission status
    const handleStatusUpdate = async () => {
        if (!currentSubmission) return;
        try {
            const token = localStorage.getItem("authToken");
            await axios.patch(
                `${API_URL}/submissions/${currentSubmission._id}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Status updated successfully");
            setShowModal(false);
            fetchSubmissions(pagination.page, pagination.limit, filters.search);
        } catch (err) {
            console.error(err);
            toast.error("Failed to update status");
        }
    };

    return (
        <>
            {/* Header + Breadcrumb */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <BreadCrumb subLabel="Submissions" />
                <div className="d-flex align-items-start gap-2 flex-wrap">
                    <Link to="/" className="btn btn-primary d-flex align-items-center">
                        <i className="ti ti-chevron-left f-24"></i> Back to Dashboard
                    </Link>
                </div>
            </div>

          <div className="card pt-3">
              {/* Search */}
            <div className="d-flex flex-wrap align-items-center gap-2 mb-3 px-3">
                <input
                    type="text"
                    className="form-control py-2"
                    style={{ width: "200px", fontSize: "14px" }}
                    placeholder="Search..."
                    value={filters.search}
                    onChange={handleSearch}
                />
            </div>

            {/* Submissions Table */}
            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>User</th>
                            <th>Country</th>
                            <th>Article Title</th>
                            <th>Article Type</th>
                            <th>Journal</th>
                            <th>Status</th>
                            <th>No. of Files</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {submissions.length > 0 ? (
                            submissions.map((s, index) => (
                                <tr key={s._id}>
                                    <td>{index + 1 + (pagination.page - 1) * pagination.limit}</td>
                                    <td className="fw-semibold">
                                        {s.name || "--"}
                                        <br />
                                        <small>{s.email || "--"}</small>
                                    </td>
                                    <td>{s.country || "--"}</td>
                                    <td>{s.articleTitle || "--"}</td>
                                    <td>{s.articleType || "--"}</td>
                                    <td title={s.journal || "--"}>
                                        <span
                                            style={{
                                                display: "inline-block",
                                                maxWidth: "120px",
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                verticalAlign: "middle",
                                            }}
                                        >
                                            {s.journal || "--"}
                                        </span>
                                    </td>
                                    <td>
                                        <span
                                            className={`badge ${s.status === "Approved"
                                                    ? "bg-light-success"
                                                    : s.status === "Rejected"
                                                        ? "bg-light-danger"
                                                        : "bg-light-warning"
                                                }`}
                                        >
                                            {s.status || "Pending"}
                                        </span>
                                    </td>
                                    <td>{s.files?.length || 0}</td>
                                    <td>
                                        <ul className="list-inline m-0">
                                            <li className="list-inline-item">
                                                <Link
                                                    to={`/form-submissions/view/${s._id}`}
                                                    className="btn btn-sm btn-light-primary mx-1"
                                                    title="View"
                                                >
                                                    <i className="ti ti-eye f-18"></i>
                                                </Link>
                                            </li>
                                            <li className="list-inline-item">
                                                <span
                                                    className="btn btn-sm btn-light-warning"
                                                    title="Change Status"
                                                    onClick={() => openStatusModal(s)}
                                                >
                                                    <i className="ti ti-pencil f-18" />
                                                </span>
                                            </li>
                                            <li className="list-inline-item">
                                                <span
                                                    className="btn btn-sm btn-light-danger"
                                                    title="Delete"
                                                    onClick={() => handleDelete(s._id)}
                                                >
                                                    <i className="ti ti-trash f-18" />
                                                </span>
                                            </li>
                                        </ul>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="text-center">
                                    No submissions found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="datatable-bottom">
                <div className="datatable-info">
                    Showing{" "}
                    {submissions.length > 0
                        ? 1 + (pagination.page - 1) * pagination.limit
                        : 0}{" "}
                    to {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                    {pagination.total} entries
                </div>

                <nav className="datatable-pagination">
                    <ul className="datatable-pagination-list">
                        <li className={`datatable-pagination-list-item ${pagination.page <= 1 ? "datatable-hidden datatable-disabled" : ""}`}>
                            <button onClick={() => handlePageChange(pagination.page - 1)}>‹</button>
                        </li>

                        {Array.from({ length: pagination.totalPages }, (_, i) => (
                            <li key={i + 1} className={`datatable-pagination-list-item ${pagination.page === i + 1 ? "datatable-active" : ""}`}>
                                <button onClick={() => handlePageChange(i + 1)}>{i + 1}</button>
                            </li>
                        ))}

                        <li className={`datatable-pagination-list-item ${pagination.page >= pagination.totalPages ? "datatable-hidden datatable-disabled" : ""}`}>
                            <button onClick={() => handlePageChange(pagination.page + 1)}>›</button>
                        </li>
                    </ul>
                </nav>

            </div>
          </div>

            {/* Status Update Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Submission Status</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                    >
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
        </>
    );
};

export default SubmissionsDashboard;

