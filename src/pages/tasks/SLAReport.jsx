import BreadCrumb from "../../components/BreadCrumb";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import Select from "react-select";

const TATAlerts = () => {
  const [departments] = useState([
    { id: "DEP01", name: "HR" },
    { id: "DEP02", name: "IT" },
    { id: "DEP03", name: "Finance" },
    { id: "DEP04", name: "Operations" },
  ]);

  const [tasks, setTasks] = useState([
    {
      id: "T001",
      name: "Approve Employee",
      assignedTo: "Admin",
      assignedBy: "Admin",
      slaDeadline: "2025-08-28T15:00:00",
      status: "Pending",
      priority: "High",
      createdAt: "2025-08-25",
      updatedAt: "2025-08-25",
    },
    {
      id: "T002",
      name: "Submit Invoice",
      assignedTo: "Finance Team",
      assignedBy: "Admin",
      slaDeadline: "2025-08-28T12:00:00",
      status: "Pending",
      priority: "Medium",
      createdAt: "2025-08-25",
      updatedAt: "2025-08-25",
    },
    {
      id: "T003",
      name: "Update System Config",
      assignedTo: "IT Admin",
      assignedBy: "Admin",
      slaDeadline: "2025-08-29T10:00:00",
      status: "In Progress",
      priority: "High",
      createdAt: "2025-08-25",
      updatedAt: "2025-08-26",
    },
  ]);

  const [filters, setFilters] = useState({ search: "" });
  const [newTask, setNewTask] = useState({
    name: "",
    assignedTo: "",
    assignedBy: "",
    slaDeadline: "",
    status: "Pending",
    priority: "Medium",
  });

  // Re-render every minute to recalc SLA dynamically
  useEffect(() => {
    const interval = setInterval(() => setTasks((prev) => [...prev]), 60000);
    return () => clearInterval(interval);
  }, []);

  const filteredTasks = tasks.filter((task) => {
    const q = filters.search.trim().toLowerCase();
    if (!q) return true;
    return (
      task.name.toLowerCase().includes(q) ||
      (task.assignedTo || "").toLowerCase().includes(q) ||
      (task.assignedBy || "").toLowerCase().includes(q)
    );
  });

  const createNextTaskId = () => {
    const maxNum = Math.max(
      0,
      ...tasks.map((t) => {
        const n = parseInt((t.id || "").replace(/\D/g, ""), 10);
        return isNaN(n) ? 0 : n;
      })
    );
    return "T" + String(maxNum + 1).padStart(3, "0");
  };

  const handleAddTask = () => {
    const { name, assignedTo, assignedBy, slaDeadline, priority } = newTask;

    if (!name.trim() || !assignedTo.trim() || !assignedBy?.trim() || !slaDeadline) {
      toast.error("Please fill all fields");
      return;
    }

    const now = new Date().toISOString();

    const taskToAdd = {
      id: createNextTaskId(),
      name: name.trim(),
      assignedTo: assignedTo.trim(),
      assignedBy: assignedBy.trim(),
      slaDeadline,
      status: "Pending",
      priority,
      createdBy: "Admin",
      createdAt: now,
      updatedBy: "Admin",
      updatedAt: now,
    };

    setTasks((prev) => [...prev, taskToAdd]);
    setNewTask({ name: "", assignedTo: "", assignedBy: "", slaDeadline: "", status: "Pending", priority: "Medium" });
    toast.success("Task added successfully");
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      toast.success("Task deleted successfully");
    }
  };

  // SLA calculation with time remaining
  const calculateTimeLeft = (deadline) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end - now;

    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);

    return { hours, minutes, totalHours: diff / 3600000 };
  };

  const getSLAStatuses = (deadline) => {
    const { totalHours } = calculateTimeLeft(deadline);
    return [
      { label: "Breached", color: "#dc3545", show: totalHours < 0 },
      { label: "Approaching SLA", color: "#ffc107", show: totalHours >= 0 && totalHours < 1 },
      { label: "On Time", color: "#28a745", show: totalHours >= 1 },
    ].filter((s) => s.show);
  };

  const handleView = (id) => toast.info("View task: " + id);
  const handleEdit = (id) => toast.info("Edit task: " + id);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <BreadCrumb subLabel="Admin" pageTitle="TAT Alerts" subUrl="/tat-alerts" />
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card table-card">
            <div className="card-body pt-3">
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Task ID</th>
                      <th>Task</th>
                      <th>Assigned To</th>
                      <th>Assigned By</th>
                      
                      <th>SLA Deadline</th>
                      <th>TAT Alerts</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTasks.map((task, index) => {
                      const slaStatuses = getSLAStatuses(task.slaDeadline);
                      const timeLeft = calculateTimeLeft(task.slaDeadline);

                      return (
                        <tr key={task.id}>
                          <td>{index + 1}</td>
                          <td>{task.id}</td>
                          <td>{task.name || "--"}</td>
                          <td>{task.assignedTo || "--"}</td>
                          <td>{task.assignedBy || "--"}</td>
                         
                          <td>{task.slaDeadline ? new Date(task.slaDeadline).toLocaleString() : "--"}</td>
                          <td>
                            {slaStatuses.map((sla, idx) => (
                              <div key={idx} style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                                <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "50%",backgroundColor: sla.color, }}></span>
                                <span style={{ fontSize: "0.9rem", fontWeight: "500" }}>
                                  {sla.label}
                                  </span>
                                  </div>
                                ))}
                          </td>
                           <td>
                            <span
                              className={`badge ${
                                task.priority === "High" ? "bg-danger" :
                                task.priority === "Medium" ? "bg-warning" :
                                "bg-info"
                              }`}
                            >
                              {task.priority}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                task.status === "Pending" ? "bg-warning" :
                                task.status === "In Progress" ? "bg-primary" :
                                "bg-success"
                              }`}
                              title={`Created: ${task.createdAt} | Updated: ${task.updatedAt}`}
                            >
                              {task.status}
                            </span>
                          </td>
                          <td>
                            <ul className="list-inline m-0">
                              <li className="list-inline-item cursor-pointer me-1">
                                <span className="avtar avtar-s btn-link-info btn-pc-default" title="View" onClick={() => handleView(task.id)}>
                                  <i className="ti ti-eye f-18" />
                                </span>
                              </li>
                              <li className="list-inline-item cursor-pointer me-1">
                                <span className="avtar avtar-s btn-link-warning btn-pc-default" title="Edit" onClick={() => handleEdit(task.id)}>
                                  <i className="ti ti-edit f-18" />
                                </span>
                              </li>
                              <li className="list-inline-item cursor-pointer">
                                <span className="avtar avtar-s btn-link-danger btn-pc-default" title="Delete" onClick={() => handleDelete(task.id)}>
                                  <i className="ti ti-trash f-18" />
                                </span>
                              </li>
                            </ul>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredTasks.length === 0 && (
                      <tr>
                        <td colSpan="10" className="text-center text-muted">No tasks found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TATAlerts;
