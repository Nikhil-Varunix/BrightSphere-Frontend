import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import BreadCrumb from "../../components/BreadCrumb";
import { formatDate, formatTime } from "../../utils/time";

const UserTaskHistory = () => {
  const location = useLocation();

  // 🔹 initial static tasks data
  const tasksData = [
    {
      sno: 1,
      id: "T001",
      name: "AC Repair",
      customerName: "John Doe",
      mobile: "98765 43210",
      dueDate: "2023-02-07",
      createdAt: "2023-02-01 10:15 AM",
      status: "Completed",
      priority: "Medium",
      category: "Maintenance",
      assignedTo: "Airi Satou",
      createdBy: "admin",
      assignedBy: "Brielle Williamson",
    },
    {
      sno: 2,
      id: "T003",
      name: "Heater Maintenance",
      customerName: "Alex Johnson",
      mobile: "98765 43212",
      dueDate: "2023-01-22",
      createdBy: "admin",
      createdAt: "2023-01-20 09:00 AM",
      status: "Pending",
      priority: "High",
      category: "Maintenance",
      assignedTo: "Bradley Greer",
      assignedBy: "Brielle Williamson",
    },
  ];

  // 🔹 read query params
  const queryParams = new URLSearchParams(location.search);
  const initialUser = queryParams.get("user") || "";
  const initialStatus = queryParams.get("status") || "";

  const [filters, setFilters] = useState({
    user: initialUser,
    status: initialStatus,
    search: "",
  });

  // 🔹 Get unique dropdown values dynamically
  const userOptions = useMemo(
    () => ["", ...new Set(tasksData.map((t) => t.assignedTo))],
    [tasksData]
  );

  const statusOptions = useMemo(
    () => ["", ...new Set(tasksData.map((t) => t.status))],
    [tasksData]
  );

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  // 🔹 Apply filters
  const filteredTasks = tasksData.filter((task) => {
    const query = filters.search.toLowerCase();

    const matchesSearch =
      task.id.toLowerCase().includes(query) ||
      task.name.toLowerCase().includes(query) ||
      task.mobile.toLowerCase().includes(query) ||
      task.status.toLowerCase().includes(query) ||
      task.priority.toLowerCase().includes(query) ||
      task.assignedTo.toLowerCase().includes(query) ||
      task.assignedBy.toLowerCase().includes(query) ||
      task.createdBy.toLowerCase().includes(query);

    const matchesUser = filters.user ? task.assignedTo === filters.user : true;
    const matchesStatus = filters.status ? task.status === filters.status : true;

    return matchesSearch && matchesUser && matchesStatus;
  });

  // 🔹 Heading
  const heading = filters.user
    ? `${filters.user} - ${filters.status || "All"} Tasks`
    : "User Task History";

  return (
    <>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center">
        <BreadCrumb
          subLabel="Admin"
          pageTitle="User Task History"
          subUrl="/usertaskhistory"
        />
      </div>

      {/* Filters */}
      <div className="d-flex align-items-center gap-3 flex-wrap my-3">
        {/* User Dropdown */}
        <select
          className="form-select"
          style={{ maxWidth: "200px" }}
          value={filters.user}
          onChange={(e) => handleFilterChange("user", e.target.value)}
        >
          <option value="">All Users</option>
          {userOptions.map((user, idx) =>
            user ? (
              <option key={idx} value={user}>
                {user}
              </option>
            ) : null
          )}
        </select>

        {/* Status Dropdown */}
        <select
          className="form-select"
          style={{ maxWidth: "200px" }}
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
        >
          <option value="">All Status</option>
          {statusOptions.map((status, idx) =>
            status ? (
              <option key={idx} value={status}>
                {status}
              </option>
            ) : null
          )}
        </select>

        {/* Search Input */}
        <input
          type="search"
          className="form-control"
          style={{ maxWidth: "300px" }}
          placeholder="Search by Task ID / Name / Mobile / Status / Priority"
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
        />
      </div>

      {/* Heading */}
      <h4 className="my-3">{heading}</h4>

      {/* Table */}
      <div className="card">
        <div className="card-body table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Task Name</th>
                <th>Customer</th>
                <th>Mobile</th>
                <th>Assigned To</th>
                <th>Assigned By</th>
                <th>Created By</th>
                <th>Created Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <tr key={task.id}>
                    <td>{task.sno}</td>
                    <td>{task.name}</td>
                    <td>{task.customerName}</td>
                    <td>{task.mobile}</td>
                    <td>{task.assignedTo}</td>
                    <td>{task.assignedBy}</td>
                    <td>{task.createdBy}</td>
                    <td>
                      {task.createdAt ? formatDate(task.createdAt) : "N/A"}
                      <br />
                      <small>
                        {task.createdAt ? formatTime(task.createdAt) : "N/A"}
                      </small>
                    </td>
                    <td>{task.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center">
                    No tasks found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default UserTaskHistory;
