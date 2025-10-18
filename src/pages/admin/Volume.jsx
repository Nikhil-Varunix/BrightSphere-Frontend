import BreadCrumb from "../../components/BreadCrumb";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { formatDate, formatTime } from "../../utils/time";

const API_URL = import.meta.env.VITE_API_URL;

const Volumes = () => {
  const [volumes, setVolumes] = useState([]);
  const [journals, setJournals] = useState([]);
  const [newVolume, setNewVolume] = useState({ volumeName: "", journal: "" });
  const [filters, setFilters] = useState({ search: "" });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    total: 0,
  });

  
  // Fetch all journals (no pagination)
  const fetchJournals = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get(`${API_URL}/journals/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setJournals(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch journals");
    }
  };

  // Create a new volume
  const handleCreateVolume = async () => {
    if (!newVolume.volumeName.trim() || !newVolume.journal) {
      toast.error("Please enter all required fields");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.post(
        `${API_URL}/volumes`,
        { ...newVolume, volumeName: newVolume.volumeName.trim() },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Volume created successfully!");
        setNewVolume({ volumeName: "", journal: "" });
        fetchVolumes();
      } else {
        toast.error(res.data.message || "Failed to create volume");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong while creating volume");
    }
  };

  // Fetch volumes (with pagination)
  const fetchVolumes = async (page = 1, limit = 10, search = "") => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get(`${API_URL}/volumes?page=${page}&limit=${limit}&search=${search}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setVolumes(res.data.data);
        setPagination({
          page: res.data.pagination.page,
          limit: res.data.pagination.limit,
          totalPages: res.data.pagination.totalPages,
          total: res.data.pagination.total,
        });
      } else {
        toast.error("Failed to fetch volumes");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while fetching volumes");
    }
  };

  useEffect(() => {
    fetchJournals();
    fetchVolumes(pagination.page, pagination.limit, filters.search);
  }, []);

  // Delete volume
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this volume?")) return;
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`${API_URL}/volumes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Volume deleted successfully");
      fetchVolumes(pagination.page, pagination.limit, filters.search);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete volume");
    }
  };

  // Search volumes
  const handleSearch = (e) => {
    const value = e.target.value;
    setFilters((prev) => ({ ...prev, search: value }));
    fetchVolumes(1, pagination.limit, value);
  };

  // Pagination change
  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > pagination.totalPages) return;
    fetchVolumes(pageNumber, pagination.limit, filters.search);
  };

  return (
    <>
      {/* Header + Breadcrumb */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <BreadCrumb subLabel="Admin" pageTitle="Volumes" />
        <div className="d-flex align-items-start gap-2 flex-wrap">
          <Link to="/journals" className="btn btn-primary d-flex align-items-center">
            <i className="ti ti-chevron-left f-24"></i> Back to Journals
          </Link>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card table-card">
            <div className="card-body pt-3">
              {/* Search + Add Volume */}
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3 px-3">
                <input
                  type="text"
                  className="form-control py-2"
                  style={{ width: "200px", fontSize: "14px" }}
                  placeholder="Search..."
                  value={filters.search}
                  onChange={handleSearch}
                />

                <div className="d-flex align-items-center gap-2">

                  <select
                    className="form-control py-2"
                    style={{ width: "200px", fontSize: "14px" }}
                    value={newVolume.journal}
                    onChange={(e) => setNewVolume({ ...newVolume, journal: e.target.value })}
                  >
                    <option value="">Select Journal</option>
                    {journals.map((j) => (
                      <option key={j._id} value={j._id}>{j.title}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Volume name"
                    className="form-control py-2"
                    style={{ width: "200px", fontSize: "14px" }}
                    value={newVolume.volumeName}
                    onChange={(e) => setNewVolume({ ...newVolume, volumeName: e.target.value })}
                  />

                  <button className="btn btn-primary d-flex align-items-center" onClick={handleCreateVolume}>
                    <i className="ti ti-plus me-1"></i> Add Volume
                  </button>
                </div>
              </div>

              {/* Volumes Table */}
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Volume</th>
                      <th>Journal</th>
                      <th>Created By</th>
                      <th>Created Date</th>
                      <th>Updated Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {volumes.length > 0 ? (
                      volumes.map((v, index) => (
                        <tr key={v._id}>
                          <td>{index + 1 + (pagination.page - 1) * pagination.limit}</td>
                          <td>{v.volumeName || "--"}</td>
                          <td>{v.journal?.title || "--"}</td>
                          <td>{v.createdBy?.firstName + " " + v.createdBy?.lastName || "--"}</td>
                          <td>{formatDate(v.createdAt)} {formatTime(v.createdAt)}</td>
                          <td>{formatDate(v.updatedAt)} {formatTime(v.updatedAt)}</td>
                          <td>
                            <span className={`badge ${v.status ? "bg-light-success" : "bg-light-danger"}`}>
                              {v.status ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td>
                            <button className="btn btn-sm btn-light-danger" onClick={() => handleDelete(v._id)}>
                              <i className="ti ti-trash f-18" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center">No volumes found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
<div className="datatable-bottom px-3 pb-3">
  <div className="datatable-info">
    Showing{" "}
    {volumes.length > 0
      ? 1 + (pagination.page - 1) * pagination.limit
      : 0}{" "}
    to{" "}
    {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
    {pagination.total} entries
  </div>
  <nav className="datatable-pagination">
    <ul className="datatable-pagination-list">
      {/* Previous button */}
      <li
        className={`datatable-pagination-list-item ${
          pagination.page <= 1 ? "datatable-hidden datatable-disabled" : ""
        }`}
      >
        <button onClick={() => handlePageChange(pagination.page - 1)}>‹</button>
      </li>

      {/* Page numbers */}
      {Array.from({ length: pagination.totalPages }, (_, i) => (
        <li
          key={i + 1}
          className={`datatable-pagination-list-item ${
            pagination.page === i + 1 ? "datatable-active" : ""
          }`}
        >
          <button onClick={() => handlePageChange(i + 1)}>{i + 1}</button>
        </li>
      ))}

      {/* Next button */}
      <li
        className={`datatable-pagination-list-item ${
          pagination.page >= pagination.totalPages
            ? "datatable-hidden datatable-disabled"
            : ""
        }`}
      >
        <button onClick={() => handlePageChange(pagination.page + 1)}>›</button>
      </li>
    </ul>
  </nav>
</div>


            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Volumes;
