import BreadCrumb from "../../components/BreadCrumb";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { formatDate, formatTime } from "../../utils/time";

const API_URL = import.meta.env.VITE_API_URL;

const Volumes = () => {
  const navigate = useNavigate();
  const [volumes, setVolumes] = useState([]);
  const [newVolume, setNewVolume] = useState("");
  const [filters, setFilters] = useState({ search: "" });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    total: 0,
  });

  // Function to create a new volume
  const handleCreateVolume = async () => {
    if (!newVolume.trim()) {
      toast.error("Please enter a volume name");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.post(
        `${API_URL}/volumes`,
        { volumeName: newVolume.trim() },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Volume created successfully!");
        setNewVolume("");
        fetchVolumes(); // refresh the list (same as your fetchEditors)
      } else {
        toast.error(res.data.message || "Failed to create volume");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response.data.message || "Something went wrong while creating volume"); 
    }
  };

  // Fetch volumes from API
  const fetchVolumes = async (page = 1, limit = 10, search = "") => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get(
        `${API_URL}/volumes?page=${page}&limit=${limit}&search=${search}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

  // Search handler
  const handleSearch = (e) => {
    const value = e.target.value;
    setFilters((prev) => ({ ...prev, search: value }));
    fetchVolumes(1, pagination.limit, value); // reset to page 1 on search
  };

  // Handle pagination button click
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
          <Link
            to="/journals"
            className="btn btn-primary d-flex align-items-center"
          >
            <i className="ti ti-chevron-left f-24"></i> Back to Journals
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="row">
        <div className="col-12">
          <div className="card table-card">
            <div className="card-body pt-3">

              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3 px-3">
                {/* Search input */}
                <input
                  type="text"
                  className="form-control py-2"
                  style={{ width: "200px", fontSize: "14px" }}
                  placeholder="Search..."
                  value={filters.search}
                  onChange={handleSearch}
                />

                {/* Add Volume section */}
                <div className="d-flex align-items-center gap-2">
                  <input
                    type="text"
                    placeholder="Volume name"
                    className="form-control py-2"
                    style={{ width: "200px", fontSize: "14px" }}
                    value={newVolume}
                    onChange={(e) => setNewVolume(e.target.value)}
                  />
                  <button
                    className="btn btn-primary d-flex align-items-center"
                    onClick={handleCreateVolume}
                  >
                    <i className="ti ti-plus me-1"></i> Add Volume
                  </button>
                </div>
              </div>



              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Volume</th>
                      <th>Created By</th>
                      <th>Created Date</th>
                      <th>Updated Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {volumes.length > 0 ? (
                      volumes.map((i, index) => (
                        <tr key={i._id}>
                          <td>{index + 1 + (pagination.page - 1) * pagination.limit}</td>
                          <td>{i.volumeName || "--"}</td>
                          <td>{i.createdBy.firstName + " " + i.createdBy.lastName || "--"}
                            {/* <br />
                            <small>{i.createdBy.email || "--"}</small> */}
                          </td>
                          <td>{formatDate(i.createdAt) || "--"}
                              &nbsp; {formatTime(i.createdAt) || "--"}
                          </td>
                          <td>{formatDate(i.updatedAt) || "--"}
                            {/* <br />
                            <small>
                              {formatTime(i.updatedAt) || "--"}
                            </small> */}
                          </td>

                          <td>
                            <span
                              className={`badge ${i.status ? "bg-light-success" : "bg-light-danger"
                                }`}
                            >
                              {i.status ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td>
                            <ul className="list-inline m-0">
                              {/* <li className="list-inline-item">
                                <span
                                  className="avtar avtar-s btn-light-primary mx-1"
                                  title="View"
                                  onClick={() =>
                                    navigate(`/admin/volumes/volume-details/${i._id}`)
                                  }
                                >
                                  <i className="ti ti-eye f-18"></i>
                                </span>
                              </li>
                              <li className="list-inline-item">
                                <span
                                  className="avtar avtar-s btn-light-warning mx-1"
                                  title="Edit"
                                  onClick={() =>
                                    navigate(`/admin/volumes/update-volume/${i._id}`)
                                  }
                                >
                                  <i className="ti ti-pencil f-18"></i>
                                </span>
                              </li> */}
                              <li className="list-inline-item cursor-pointer">
                                <span
                                  className="btn btn-sm btn-light-danger"
                                  title="Delete"
                                  onClick={() => handleDelete(i._id)}
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
                        <td colSpan="7" className="text-center">
                          No volumes found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Datatable Pagination */}
              <div className="datatable-bottom">
                <div className="datatable-info">
                  Showing {volumes.length > 0 ? 1 + (pagination.page - 1) * pagination.limit : 0}{" "}
                  to {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                  {pagination.total} entries
                </div>
                <nav className="datatable-pagination">
                  <ul className="datatable-pagination-list">
                    <li
                      className={`datatable-pagination-list-item ${pagination.page <= 1 ? "datatable-hidden datatable-disabled" : ""
                        }`}
                    >
                      <button
                        data-page={pagination.page - 1}
                        className="datatable-pagination-list-item-link"
                        onClick={() => handlePageChange(pagination.page - 1)}
                      >
                        ‹
                      </button>
                    </li>

                    {Array.from({ length: pagination.totalPages }, (_, i) => (
                      <li
                        key={i + 1}
                        className={`datatable-pagination-list-item ${pagination.page === i + 1 ? "datatable-active" : ""
                          }`}
                      >
                        <button
                          data-page={i + 1}
                          className="datatable-pagination-list-item-link"
                          onClick={() => handlePageChange(i + 1)}
                        >
                          {i + 1}
                        </button>
                      </li>
                    ))}

                    <li
                      className={`datatable-pagination-list-item ${pagination.page >= pagination.totalPages
                        ? "datatable-hidden datatable-disabled"
                        : ""
                        }`}
                    >
                      <button
                        data-page={pagination.page + 1}
                        className="datatable-pagination-list-item-link"
                        onClick={() => handlePageChange(pagination.page + 1)}
                      >
                        ›
                      </button>
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
