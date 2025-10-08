import BreadCrumb from "../../components/BreadCrumb";
import { formatDate } from "../../utils/time";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import CreateTaskModal from "./components/CreateTaskModal";
import UpdateTask from "./components/UpdateTask";
import axios from "axios";
import ReactDOM from "react-dom";

const API_URL = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("authToken");

const dummyEmployees = [
  { id: "1", name: "Sadika" },
  { id: "2", name: "Sathish Netha" },
  { id: "3", name: "Nikhil" },
  { id: "4", name: "Priya Patel" },
];

// 🔹 Assign Dropdown Component (Single Select)
const AssignDropdown = ({
  task,
  assignSearch,
  setAssignSearch,
  handleAssign,
  closeDropdown,
  filteredEmployees,
}) => {
  const [selectedEmp, setSelectedEmp] = useState(null);

  return (
    <div
      className="assign-dropdown bg-light-secondary rounded shadow"
      style={{
        width: "260px",
        padding: "12px",
        fontSize: "14px",
      }}
      onClick={(e) => e.stopPropagation()}
    >

      {/* Search */}
      <input
        type="text"
        className="form-control form-control-sm mb-2"
        placeholder=" Search employee..."
        value={assignSearch[task._id] || ""}
        onChange={(e) =>
          setAssignSearch((prev) => ({ ...prev, [task._id]: e.target.value }))
        }
      />

      {/* Employee Options */}
      <div
        className="list-group mb-3"
      >
        {filteredEmployees(task._id).length > 0 ? (
          filteredEmployees(task._id).map((emp) => (
            <button
              key={emp.id}
              className={`list-group-item list-group-item-action py-2 ${
                selectedEmp?.id === emp.id ? "active" : ""
              }`}
              onClick={() => setSelectedEmp(emp)}
            >
              {emp.name}
            </button>
          ))
        ) : (
          <div className="text-muted text-center small py-2">
            No employees found
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="d-flex justify-content-end gap-2">
        <button
          className="btn btn-sm btn-secondary"
          onClick={() => {
            closeDropdown();
            setAssignSearch((prev) => ({ ...prev, [task._id]: "" }));
            setSelectedEmp(null);
          }}
        >
          Cancel
        </button>
        <button
          className="btn btn-sm btn-primary"
          disabled={!selectedEmp}
          onClick={() => {
            if (selectedEmp) {
              handleAssign(task._id, selectedEmp.id);
              closeDropdown();
              setAssignSearch((prev) => ({ ...prev, [task._id]: "" }));
              setSelectedEmp(null);
            }
          }}
        >
          Assign
        </button>
      </div>
    </div>
  );
};



const DashboardTask = () => {
  const [openAssignDropdown, setOpenAssignDropdown] = useState(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const [assignSearch, setAssignSearch] = useState({});
  const [tasks, setTasks] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [selectedTask, setSelectedTask] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [filters, setFilters] = useState({ search: "" });
  const orgId = "68b546e06c3ca038387c3173";

  useEffect(() => {
    fetchTasks();
  }, []);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !e.target.closest(".assign-dropdown") &&
        !e.target.closest(".btn-assign-toggle")
      ) {
        setOpenAssignDropdown(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const filteredEmployees = (taskId) =>
    dummyEmployees.filter((emp) =>
      emp.name.toLowerCase().includes((assignSearch[taskId] || "").toLowerCase())
    );

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/tasks/org/${orgId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setTasks(res.data.data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      toast.error("Failed to load tasks");
    }
  };

  const handleEditClick = (e, task) => {
    e.preventDefault();
    setSelectedTask(task);
    setShowUpdateModal(true);
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      const res = await axios.delete(`${API_URL}/tasks/delete/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setTasks((prev) => prev.filter((task) => task.taskId !== taskId));
        toast.success("Task deleted successfully");
      } else toast.error("Failed to delete task");
    } catch (err) {
      console.error("Delete task error:", err);
      toast.error("Error deleting task");
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const filteredTasks = tasks.filter((task) => {
    const query = filters.search.toLowerCase();
    return (
      task.taskName?.toLowerCase().includes(query) ||
      task.serviceName?.toLowerCase().includes(query) ||
      task.customerName?.toLowerCase().includes(query) ||
      task.customerPhone?.toLowerCase().includes(query) ||
      task.status?.toLowerCase().includes(query) ||
      task.priority?.toLowerCase().includes(query) ||
      task.assignedTo?.name?.toLowerCase().includes(query) ||
      task.assignedBy?.name?.toLowerCase().includes(query) ||
      task.createdBy?.name?.toLowerCase().includes(query)
    );
  });

  const renderSortIcons = (key) => (
    <span style={{ display: "inline-flex", flexDirection: "column", marginLeft: "5px" }}>
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

  const truncate = (text, maxLength = 20) =>
    text && text.length > maxLength ? text.substring(0, maxLength) + "..." : text;

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "badge bg-light-warning ";
      case "completed":
        return "badge bg-light-success ";
      case "in progress":
        return "badge bg-light-info ";
      case "overdue":
        return "badge bg-light-danger ";
      default:
        return "badge bg-light-secondary ";
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "badge bg-light-danger";
      case "medium":
        return "badge bg-light-warning";
      case "low":
        return "badge bg-light-info ";
      default:
        return "badge bg-light-secondary ";
    }
  };

 const handleAssign = (taskId, empId) => {
  // Find employee object by ID
  const employee = dummyEmployees.find((emp) => emp.id === empId);

  if (employee) {
  toast.success(`Successfully task assigned to ${employee.name}`); // Updated message
  // TODO: Call backend API with taskId and empId
} else {
  toast.error("Failed to assign task");
}
};


  // 🔹 Handle dropdown open at top-left of Assigned To cell
  const handleOpenDropdown = (taskId, e) => {
    const tdCell = e.currentTarget.closest("td");
    if (tdCell) {
      const rect = tdCell.getBoundingClientRect();
      setDropdownPos({
        top: rect.top + window.scrollY, // align to top of Assigned To cell
        left: rect.left + window.scrollX, // align flex-start
      });
      setOpenAssignDropdown(taskId);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <BreadCrumb subLabel="Tasks" pageTitle=" Assign Task" />
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card table-card">
            <div className="card-body pt-3">
              {/* Search + Create */}
              <div className="row m-0 mb-3">
                <div className="col-md-6 d-flex align-items-center">
                  <input
                    type="search"
                    className="form-control"
                    style={{ maxWidth: "300px" }}
                    placeholder="Search by Task / Service / Customer / Status / Priority"
                    value={filters.search}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                  />
                </div>

                <div className="col-md-6 d-flex align-items-center gap-2 justify-content-md-end">
                  <button
                    className="btn d-flex align-items-center btn-primary"
                    type="button"
                    onClick={() => setShowCreateTaskModal(true)}
                  >
                    <i className="ti ti-plus f-24 me-2"></i> Create Task
                  </button>
                </div>
              </div>

              {/* Table */}
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
                      <tr key={task._id}>
                        <td>{index + 1}</td>
                        <td>
                          <span title={task.taskName || "N/A"}>{truncate(task.taskName)}</span>
                          <br />
                          <small title={task.serviceName || "N/A"}>
                            {truncate(task.serviceName)}
                          </small>
                        </td>
                        <td>
                          <span className="h6">{task.customerName}</span>
                          <br />
                          <small>{task.customerPhone}</small>
                        </td>

                        {/* Assigned To + Dropdown */}
                        <td className="position-relative">
                          <div className="d-flex align-items-center">
                            <span>{task.assignedTo?.name || "N/A"}</span>
                            <button
                              className="btn btn-sm btn-assign-toggle"
                              onClick={(e) => handleOpenDropdown(task._id, e)}
                            >
                              <i className="ti ti-chevron-down"></i>
                            </button>
                          </div>

                          {/* Portal Dropdown */}
                          {openAssignDropdown === task._id &&
                            ReactDOM.createPortal(
                              <div
                                style={{
                                  position: "absolute",
                                  top: `${dropdownPos.top}px`,
                                  left: `${dropdownPos.left}px`,
                                  zIndex: 2000,
                                }}
                              >
                                <AssignDropdown
                                  task={task}
                                  assignSearch={assignSearch}
                                  setAssignSearch={setAssignSearch}
                                  handleAssign={handleAssign}
                                  closeDropdown={() => setOpenAssignDropdown(null)}
                                  filteredEmployees={filteredEmployees}
                                />
                              </div>,
                              document.body
                            )}
                        </td>

                        <td>{task.assignedBy?.name || "N/A"}</td>
                        <td>{task.createdAt ? formatDate(task.createdAt) : "N/A"}</td>
                        <td>{task.dueDate ? formatDate(task.dueDate) : "N/A"}</td>
                        <td>
                          <span className={getStatusClass(task.status)}>{task.status}</span>
                        </td>
                        <td>
                          <span className={getPriorityClass(task.priority)}>
                            {task.priority}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="text-nowrap">
                          <Link
                            to={`/tasks/details`}
                            className="avtar avtar-s mx-1 btn-light-primary"
                            title="View"
                          >
                            <i className="ti ti-eye" />
                          </Link>
                          <button
                            className="avtar avtar-s mx-1 btn-light-warning"
                            title="Edit"
                            onClick={(e) => handleEditClick(e, task)}
                          >
                            <i className="ti ti-pencil" />
                          </button>
                          <button
                            className="avtar avtar-s mx-1 btn-light-danger"
                            title="Delete"
                            onClick={() => handleDelete(task.taskId)}
                          >
                            <i className="ti ti-trash" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Modals */}
                <UpdateTask
                  show={showUpdateModal}
                  handleClose={() => setShowUpdateModal(false)}
                  taskData={selectedTask}
                />
                <CreateTaskModal
                  show={showCreateTaskModal}
                  handleClose={() => setShowCreateTaskModal(false)}
                  orgId={orgId}
                  fetchTasks={fetchTasks}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardTask;
