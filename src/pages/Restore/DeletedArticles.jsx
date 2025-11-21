import BreadCrumb from "../../components/BreadCrumb";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = import.meta.env.VITE_BASE_URL;

const DeletedArticles = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [filters, setFilters] = useState({ search: "" });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    total: 0,
  });

  const token = localStorage.getItem("authToken");

  // ✅ Fetch Deleted Articles
  const fetchArticles = async (page = 1, limit = 10, search = "") => {
    try {
      const res = await axios.get(
        `${API_URL}/articles/deleted?page=${page}&limit=${limit}&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setArticles(res.data.data);
        setPagination({
          page: res.data.pagination.page,
          limit: res.data.pagination.limit,
          totalPages: res.data.pagination.totalPages,
          total: res.data.pagination.total,
        });
      } else {
        toast.error("Failed to fetch deleted articles");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while fetching deleted articles");
    }
  };

  useEffect(() => {
    fetchArticles(pagination.page, pagination.limit, filters.search);
  }, []);

  // ✅ Restore Article
  const handleRestore = async (id) => {
    if (!window.confirm("Are you sure you want to restore this article?")) return;

    try {
      await axios.put(
        `${API_URL}/articles/restore/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Article restored successfully");
      fetchArticles(pagination.page, pagination.limit, filters.search);
    } catch (err) {
      console.error(err);
      toast.error("Failed to restore article");
    }
  };

  // ✅ Search handler
  const handleSearch = (e) => {
    const value = e.target.value;
    setFilters((prev) => ({ ...prev, search: value }));
    fetchArticles(1, pagination.limit, value);
  };

  // ✅ Pagination handler
  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > pagination.totalPages) return;
    fetchArticles(pageNumber, pagination.limit, filters.search);
  };

  return (
    <>
      {/* Header + Breadcrumb */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <BreadCrumb subLabel="Deleted Articles" />
        <div className="d-flex align-items-start gap-2 flex-wrap">
          <Link
            to="/articles/in-press"
            className="btn btn-primary d-flex align-items-center"
          >
            <i className="ti ti-arrow-left f-24"></i> Back to Articles
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
                  style={{ width: "250px", fontSize: "14px" }}
                  placeholder="Search by title or author..."
                  value={filters.search}
                  onChange={handleSearch}
                />
              </div>

              {/* Articles Table */}
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Document</th>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Journal</th>
                      <th>Created By</th>
                      <th>Deleted On</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {articles.length > 0 ? (
                      articles.map((a, index) => (
                        <tr key={a._id}>
                          <td>{index + 1 + (pagination.page - 1) * pagination.limit}</td>

                              <td>
                            {a.coverImage ? (
                              <img
                                src={`${BASE_URL}/${a.coverImage}`}
                                alt={a.title}
                                width="50"
                                height="35"
                                className="rounded"
                              />
                            ) : (
                              <span className="text-muted">--</span>
                            )}
                          </td>

                          <td className="fw-semibold text-truncate" style={{ maxWidth: "220px" }}>{a.title || "--"}</td>
                          <td className="text-truncate" style={{ maxWidth: "220px" }}>{a.author || "--"}</td>
                          <td className="text-truncate" style={{ maxWidth: "220px" }}>{a.journal?.title || "--"}</td>
                          <td>{a.createdBy?.firstName || "--"}</td>
                          <td>{new Date(a.updatedAt).toLocaleDateString("en-IN")}</td>

                          <td>
                            <ul className="list-inline m-0">
                              <li className="list-inline-item cursor-pointer">
                                <span
                                  className="btn btn-sm btn-light-success"
                                  title="Restore"
                                  onClick={() => handleRestore(a._id)}
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
                        <td colSpan="8" className="text-center text-muted py-3">
                          No deleted articles found.
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
                  {articles.length > 0
                    ? 1 + (pagination.page - 1) * pagination.limit
                    : 0}{" "}
                  to {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                  {pagination.total} entries
                </div>

                <nav className="datatable-pagination">
                  <ul className="datatable-pagination-list">
                    <li
                      className={`datatable-pagination-list-item ${
                        pagination.page <= 1
                          ? "datatable-hidden datatable-disabled"
                          : ""
                      }`}
                    >
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                      >
                        ‹
                      </button>
                    </li>

                    {Array.from({ length: pagination.totalPages }, (_, i) => (
                      <li
                        key={i + 1}
                        className={`datatable-pagination-list-item ${
                          pagination.page === i + 1 ? "datatable-active" : ""
                        }`}
                      >
                        <button onClick={() => handlePageChange(i + 1)}>
                          {i + 1}
                        </button>
                      </li>
                    ))}

                    <li
                      className={`datatable-pagination-list-item ${
                        pagination.page >= pagination.totalPages
                          ? "datatable-hidden datatable-disabled"
                          : ""
                      }`}
                    >
                      <button
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

export default DeletedArticles;
