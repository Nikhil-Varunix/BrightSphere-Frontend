import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import BreadCrumb from "../components/BreadCrumb";

const ArticlesInPress = () => {
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

  // ✅ Fetch all in-press articles
  const fetchArticles = async (page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/inpress-articles?page=${page}&limit=${pagination.limit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = res.data.data || [];
      const total = res.data.pagination?.total || data.length;

      setArticles(data);
      setPagination((prev) => ({
        ...prev,
        page,
        total,
        totalPages: Math.ceil(total / prev.limit),
      }));
    } catch (err) {
      console.error(err);
      toast.error(err.response.data.message || "Failed to fetch in-press articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // ✅ Search filter
  const filteredArticles = articles.filter(
    (a) =>
      a.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
      a.author?.toLowerCase().includes(filters.search.toLowerCase())
  );

  // ✅ Delete article (soft delete)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;

    try {
      const token = localStorage.getItem("authToken");

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/inpress-articles/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Article deleted successfully");
      fetchArticles(pagination.page);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete article");
    }
  };

  // ✅ Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchArticles(newPage);
    }
  };

  return (
    <>
      {/* ✅ Breadcrumb and Create Button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <BreadCrumb subLabel="Articles In Press" />
        <div className="d-flex align-items-start gap-2 flex-wrap">
          <Link to="/article/create-inpress" className="btn btn-primary">
            <i className="ti ti-plus me-1"></i> Create In-Press Article
          </Link>
        </div>
      </div>

      {/* ✅ Search */}
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

      {/* ✅ Articles Table */}
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
                        <th>Title</th>
                        <th>Author</th>
                        <th>Journal</th>
                        <th>Created By</th>
                        <th>PDF</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredArticles.map((article, i) => (
                        <tr key={article._id}>
                          {/* ✅ Serial Number */}
                          <td>
                            {(pagination.page - 1) * pagination.limit + i + 1}
                          </td>

                          {/* ✅ Title */}
                          <td className="text-truncate" style={{ maxWidth: "200px" }}>
                            {article.title}
                          </td>

                          {/* ✅ Author */}
                          <td className="text-truncate" style={{ maxWidth: "180px" }}>
                            {article.author}
                          </td>

                          {/* ✅ Journal */}
                          <td className="text-truncate" style={{ maxWidth: "200px" }}>
                            {article.journal?.title || "-"}
                          </td>

                          {/* ✅ Created By */}
                          <td>
                            {article.createdBy
                              ? `${article.createdBy.firstName} ${article.createdBy.lastName}`
                              : "-"}
                          </td>

                          {/* ✅ PDF */}
                          <td>
                            {article.document ? (
                              <a
                                href={`${import.meta.env.VITE_BASE_URL}/${article.document}`}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-sm btn-light-primary"
                              >
                                <i className="ti ti-file-text"></i> View
                              </a>
                            ) : (
                              <span className="text-muted">No PDF</span>
                            )}
                          </td>
                          {/* ✅ Actions */}
                          <td>
                            {/* Edit button */}
                            <Link
                              to={`/articles/in-press/edit/${article._id}`}
                              className="btn btn-sm btn-light-warning me-2"
                            >
                              <i className="ti ti-edit"></i>
                            </Link>

                            {/* Delete button */}
                            <button
                              className="btn btn-sm btn-light-danger mx-1"
                              onClick={() => handleDelete(article._id)}
                            >
                              <i className="ti ti-trash"></i>
                            </button>
                          </td>

                        </tr>
                      ))}

                      {filteredArticles.length === 0 && !loading && (
                        <tr>
                          <td colSpan={7} className="text-center text-muted">
                            No in-press articles found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ✅ Pagination */}
              {!loading && (
                <div className="datatable-bottom">
                  <div className="datatable-info">
                    Showing{" "}
                    {articles.length > 0
                      ? 1 + (pagination.page - 1) * pagination.limit
                      : 0}{" "}
                    to{" "}
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total
                    )}{" "}
                    of {pagination.total} entries
                  </div>

                  <nav className="datatable-pagination">
                    <ul className="datatable-pagination-list">
                      <li
                        className={`datatable-pagination-list-item ${pagination.page <= 1
                            ? "datatable-disabled"
                            : ""
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
                            ? "datatable-disabled"
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
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ArticlesInPress;
