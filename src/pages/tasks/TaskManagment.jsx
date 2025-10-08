import React, { useState } from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/time";
import ReassignTaskModal from "./components/ReassignTaskModal";
import RevokeTaskModal from "./components/RevokeTaskModal";
import BreadCrumb from "../../components/BreadCrumb";

const truncate = (text, length = 25) => {
  if (!text) return "";
  return text.length > length ? text.substring(0, length) + "..." : text;
};

const getStatusBadge = (status) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "badge bg-light-warning text-dark";
    case "completed":
      return "badge bg-light-success";
    case "in progress":
      return "badge bg-light-primary";
    case "overdue":
      return "badge bg-light-danger";
    default:
      return "badge bg-light-secondary";
  }
};

const getPriorityBadge = (priority) => {
  switch (priority.toLowerCase()) {
    case "high":
      return "badge bg-light-danger";
    case "medium":
      return "badge bg-light-warning text-dark";
    case "low":
      return "badge bg-light-success";
    default:
      return "badge bg-secondary";
  }
};

const TaskManagement = () => {
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  const handleReassign = (task) => {
    setSelectedTask(task);
    setShowReassignModal(true);
  };

  const handleRevoke = (task) => {
    setSelectedTask(task);
    setShowRevokeModal(true);
  };

  const handleCloseModal = () => {
    setShowReassignModal(false);
    setShowRevokeModal(false);
    setSelectedTask(null);
  };

  const handleReassignSubmit = (updatedTask) => {
    console.log("Reassigned Task Data:", updatedTask);
    setShowReassignModal(false);
  };

  const handleRevokeSubmit = (updatedTask) => {
    console.log("Revoke Task Data:", updatedTask);
    setShowRevokeModal(false);
  };

  const [tasks, setTasks] = useState([
    {
      id: "T001",
      taskName: "Washing Machine Operational Issue",
      serviceName: "Installation Service",
      customerName: "John",
      customerPhone: "98765 43210",
      assignedTo: "Satish Netha",
      assignedBy: "Nikhil Shetty",
      assignedDate: "09/09/2025",
      createdBy: "Nikhil Shetty",
      createdAt: "09/09/2025",
      dueDate: "12/09/2025",
      status: "Pending",
      priority: "Medium",
    },
  ]);

  const [filters, setFilters] = useState({
    search: "",
    date: "",
    status: "",
    priority: "",
    assignedTo: "",
    overdue: false,
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleDelete = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const filteredTasks = tasks.filter((task) => {
    const isOverdue = new Date(task.dueDate) < new Date();
    return (
      (!filters.search ||
        task.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.taskName.toLowerCase().includes(filters.search.toLowerCase())) &&
      (!filters.date || task.dueDate === filters.date) &&
      (!filters.status || task.status === filters.status) &&
      (!filters.priority || task.priority === filters.priority) &&
      (!filters.assignedTo || task.assignedTo === filters.assignedTo) &&
      (!filters.overdue || isOverdue)
    );
  });

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
          color: sortConfig.key === key && sortConfig.direction === "asc" ? "#000" : "#ccc",
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
          color: sortConfig.key === key && sortConfig.direction === "desc" ? "#000" : "#ccc",
        }}
        onClick={() => setSortConfig({ key, direction: "desc" })}
      >
        ▼
      </span>
    </span>
  );

  return (
    <>
      
      <div className="d-flex rustify-content-between align-items-center">
        <BreadCrumb subLabel="Tasks" pageTitle="Task Management"  />
       
      </div>
      <div className="col-12">
        <div className="card table-card">
          <div className="card-body pt-3">
            <div className="d-flex align-items-center mb-3 px-3 gap-2 flex-wrap justify-content-between">
              <input
                type="search"
                className="form-control"
                style={{ maxWidth: "300px" }}
                placeholder="Search by Task ID, Name, Date, Status, Priority, or Agent"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>

            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>S.No {renderSortIcons("sno")}</th>
                    <th>Task / Service {renderSortIcons("taskName")}</th>
                    <th>Customer {renderSortIcons("customer")}</th>
                     <th>Assigned To {renderSortIcons("assignedTo")}</th>
                    <th>Assigned By {renderSortIcons("assignedBy")}</th>
                    <th>Assigned Date {renderSortIcons("createdDate")}</th>
                    <th>Due Date {renderSortIcons("dueDate")}</th>
                    <th>Status {renderSortIcons("status")}</th>
                    <th>Priority {renderSortIcons("priority")}</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((task, index) => (
                    <tr key={task.id}>
                      <td>{index + 1}</td>

                      <td>
                        <span title={task.taskName}>{truncate(task.taskName)}</span>
                        <br />
                        <small title={task.serviceName}>{truncate(task.serviceName)}</small>
                      </td>

                      <td>
                        <span>{task.customerName}</span>
                        <br />
                        <small>{task.customerPhone}</small>
                      </td>
                      <td>{task.assignedTo}</td>
                      {/* Assigned By Name + Date */}
                      <td>{task.assignedBy}
                      </td>
                      {/* Created By Name + Date */}
                      <td>{task.createdAt ? formatDate(task.createdAt) : "N/A"}
                      </td>

                      <td>{task.dueDate ? formatDate(task.dueDate) : "N/A"}</td>

                      <td>
                        <span className={`${getStatusBadge(task.status)}`}>
                          {task.status}
                        </span>
                      </td>
                      <td>
                        <span className={`${getPriorityBadge(task.priority)}`}>
                          {task.priority}
                        </span>
                      </td>

                      <td>
  <Link
    to={`/tasks/old-assign-details`}
    className="avtar avtar-s  mx-1 btn-light-primary "
    title="View Task"
  >
    <i className="ti ti-eye" />
  </Link>
  <button
    className="avtar avtar-s btn-light-warning mx-1"
    title="Reassign Task"
    onClick={() => handleReassign(task)}
  >
    <i className="ti ti-refresh" />
  </button>
  <button
    className="avtar avtar-s mx-1 btn-light-info "
    title="Revoke Task"
    onClick={() => handleRevoke(task)}
  >
    <i className="ti ti-alert-circle" />
  </button>
  <button
    className="avtar avtar-s btn-light-danger mx-1"
    title="Delete Task"
    onClick={() => {
      if (window.confirm("Are you sure you want to delete this task?")) {
        handleDelete(task.id);
        alert("Task deleted successfully!");
      }
    }}
  >
    <i className="ti ti-trash" />
  </button>
</td>

                    </tr>
                  ))}
                </tbody>
              </table>

              <ReassignTaskModal
                show={showReassignModal}
                handleClose={handleCloseModal}
                taskData={selectedTask}
                onReassign={handleReassignSubmit}
              />
              <RevokeTaskModal
                show={showRevokeModal}
                handleClose={handleCloseModal}
                taskData={selectedTask}
                onReassign={handleRevokeSubmit}
              />

              {filteredTasks.length === 0 && (
                <p className="text-center m-3">No tasks found.</p>
              )}
            </div>
            {/* Pagination */}
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
      </div>
    </>
  );
};

export default TaskManagement;
