import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import BreadCrumb from "../../components/BreadCrumb";
import { formatTimeStamp } from "../../utils/time";

const API_URL = import.meta.env.VITE_API_URL;

const Users = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const [search, setSearch] = useState("");



  // 🔹 Fetch users from API
  const fetchUsers = async (page = 1, query = "") => {
    try {
      const res = await axios.get(
        `${API_URL}/users?page=${page}&limit=${limit}&search=${query}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const apiUsers = res.data.data.map((user, index) => ({
        id: user._id,
        serial: (page - 1) * limit + (index + 1),
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        mobile: user.phone,
        createdBy: user.createdBy
          ? `${user.createdBy.firstName} ${user.createdBy.lastName}`
          : "Direct Signup",
        createdDate: formatTimeStamp(user.createdAt),
        status: user.status ? "Active" : "Inactive",
      }));

      setUsers(apiUsers);
      setCurrentPage(res.data.page);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      toast.error(err.response?.data?.message || "Failed to fetch users");
    }
  };


  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);


  // 🔹 Delete user
  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to reject this user?");
    if (!confirmed) return;

    try {
      await axios.delete(`${API_URL}/users/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers((prev) => prev.filter((user) => user.id !== id));
      toast.success("User rejected successfully");
    } catch (err) {
      console.error("Failed to reject user:", err);
      toast.error("Failed to reject user");
    }
  };

  // 🔹 Deactivate / Activate user
  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await axios.put(
        `${API_URL}/users/deactivate/${id}`,
        { status: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers((prev) =>
        prev.map((u) =>
          u.id === id ? { ...u, status: !currentStatus ? "Active" : "Inactive" } : u
        )
      );

      toast.success(
        !currentStatus ? "User activated successfully" : "User deactivated successfully"
      );
    } catch (err) {
      console.error("Failed to update user status:", err);
      toast.error("Failed to update user status");
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <BreadCrumb subLabel="Users" subUrl="/users" />
        <Link className="btn btn-primary" to="/admin/users/create">
          + Create User
        </Link>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="mb-3 d-flex justify-content-end">
            <input
              type="text"
              className="form-control w-25"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setCurrentPage(1);
                  fetchUsers(1, search);
                }
              }}
            />
            <button
              className="btn btn-primary ms-2"
              onClick={() => {
                setCurrentPage(1);
                fetchUsers(1, search);
              }}
            >
              Search
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>S. No</th>
                  <th>User Name</th>
                  <th>Mobile</th>
                  <th>Created By</th>
                  <th>Created Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.serial}</td>
                      <td>{user.fullName}
                        <br />
                        <small>{user.email}</small>
                      </td>
                      <td>{user.mobile}</td>

                      <td>{user.createdBy}</td>
                      <td>{user.createdDate}</td>
                      <td>
                        <ul className="list-inline m-0">
                          {/* Add Money */}
                          {/* Wallet */}
                          
                          {/* Edit */}
                          <li className="list-inline-item">
                            <span
                              onClick={() => navigate(`/admin/users/edit/${user.id}`)}
                              className="btn btn-sm btn-light-info"
                            >
                              <i className="ti ti-pencil f-18" />
                            </span>
                          </li>
                          {/* Toggle Active/Inactive */}
                          <li className="list-inline-item">
                            <span
                              onClick={() =>
                                handleToggleStatus(user.id, user.status === "Active")
                              }
                              className={`btn btn-sm ${user.status === "Active"
                                ? "btn-light-success"
                                : "btn-light-secondary"
                                }`}
                            >
                              <i
                                className={`ti ${user.status === "Active"
                                  ? "ti-user-off"
                                  : "ti-user-check"
                                  } f-18`}
                              />
                            </span>
                          </li>
                          {/* Delete */}
                          <li className="list-inline-item">
                            <span
                              onClick={() => handleDelete(user.id)}
                              className="btn btn-sm btn-light-danger"
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
                    <td colSpan="8" className="text-center">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="datatable-bottom">
            <div className="datatable-info">
              Showing page {currentPage} of {totalPages}
            </div>
            <nav className="datatable-pagination">
              <ul className="datatable-pagination-list">
                {/* Previous Button */}
                <li className={`datatable-pagination-list-item ${currentPage === 1 ? "datatable-disabled" : ""}`}>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className="datatable-pagination-list-item-link"
                  >
                    ‹
                  </button>
                </li>

                {/* Page Numbers (max 3 at a time) */}
                {(() => {
                  let start = Math.max(1, currentPage - 1);
                  let end = Math.min(totalPages, start + 2);
                  start = Math.max(1, end - 2);

                  return Array.from({ length: end - start + 1 }, (_, i) => start + i).map((page) => (
                    <li
                      key={page}
                      className={`datatable-pagination-list-item ${currentPage === page ? "datatable-active" : ""}`}
                    >
                      <button
                        onClick={() => setCurrentPage(page)}
                        className="datatable-pagination-list-item-link"
                      >
                        {page}
                      </button>
                    </li>
                  ));
                })()}

                {/* Next Button */}
                <li className={`datatable-pagination-list-item ${currentPage === totalPages ? "datatable-disabled" : ""}`}>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className="datatable-pagination-list-item-link"
                  >
                    ›
                  </button>
                </li>
              </ul>
            </nav>
          </div>


        </div>
      </div>
     
    </>
  );
};

export default Users;