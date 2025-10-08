import BreadCrumb from "../../components/BreadCrumb"
import { Link } from "react-router-dom"
import toast from "react-hot-toast";
import {useEffect, useState, useMemo } from 'react';
// import CreateTaskModal from './components/CreateTaskModal';

const TATEffected = () => {
  const [tatStats, setTatStats] = useState({
    total: 0,
    tatMet: 0,
    tatBreached: 0,
    tatUpcoming: 0,
  });

  // Simulate API call
  useEffect(() => {
    // Replace with axios.get("/api/tat-affected")
    const fetchTatData = async () => {
      const mockData = {
        total: 85,
        tatMet: 60,
        tatBreached: 15,
        tatUpcoming: 10,
      };
      setTatStats(mockData);
    };

    fetchTatData();
  }, []);

  const [selectedTask, setSelectedTask] = useState(null);

  // ✅ Updated task structure for TAT
  const tasksData = [
    {
      id: "001",
      name: "AC Repair",
      assignedTo: "Airi Satou",
      assignmentTat: "2 hrs",
      responseTat: "3 hrs",
      resolutionTat: "5 hrs",
      delayReason: "Parts not available",
      status: "Completed"
    },
    {
      id: "002",
      name: "Washing Machine Repair",
      assignedTo: "Bradley Greer",
      assignmentTat: "1 hr",
      responseTat: "2 hrs",
      resolutionTat: "6 hrs",
      delayReason: "Technician delay",
      status: "Pending"
    },
    {
      id: "003",
      name: "Fridge Installation",
      assignedTo: "Brielle Williamson",
      assignmentTat: "3 hrs",
      responseTat: "4 hrs",
      resolutionTat: "8 hrs",
      delayReason: "Customer not available",
      status: "In Progress"
    }
  ];

  

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    assignedTo: ""
  });

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  // Dynamic dropdown values
  const statusOptions = useMemo(
    () => ["", ...new Set(tasksData.map((t) => t.status))],
    [tasksData]
  );
  const assignedToOptions = useMemo(
    () => ["", ...new Set(tasksData.map((t) => t.assignedTo))],
    [tasksData]
  );

  // Filtering
  const filteredTasks = tasksData.filter((task) => {
    return (
      (filters.search === "" ||
        task.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.name.toLowerCase().includes(filters.search.toLowerCase())) &&
      (filters.status === "" || task.status === filters.status) &&
      (filters.assignedTo === "" || task.assignedTo === filters.assignedTo)
    );
  });

  const [selectedIds, setSelectedIds] = useState([]);

  const toggleCheckbox = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleEditClick = (e, task) => {
    e.preventDefault();
    setSelectedTask(task);
    setShowUpdateModal(true);
  };

  const handleDelete = () => {
    const confirmed = window.confirm("Are you sure you want to delete this task?");
    if (confirmed) {
      toast.success("Task deleted successfully");
    }
  };

  return (
    <>
     <div className="d-flex justify-content-between align-items-center">
  <BreadCrumb subLabel="Tasks" pageTitle="TAT" subUrl="/TAT" />

  {/* <div className="d-flex gap-2"> 
    <button
      className="btn d-flex align-items-center btn-primary mt-3 mb-4"
      type="button"
      onClick={() => setShowCreateTaskModal(true)}
    >
      <i className="ti ti-plus f-24 me-2"></i> Create Task
    </button>
  </div> */}
</div>
    <div className="row">

     <div className="col-lg-3 col-md-6">
        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0">
                <div className="avtar bg-light-primary">
                  <i className="ti ti-clipboard-list" />
                </div>
              </div>
              <div className="flex-grow-1 ms-3">
                <p className="mb-1">Total TAT Tasks</p>
                <h4 className="mb-0">{tatStats.total}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TAT Met */}
      <div className="col-lg-3 col-md-6">
        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0">
                <div className="avtar bg-light-success">
                  <i className="ti ti-check f-24" />
                </div>
              </div>
              <div className="flex-grow-1 ms-3">
                <p className="mb-1">TAT Met</p>
                <div className="d-flex align-items-center justify-content-between">
                  <h4 className="mb-0">{tatStats.tatMet}</h4>
                  <span className="text-success fw-medium">
                    {((tatStats.tatMet / tatStats.total) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TAT Breached */}
      <div className="col-lg-3 col-md-6">
        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0">
                <div className="avtar bg-light-danger">
                  <i className="ti ti-alert-triangle f-24" />
                </div>
              </div>
              <div className="flex-grow-1 ms-3">
                <p className="mb-1">TAT Breached</p>
                <div className="d-flex align-items-center justify-content-between">
                  <h4 className="mb-0">{tatStats.tatBreached}</h4>
                  <span className="text-danger fw-medium">
                    {((tatStats.tatBreached / tatStats.total) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming TAT */}
      <div className="col-lg-3 col-md-6">
        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0">
                <div className="avtar bg-light-warning">
                  <i className="ti ti-clock f-24" />
                </div>
              </div>
              <div className="flex-grow-1 ms-3">
                <p className="mb-1">Upcoming TAT</p>
                <div className="d-flex align-items-center justify-content-between">
                  <h4 className="mb-0">{tatStats.tatUpcoming}</h4>
                  <span className="text-warning fw-medium">
                    {((tatStats.tatUpcoming / tatStats.total) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-12">
        <div className="card table-card">
          <div className="card-body pt-3">
            
            {/* Filters */}
            <div className="d-flex align-items-center mb-3 px-3 gap-2 flex-wrap justify-content-between">
  {/* Search by Task ID / Task Name */}
  <input
    type="search"
    className="form-control"
    style={{ maxWidth: "220px" }}
    placeholder="Search by Task ID / Name"
    value={filters.search}
    onChange={(e) => handleFilterChange("search", e.target.value)}
  />

  {/* Filter by Assigned To */}
  <select
    className="form-control"
    style={{ maxWidth: "160px" }}
    value={filters.assignedTo}
    onChange={(e) => handleFilterChange("assignedTo", e.target.value)}
  >
    <option value="">Assigned To</option>
    {assignedToOptions.map((assignee, i) => (
      <option key={i} value={assignee}>
        {assignee}
      </option>
    ))}
  </select>

  {/* Filter by Status */}
  <select
    className="form-control"
    style={{ maxWidth: "160px" }}
    value={filters.status}
    onChange={(e) => handleFilterChange("status", e.target.value)}
  >
    <option value="">All Status</option>
    {statusOptions.map((status, i) => (
      <option key={i} value={status}>
        {status}
      </option>
    ))}
  </select>

  {/* Filter by Delay Duration */}
  <select
    className="form-control"
    style={{ maxWidth: "160px" }}
    value={filters.delayDuration}
    onChange={(e) => handleFilterChange("delayDuration", e.target.value)}
  >
    <option value="">All Delay Durations</option>
    <option value="lessThan30">Less than 30 min</option>
    <option value="30to60">30–60 min</option>
    <option value="moreThan60">More than 60 min</option>
  </select>
</div>


            {/* TAT Effected Table */}
            <div className="table-responsive">
              <table className="table table-hover">
    <thead>
      <tr>
        {/* Removed checkbox header */}
        <th>Task ID</th>
        <th>Task Name</th>
        <th>Assigned To</th>
        <th>Assignment TAT</th>
        <th>Response TAT</th>
        <th>Resolution TAT</th>
        <th>Delay Reason</th>
        <th>Status</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {filteredTasks.map((task) => (
        <tr key={task.id}>
          {/* Removed checkbox column */}
          <td className="text-primary">{task.id}</td>
          <td>{task.name}</td>
          <td>{task.assignedTo}</td>
          <td>{task.assignmentTat}</td>
          <td>{task.responseTat}</td>
          <td>{task.resolutionTat}</td>
          <td>{task.delayReason}</td>
          <td className="text-primary">{task.status}</td>
          <td>
            <Link
              to={`/tasks/tat-effected-details`}
              className="avtar avtar-xs btn-link-secondary"
            >
              <i className="ti ti-eye f-20" />
            </Link>
            {/* <a
              href="#"
              className="avtar avtar-xs btn-link-secondary"
              onClick={(e) => handleEditClick(e, task)}
            >
              <i className="ti ti-edit f-20" />
            </a>
            <a
              href="#"
              className="avtar avtar-xs btn-link-secondary"
              onClick={() => handleDelete(task.id)}
            >
              <i className="ti ti-trash f-20" />
            </a> */}
          </td>
        </tr>
      ))}
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

export default TATEffected;
