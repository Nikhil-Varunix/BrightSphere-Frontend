import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import BreadCrumb from "../components/BreadCrumb";

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [filters, setFilters] = useState({ search: "" });
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 1,
  });
  const navigate = useNavigate();

  // Fetch articles from backend
  const fetchArticles = async (page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/articles?page=${page}&limit=${pagination.limit}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = res.data.data || [];
      const total = res.data.total || data.length;

      setArticles(data);
      setPagination((prev) => ({
        ...prev,
        page,
        total,
        totalPages: Math.ceil(total / prev.limit),
      }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // Filter by title or author
  const filteredArticles = articles.filter(
    (a) =>
      a.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
      a.author?.toLowerCase().includes(filters.search.toLowerCase())
  );

  // Delete article
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`${import.meta.env.VITE_API_URL}/articles/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Article deleted successfully");
      fetchArticles(pagination.page);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete article");
    }
  };

  // Pagination handler
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchArticles(newPage);
    }
  };

  return (
    <>
      {/* Breadcrumb + Create Button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <BreadCrumb subLabel="Articles" />
        <div className="d-flex align-items-start gap-2 flex-wrap">
          <Link
            to="/article/create-article"
            className="btn btn-primary d-flex align-items-center"
          >
            <i className="ti ti-plus f-24"></i> Create Article
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="row mb-3">
        <div className="col-12 col-md-4">
          <input
            type="text"
            className="form-control py-2"
            placeholder="Search by title or author..."
            value={filters.search}
            onChange={(e) =>
              setFilters({ ...filters, search: e.target.value })
            }
          />
        </div>
      </div>

      {/* Table */}
      <div className="row">
        <div className="col-12">
          <div className="card table-card">
            <div className="card-body pt-3">
              {loading ? (
                <div className="text-center py-4">Loading...</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Journal</th>
                        <th>Type</th>
                        <th>Author</th>
                        <th>Created</th>
                        {/* <th>Published Date</th> */}
                        <th>Views</th>
                        <th>Downloads</th>
                        {/* <th>Status</th> */}
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredArticles.map((article, i) => (
                        <tr key={article._id}>
                          <td>{(pagination.page - 1) * pagination.limit + i + 1}</td>
                          <td>
                            {article.coverImage ? (
                              <img
                                src={`${import.meta.env.VITE_BASE_URL}/${article.coverImage}`}
                                alt="cover"
                                className="rounded shadow-lg"
                                style={{
                                  width: "50px",
                                  height: "35px",
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              <span className="text-muted">No Image</span>
                            )}
                          </td>
                          <td
                            title={article.title}
                            className="text-truncate"
                            style={{ maxWidth: "180px" }}
                          >
                            {article.title}
                          </td>
                          <td
                            title={article.title}
                            className="text-truncate"
                            style={{ maxWidth: "180px" }}
                          >
                            {article.journal.title}
                          </td>
                          <td>{article.articleType || "-"}</td>
                          <td
                            className="text-truncate"
                            style={{ maxWidth: "180px" }}
                          >
                            {article.author || "-"}
                          </td>
                          <td>{article.createdBy.firstName} {article.createdBy.lastName}
                            <br />
                            <small>

                              {article.publishedAt
                                ? new Date(article.publishedAt).toLocaleDateString("en-IN")
                                : "-"}
                            </small>
                          </td>
                          <td>{article.views || 0}</td>
                          <td>{article.downloads || 0}</td>
                          {/* <td>
                            <span
                              className={`badge ${article.status === "published"
                                ? "bg-light-success"
                                : "bg-light-warning"
                                }`}
                            >
                              {article.status}
                            </span>
                          </td> */}
                          <td>
                            <button
                              className="btn btn-sm btn-light-primary mx-1"
                              onClick={() =>
                                navigate(`/articles/article-details/${article._id}`)
                              }
                            >
                              <i className="ti ti-eye"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-light-warning mx-1"
                              onClick={() =>
                                navigate(`/article/update-article/${article._id}`)
                              }
                            >
                              <i className="ti ti-pencil"></i>
                            </button>
                            <a
                            target="_blank"
                              className="btn btn-sm btn-light-success mx-1"
                              href={`${import.meta.env.VITE_BASE_URL}/${article.pdfFile}`}
                            >
                              <i className="ti ti-download"></i>
                            </a>
                            <button
                              className="btn btn-sm btn-light-danger mx-1"
                              onClick={() => handleDelete(article._id)}
                            >
                              <i className="ti ti-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredArticles.length === 0 && (
                        <tr>
                          <td colSpan={11} className="text-center text-muted">
                            No articles found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              <div className="datatable-bottom">
                <div className="datatable-info">
                  Showing{" "}
                  {articles.length > 0
                    ? 1 + (pagination.page - 1) * pagination.limit
                    : 0}{" "}
                  to{" "}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                  {pagination.total} entries
                </div>
                <nav className="datatable-pagination">
                  <ul className="datatable-pagination-list">
                    <li
                      className={`datatable-pagination-list-item ${pagination.page <= 1 ? "datatable-hidden datatable-disabled" : ""
                        }`}
                    >
                      <button onClick={() => handlePageChange(pagination.page - 1)}>
                        ‹
                      </button>
                    </li>
                    {Array.from({ length: pagination.totalPages }, (_, i) => (
                      <li
                        key={i + 1}
                        className={`datatable-pagination-list-item ${pagination.page === i + 1 ? "datatable-active" : ""
                          }`}
                      >
                        <button onClick={() => handlePageChange(i + 1)}>
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
                      <button onClick={() => handlePageChange(pagination.page + 1)}>
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

export default Articles;
