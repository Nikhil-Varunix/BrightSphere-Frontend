import BreadCrumb from "../../components/BreadCrumb";
import EditIssueModal from "../../components/EditIssueModal";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { formatDate, formatTime } from "../../utils/time";

const API_URL = import.meta.env.VITE_API_URL;

const Issues = () => {
  const [issues, setIssues] = useState([]);
  const [journals, setJournals] = useState([]);
  const [volumes, setVolumes] = useState([]);
  const [selectedJournal, setSelectedJournal] = useState("");
  const [newIssue, setNewIssue] = useState({ issueName: "", volume: "", journal: selectedJournal, publishedDate: "" });
  const [filters, setFilters] = useState({ search: "" });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    total: 0,
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);

  // 🔹 Open modal
  const handleEdit = (issueId) => {
    const found = issues.find((i) => i._id === issueId);
    setSelectedIssue(found);
    setShowEditModal(true);
  };

  // 🔹 Save updated issue name
  const handleSaveUpdate = async (id, newName, newStatus) => {
  try {
    const token = localStorage.getItem("authToken");

    const res = await axios.put(
      `${API_URL}/issues/${id}`,
      { issueName: newName, status: newStatus }, // ✅ send both
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.data.success) {
      toast.success("Issue updated successfully");
      setShowEditModal(false);
      fetchIssues(pagination.page, pagination.limit, filters.search); // ✅ refresh list
    } else {
      toast.error(res.data.message || "Failed to update issue");
    }
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong while updating issue");
  }
};



  // Fetch volumes based on selected journal
  const fetchVolumes = async (journalId) => {
    try {
      if (!journalId) {
        setVolumes([]);
        return;
      }
      const token = localStorage.getItem("authToken");
      const res = await axios.get(`${API_URL}/volumes?journal=${journalId}&limit=1000`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        // ✅ Filter volumes for the selected journal
        const filteredVolumes = res.data.data.filter(v => v.journal._id === journalId);
        setVolumes(filteredVolumes);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch volumes for selected journal");
    }
  };


  // Create new issue
  const handleCreateIssue = async () => {
    if (!newIssue.issueName.trim() || !newIssue.volume || !newIssue.journal) {
      toast.error("Please select journal, volume and enter issue name");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.post(`${API_URL}/issues`, newIssue, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        toast.success("Issue created successfully!");
        setNewIssue({ issueName: "", volume: "", journal: selectedJournal, publishedDate: "" });
        fetchIssues();
      } else {
        toast.error(res.data.message || "Failed to create issue");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while creating issue");
    }
  };


  // Fetch issues
  const fetchIssues = async (page = 1, limit = 10, search = "") => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get(`${API_URL}/issues?page=${page}&limit=${limit}&search=${search}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setIssues(res.data.data);
        setPagination({
          page: res.data.pagination.page,
          limit: res.data.pagination.limit,
          totalPages: res.data.pagination.totalPages,
          total: res.data.pagination.total,
        });
      } else {
        toast.error("Failed to fetch issues");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while fetching issues");
    }
  };

  useEffect(() => {
    fetchJournals();
    fetchIssues(pagination.page, pagination.limit, filters.search);
  }, []);

  // ✅ Fetch all journals and auto-select first one
  const fetchJournals = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get(`${API_URL}/journals/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        const fetchedJournals = res.data.data;
        setJournals(fetchedJournals);

        // ✅ If no journal is selected, auto-select first one
        if (fetchedJournals.length > 0 && !selectedJournal) {
          const firstJournalId = fetchedJournals[0]._id;
          setSelectedJournal(firstJournalId);
          setNewIssue((prev) => ({ ...prev, journal: firstJournalId }));
          fetchVolumes(firstJournalId); // Load only this journal’s volumes
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch journals");
    }
  };

  // ✅ Handle journal change manually
  const handleJournalChange = (e) => {
    const journalId = e.target.value;
    setSelectedJournal(journalId);
    setNewIssue({ ...newIssue, journal: journalId, volume: "" });

    // Only fetch volumes for selected journal
    if (journalId) {
      fetchVolumes(journalId);
    } else {
      setVolumes([]);
    }
  };


  // Delete issue
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this issue?")) return;
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`${API_URL}/issues/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Issue deleted successfully");
      fetchIssues(pagination.page, pagination.limit, filters.search);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete issue");
    }
  };

  // Search handler
  const handleSearch = (e) => {
    const value = e.target.value;
    setFilters((prev) => ({ ...prev, search: value }));
    fetchIssues(1, pagination.limit, value);
  };

  // Pagination
  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > pagination.totalPages) return;
    fetchIssues(pageNumber, pagination.limit, filters.search);
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <BreadCrumb subLabel="Admin" pageTitle="Issues" />
        <div className="d-flex align-items-start gap-2 flex-wrap">
          <Link to="/admin/volume" className="btn btn-primary d-flex align-items-center">
            <i className="ti ti-chevron-left f-24"></i> Back to Volumes
          </Link>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card table-card">
            <div className="card-body pt-3">

              {/* Search + Add Issue */}
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3 px-3">
                <input
                  type="text"
                  className="form-control py-2"
                  style={{ width: "200px", fontSize: "14px" }}
                  placeholder="Search..."
                  value={filters.search}
                  onChange={handleSearch}
                />

                <div className="d-flex align-items-center gap-2 flex-wrap">
                  {/* Journal Dropdown */}
                  <select
                    className="form-control py-2"
                    style={{ width: "180px", fontSize: "14px" }}
                    value={selectedJournal}
                    onChange={handleJournalChange}
                  >
                    <option value="">Select Journal</option>
                    {journals.map((j) => (
                      <option key={j._id} value={j._id}>{j.title}</option>
                    ))}
                  </select>

                  {/* Volume Dropdown */}
                  <select
                    className="form-control py-2"
                    style={{ width: "180px", fontSize: "14px" }}
                    value={newIssue.volume}
                    onChange={(e) => setNewIssue({ ...newIssue, volume: e.target.value })}
                    disabled={!selectedJournal}
                  >
                    <option value="">Select Volume</option>
                    {volumes.map((v) => (
                      <option key={v._id} value={v._id}>{v.volumeName}</option>
                    ))}
                  </select>

                  {/* Issue Name */}
                  <input
                    type="text"
                    placeholder="Issue Name"
                    className="form-control py-2"
                    style={{ width: "200px", fontSize: "14px" }}
                    value={newIssue.issueName}
                    onChange={(e) => setNewIssue({ ...newIssue, issueName: e.target.value })}
                  />

                  <button
                    className="btn btn-primary d-flex align-items-center"
                    onClick={handleCreateIssue}
                    disabled={!selectedJournal || !newIssue.volume || !newIssue.issueName.trim()}
                  >
                    <i className="ti ti-plus me-1"></i> Add Issue
                  </button>

                </div>
              </div>

              {/* Issues Table */}
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Issue Name</th>
                      <th>Volume</th>
                      <th>Created By</th>
                      <th>Created Date</th>
                      <th>Updated Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {issues.length > 0 ? (
                      issues.map((i, index) => (
                        <tr key={i._id}>
                          <td>{index + 1 + (pagination.page - 1) * pagination.limit}</td>
                          <td>{i.issueName}</td>
                          <td>{i.volume?.volumeName || "--"}</td>
                          <td>{i.createdBy.firstName + " " + i.createdBy.lastName || "--"}</td>
                          <td>{formatDate(i.createdAt)}<br /><small>{formatTime(i.createdAt)}</small></td>
                          <td>{formatDate(i.updatedAt)}<br /><small>{formatTime(i.updatedAt)}</small></td>
                          <td><span className={`badge ${i.status ? "bg-light-success" : "bg-light-danger"}`}>{i.status ? "Active" : "Inactive"}</span></td>
                          <td>
                            <button
                              className="btn btn-sm btn-light-warning me-2"
                              onClick={() => handleEdit(i._id)}
                            >
                              <i className="ti ti-pencil f-18" />
                            </button>

                            <button className="btn btn-sm btn-light-danger" onClick={() => handleDelete(i._id)}>
                              <i className="ti ti-trash f-18" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="8" className="text-center">No issues found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="datatable-bottom">
                <div className="datatable-info">
                  Showing {issues.length > 0 ? 1 + (pagination.page - 1) * pagination.limit : 0} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
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
          </div>
        </div>
      </div>
      <EditIssueModal
  show={showEditModal}
  onHide={() => setShowEditModal(false)}
  onSave={handleSaveUpdate}
  issue={selectedIssue}
/>

    </>
  );
};

export default Issues;
