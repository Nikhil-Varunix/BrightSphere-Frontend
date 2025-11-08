import BreadCrumb from "../../components/BreadCrumb";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = import.meta.env.VITE_BASE_URL;

const DeletedJournals = () => {
  const navigate = useNavigate();
  const [journals, setJournals] = useState([]);
  const [filters, setFilters] = useState({ search: "" });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    total: 0,
  });

  const token = localStorage.getItem("authToken");
  // Fetch Journals
  const fetchJournals = async (page = 1, limit = 10, search = "") => {
    try {
      const res = await axios.get(
        `${API_URL}/journals/all/deleted?page=${page}&limit=${limit}&search=${search}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setJournals(res.data.data);
        setPagination({
          page: res.data.pagination.page,
          limit: res.data.pagination.limit,
          totalPages: res.data.pagination.totalPages,
          total: res.data.pagination.total,
        });
      } else {
        toast.error("Failed to fetch journals");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while fetching journals");
    }
  };

  useEffect(() => {
    fetchJournals(pagination.page, pagination.limit, filters.search);
  }, []);

// Restore Journal
// Restore Journal
const handleRestore = async (id) => {
  if (!window.confirm("Are you sure you want to restore this journal?")) return;

  try {
    const token = localStorage.getItem("authToken");
    await axios.put(
      `${API_URL}/journals/restore/${id}`,
      {}, // empty body
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    toast.success("Journal restored successfully");
    fetchJournals(pagination.page, pagination.limit, filters.search);
  } catch (err) {
    console.error(err);
    toast.error("Failed to restore journal");
  }
};



  // Search handler
  const handleSearch = (e) => {
    const value = e.target.value;
    setFilters((prev) => ({ ...prev, search: value }));
    fetchJournals(1, pagination.limit, value);
  };

  // Pagination handler
  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > pagination.totalPages) return;
    fetchJournals(pageNumber, pagination.limit, filters.search);
  };

  return (
    <>
      {/* Header + Breadcrumb */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <BreadCrumb subLabel="Journals" />
        <div className="d-flex align-items-start gap-2 flex-wrap">
          <Link
            to="/journals/create-journal"
            className="btn btn-primary d-flex align-items-center"
          >
            <i className="ti ti-plus f-24"></i> Create Journal
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="row">
        <div className="col-12">
          <div className="card table-card">
            <div className="card-body pt-3">
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

              {/* Journals Table */}
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Cover</th>
                      <th>Title</th>
                      <th>Editors</th>
                      <th>Articles</th>
                      <th>Volumes</th>
                      <th>Issues</th>
                      <th>Created By</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {journals.length > 0 ? (
                      journals.map((j, index) => (
                        <tr key={j._id}>
                          <td>{index + 1 + (pagination.page - 1) * pagination.limit}</td>

                          <td>
                            {j.coverImage ? (
                              <img
                                src={`${BASE_URL}/${j.coverImage}`}
                                alt={j.title}
                                width="50"
                                height="35"
                                className="rounded"
                              />
                            ) : (
                              <span className="text-muted">--</span>
                            )}
                          </td>

                          <td className="fw-semibold">{j.title || "--"}</td>

                          <td>{j.editors?.length || 0}</td>
                          <td>{j.articles?.length || 0}</td>
                          <td>{j.volumes?.length || 0}</td>
                          <td>{j.issues?.length || 0}</td>
                          <td>{j.createdBy?.firstName || "--"}</td>

                          <td>
                            <span
                              className={`badge ${j.status ? "bg-light-success" : "bg-light-danger"
                                }`}
                            >
                              {j.status ? "Active" : "Inactive"}
                            </span>
                          </td>

                          <td>
                            <ul className="list-inline m-0">
                              <li className="list-inline-item">
                                <span
                                  className="btn btn-sm btn-light-primary mx-1"
                                  title="View"
                                  onClick={() =>
                                    navigate(`/admin/journals/journal-details/${j._id}`)
                                  }
                                >
                                  <i className="ti ti-eye f-18"></i>
                                </span>
                              </li>
                             
                            <li className="list-inline-item cursor-pointer">
  <span
    className="btn btn-sm btn-light-success"
    title="Restore"
    onClick={() => handleRestore(j._id)}
  >
    <i className="ti ti-refresh f-18" />
  </span>
</li>

                            </ul>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="11" className="text-center">
                          No journals found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="datatable-bottom">
                <div className="datatable-info">
                  Showing {journals.length > 0 ? 1 + (pagination.page - 1) * pagination.limit : 0}{" "}
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

export default DeletedJournals;
