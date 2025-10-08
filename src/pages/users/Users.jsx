
// src/pages/admin/InteractionLogs.jsx
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import BreadCrumb from "../../components/BreadCrumb";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const [logs, setLogs] = useState([
    {
      id: "1",
      customer: "John Doe",
      email: "john@example.com",
      mobile: "+91 9876543210",
      role: "Developer",
      submissions: 3,
      lastLogin: "2025-09-23T10:15",
      status: "Active",
      type: "Call",
      channel: "Phone",
      date: "2025-09-08",
      time: "14:31",
      handledBy: "Agent Rao",
      outcome: "Connected",
      duration: "7m",
      followUp: "2025-09-05T10:00",
      notes: "AC not cooling since yesterday",
    },
    // {
    //   id: "INT-2025-002",
    //   customer: "Priya Sharma",
    //   email: "priya@example.com",
    //   mobile: "+91 9123456789",
    //   role: "Editor",
    //   submissions: 5,
    //   lastLogin: "2025-09-22T15:45",
    //   status: "Active",
    //   type: "Email",
    //   channel: "Email",
    //   date: "2025-09-04",
    //   time: "11:15",
    //   handledBy: "Agent Kiran",
    //   outcome: "Sent",
    //   duration: "-",
    //   followUp: "2025-09-06T09:00",
    //   notes: "Sent preventive maintenance proposal",
    // },
  ]);
  const navigate = useNavigate();
  const [selectedLog, setSelectedLog] = useState(null);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [showInteractionDetails, setShowInteractionDetails] = useState(false);

  const handleDelete = (id) => {
    setLogs(logs.filter((l) => l.id !== id));
    toast.success("Interaction deleted");
  };

  const renderSortIcons = (key) => (
    <span
      style={{
        display: "inline-flex",
        flexDirection: "column",
        marginLeft: "5px",
        verticalAlign: "middle",
      }}
    >
      <span
        style={{
          cursor: "pointer",
          fontSize: "10px",
          lineHeight: "12px",
          color:
            sortConfig.key === key && sortConfig.direction === "asc"
              ? "#000"
              : "#ccc",
        }}
        onClick={() => setSortConfig({ key, direction: "asc" })}
      >
        ▲
      </span>
      <span
        style={{
          cursor: "pointer",
          fontSize: "10px",
          lineHeight: "10px",
          color:
            sortConfig.key === key && sortConfig.direction === "desc"
              ? "#000"
              : "#ccc",
        }}
        onClick={() => setSortConfig({ key, direction: "desc" })}
      >
        ▼
      </span>
    </span>
  );

  return (
    <>
      {/* Breadcrumb */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <BreadCrumb subLabel="Users" subUrl="/users" />
        <Link to="/user/create-user" className="btn btn-primary d-flex align-items-center">
          <i className="ti ti-plus f-24"></i> Create User
        </Link>
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-body table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>S.No {renderSortIcons("serialNumber")}</th>
                <th>User{renderSortIcons("name")}</th>
                <th>Designation{renderSortIcons("role")}</th>
                <th>Mobile {renderSortIcons("mobile")}</th>
                <th>Email{renderSortIcons("email")}</th>
                {/* <th>Submissions {renderSortIcons("submission")}</th> */}
                <th>Last Login {renderSortIcons("login")}</th>
                <th>Status {renderSortIcons("status")}</th>
                <th>Actions</th>

              </tr>
            </thead>
            <tbody>
              {logs.map((l, i) => (
                <tr key={l.id}>
                  <td>{i + 1}</td>
                  <td>{l.customer}</td>
                  <td>{l.role}</td>
                  <td>{l.mobile}</td>
                  <td>{l.email}</td>
                  {/* <td>{l.submissions}</td> */}
                  <td>
                    <time dateTime={l.lastLogin}>
                      {new Date(l.lastLogin).toLocaleDateString()}
                      <br />
                      <small className="text-muted">
                        {new Date(l.lastLogin).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </small>
                    </time>
                  </td>

                  <td>
                    <span className={`badge ${l.status === "Active" ? "bg-light-success" : "bg-light-danger"}`}>
                      {l.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-light-warning mx-1" onClick={() => navigate(`/users/update-user/${l.id}`)}>
                      <i className="ti ti-pencil"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-light-danger mx-1"
                      onClick={() => handleDelete(l.id)}
                    >
                      <i className="ti ti-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="datatable-bottom">
            <div className="datatable-info">Showing 1 to 5 of 6 entries</div>
            <nav className="datatable-pagination">
              <ul className="datatable-pagination-list">
                <li className="datatable-pagination-list-item datatable-hidden datatable-disabled">
                  <button
                    data-page={1}
                    className="datatable-pagination-list-item-link"
                    aria-label="Page 1"
                  >
                    ‹
                  </button>
                </li>
                <li className="datatable-pagination-list-item datatable-active">
                  <button
                    data-page={1}
                    className="datatable-pagination-list-item-link"
                    aria-label="Page 1"
                  >
                    1
                  </button>
                </li>
                <li className="datatable-pagination-list-item">
                  <button
                    data-page={2}
                    className="datatable-pagination-list-item-link"
                    aria-label="Page 2"
                  >
                    2
                  </button>
                </li>
                <li className="datatable-pagination-list-item">
                  <button
                    data-page={2}
                    className="datatable-pagination-list-item-link"
                    aria-label="Page 2"
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

