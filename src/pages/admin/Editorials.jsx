import BreadCrumb from "../../components/BreadCrumb";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = import.meta.env.VITE_BASE_URL;

const Editors = () => {
  const navigate = useNavigate();
  const [editors, setEditors] = useState([]);
  const [filters, setFilters] = useState({ search: "" });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    total: 0,
  });

  // Fetch editors from API
  const fetchEditors = async (page = 1, limit = 10, search = "") => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get(
        `${API_URL}/editors?page=${page}&limit=${limit}&search=${search}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setEditors(res.data.data);
        setPagination({
          page: res.data.pagination.page,
          limit: res.data.pagination.limit,
          totalPages: res.data.pagination.totalPages,
          total: res.data.pagination.total,
        });
      } else {
        toast.error("Failed to fetch editors");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while fetching editors");
    }
  };

  useEffect(() => {
    fetchEditors(pagination.page, pagination.limit, filters.search);
  }, []);

  // Delete editor
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/editors/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Deleted successfully");
      fetchEditors(pagination.page, pagination.limit, filters.search);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete editor");
    }
  };

  // Search handler
  const handleSearch = (e) => {
    const value = e.target.value;
    setFilters((prev) => ({ ...prev, search: value }));
    fetchEditors(1, pagination.limit, value); // reset to page 1 on search
  };

  // Handle pagination button click
  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > pagination.totalPages) return;
    fetchEditors(pageNumber, pagination.limit, filters.search);
  };

  return (
    <>
      {/* Header + Breadcrumb */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <BreadCrumb subLabel="Admin" pageTitle="Editors" />
        <div className="d-flex align-items-start gap-2 flex-wrap">
          <Link
            to="/admin/editors/create-editor"
            className="btn btn-primary d-flex align-items-center"
          >
            <i className="ti ti-plus f-24"></i> Create Editor
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

              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Editor</th>
                      <th>Designation</th>
                      <th>Department </th>
                      <th>University </th>
                      {/* <th>City</th> */}
                      {/* <th>Country</th> */}
                      <th>Address</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {editors.length > 0 ? (
                      editors.map((i, index) => (
                        <tr key={i._id}>
                          <td>{index + 1 + (pagination.page - 1) * pagination.limit}</td>
                          <td >
                            <div className="row m-0 p-0">
                              <div className="col-md-2 px-0">
                                <img
                                  src={
                                    i.coverImage
                                      ? `${BASE_URL}/${i.coverImage}`
                                      : "/assets/img/editor/default-editor.png"
                                  }
                                  alt="Editor"
                                  className="img-fluid rounded-circle"
                                  style={{ width: "40px", height: "40px", objectFit: "cover" }}
                                />
                              </div>
                              <div className="col-md-9 ">
                                <span style={{
                                  maxWidth: "200px",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap"
                                }}>

                                  {`${i.firstName} ${i.lastName}`}
                                </span>
                                <br />
                                <small>
                                  {i.email}

                                </small>
                              </div>
                            </div>
                          </td>

                          <td style={{
                            maxWidth: "200px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                          }}>
                            {i.designation || "--"}
                          </td>

                          <td style={{
                            maxWidth: "200px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                          }}>
                            {i.department || "--"}
                          </td>

                          <td style={{
                            maxWidth: "200px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                          }}>
                            {i.university || "--"}
                          </td>

                          <td style={{
                            maxWidth: "200px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                          }}>
                            {i.address || "--"}
                          </td>

                          {/* <td>{i.city || "--"}</td>
                          <td>{i.country || "--"}</td> */}
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
                              <li className="list-inline-item">
                                <span
                                  className="btn btn-sm btn-light-primary mx-1"
                                  title="View"
                                  onClick={() =>
                                    navigate(`/admin/editors/editor-details/${i._id}`)
                                  }
                                >
                                  <i className="ti ti-eye f-18"></i>
                                </span>
                              </li>
                              <li className="list-inline-item">
                                <span
                                  className="btn btn-sm btn-light-warning mx-1"
                                  title="Edit"
                                  onClick={() =>
                                    navigate(`/admin/editors/update/${i._id}`)
                                  }
                                >
                                  <i className="ti ti-pencil f-18"></i>
                                </span>
                              </li>
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
                        <td colSpan="9" className="text-center">
                          No editors found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Datatable Pagination */}
              <div className="datatable-bottom">
                <div className="datatable-info">
                  Showing {editors.length > 0 ? 1 + (pagination.page - 1) * pagination.limit : 0}{" "}
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

export default Editors;
