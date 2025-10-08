import BreadCrumb from "../../components/BreadCrumb";
import toast from "react-hot-toast";
import { useState } from "react";
import { Link } from "react-router-dom";

const EmployeeApproval = () => {
  const [employees, setEmployees] = useState([
    // {
    //   id: "EMP101",
    //   name: "John Doe",
    //   email: "john.doe@example.com",
    //   phone: "9876543210",
    //   department: "Electrical",
    //   role: "Technician",
    //   joiningDate: "08/09/2025",
    //   createdBy: "HR Admin",
    //   createdAt: "20/08/2025",
    //   updatedBy: "HR Admin",
    //   updatedAt: "20/08/2025",
    //   status: "Pending",
    // },
    {
      id: "EMP102",
      name: "john",
      email: "john@gmail.com",
      phone: "9997773988",
      department: "Field Operations",
      role: "Manager",
      joiningDate: "08/09/2025",
      createdBy: "HR Admin",
      createdAt: "08/09/2025",
      updatedBy: "System",
      updatedAt: "18/09/2025",
      status: "Pending",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState({ all: "", date: "" });
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });
  const [selectedEmployee, setSelectedEmployee] = useState(null); // For details panel

  const handleApprove = (id) => {
    setEmployees((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, status: "Approved", updatedBy: "Admin", updatedAt: new Date().toISOString().slice(0, 10) }
          : e
      )
    );
    toast.success("Employee approved successfully");
  };

  const handleReject = (id) => {
    setEmployees((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, status: "Rejected", updatedBy: "Admin", updatedAt: new Date().toISOString().slice(0, 10) }
          : e
      )
    );
    toast.error("Employee rejected");
  };

  const renderSortIcons = (key) => (
    <span style={{ display: "inline-flex", flexDirection: "column", marginLeft: "5px", verticalAlign: "middle" }}>
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

  const filteredEmployees = employees.filter((emp) => {
    const q = searchQuery.all.toLowerCase().trim();
    const date = searchQuery.date;
    let matchesSearch =
      !q ||
      emp.name.toLowerCase().includes(q) ||
      (emp.id || "").toLowerCase().includes(q) ||
      (emp.email || "").toLowerCase().includes(q) ||
      (emp.phone || "").toLowerCase().includes(q) ||
      (emp.department || "").toLowerCase().includes(q) ||
      (emp.role || "").toLowerCase().includes(q);
    let matchesDate = !date || emp.joiningDate === date;
    return matchesSearch && matchesDate;
  });

  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    let valA = a[sortConfig.key] || "";
    let valB = b[sortConfig.key] || "";
    if (typeof valA === "string") return sortConfig.direction === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
    return sortConfig.direction === "asc" ? valA - valB : valB - valA;
  });

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <BreadCrumb subLabel="Admin" pageTitle="Employee Approval" subUrl="/employee-approval" />
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card table-card">
            <div className="card-body pt-3">
              <div className="d-flex align-items-center gap-2 mb-3 px-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search employees..."
                  value={searchQuery.all || ""}
                  onChange={(e) => setSearchQuery({ ...searchQuery, all: e.target.value })}
                  style={{ width: "200px" }}
                />
                <input
                  type="date"
                  className="form-control"
                  value={searchQuery.date || ""}
                  onChange={(e) => setSearchQuery({ ...searchQuery, date: e.target.value })}
                  style={{ width: "180px" }}
                />
              </div>

              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>S.No {renderSortIcons("sno")}</th>
                      <th>Employee {renderSortIcons("name")}</th>
                      <th>Mobile {renderSortIcons("phone")}</th>
                      <th>Department {renderSortIcons("department")}</th>
                      <th>Designation  {renderSortIcons("role")}</th>
                      <th>Joining Date {renderSortIcons("joiningDate")}</th>
                      <th>Created {renderSortIcons("createdAt")}</th>
                      <th>Updated {renderSortIcons("updatedAt")}</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedEmployees.map((emp, index) => (
                      <tr key={emp.id}>
                        <td>{index + 1}</td>
                        <td>
                          <div>{emp.name || "--"}</div>
                          <div style={{ fontSize: "12px", color: "#888" }}>{emp.email || "--"}</div>
                        </td>
                        <td>{emp.phone || "--"}</td>
                        <td>{emp.department || "--"}</td>
                        <td>{emp.role || "--"}</td>
                        <td>{emp.joiningDate || "--"}</td>
                        <td>
                          <div>{emp.createdBy || "--"}</div>
                          <div style={{ fontSize: "12px", color: "#888" }}>{emp.createdAt || "--"}</div>
                        </td>
                        <td>
                          <div>{emp.updatedBy || "--"}</div>
                          <div style={{ fontSize: "12px", color: "#888" }}>{emp.updatedAt || "--"}</div>
                        </td>
                        <td>
  <ul className="list-inline m-0">
    {emp.status === "Pending" && (
      <>
        <li className="list-inline-item cursor-pointer">
          <span
            className="avtar avtar-s btn btn-light-success btn-sm"
            title="Approve"
            onClick={() => handleApprove(emp.id)}
          >
            <i className="ti ti-check f-18" />
          </span>
        </li>
        <li className="list-inline-item cursor-pointer">
          <span
            className="avtar avtar-s btn btn-light-danger btn-sm"
            title="Reject"
            onClick={() => handleReject(emp.id)}
          >
            <i className="ti ti-x f-18" />
          </span>
        </li>
      </>
    )}
    <li className="list-inline-item cursor-pointer">
      <span
        className="avtar avtar-s btn btn-light-primary btn-sm"
        title="View"
        data-bs-toggle="offcanvas"
        data-bs-target="#employeeDetailsPanel"
        onClick={() => setSelectedEmployee(emp)}
      >
        <i className="ti ti-eye f-18" />
      </span>
    </li>
  </ul>
</td>

                      </tr>
                    ))}
                    {sortedEmployees.length === 0 && (
                      <tr>
                        <td colSpan="9" className="text-center text-muted">
                          No employees found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
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
      </div>

     {/* Employee Details Offcanvas */}
{/* <div
  className="offcanvas offcanvas-end"
  tabIndex="-1"
  id="employeeDetailsPanel"
  aria-labelledby="employeeDetailsLabel"
>
  <div className="offcanvas-header border-bottom">
    <h5 id="employeeDetailsLabel" className="mb-0 fw-bold">
      Employee Details
    </h5>
    <button
      type="button"
      className="btn-close text-reset"
      data-bs-dismiss="offcanvas"
      aria-label="Close"
    ></button>
  </div>

  <div className="offcanvas-body">
    {selectedEmployee ? (
      <div className="p-2">
        <div className="card  border shadow-sm mb-4">
          <div className="card-body d-flex align-items-center">
            <div className="avtar bg-light-primary rounded-circle me-3 d-flex justify-content-center align-items-center" style={{ width: '50px', height: '50px' }}>
              <i className="ti ti-user f-24 text-primary"></i>
            </div>
            <div>
              <h6 className="mb-1 fw-bold">{selectedEmployee.name}</h6>
              <small className="text-muted">Email: {selectedEmployee.email}</small>
            </div>
          </div>
        </div>

        <ul className="list-group list-group-flush">
          <li className="list-group-item d-flex justify-content-between align-items-center border rounded mb-2 shadow-sm">
            <span>Employee ID</span>
            <span className="fw-bold">{selectedEmployee.id}</span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center border rounded mb-2 shadow-sm">
            <span>Phone</span>
            <span className="fw-bold">{selectedEmployee.phone}</span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center border rounded mb-2 shadow-sm">
            <span>Department</span>
            <span className="fw-bold">{selectedEmployee.department}</span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center border rounded mb-2 shadow-sm">
            <span>Role</span>
            <span className="fw-bold">{selectedEmployee.role}</span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center border rounded mb-2 shadow-sm">
            <span>Joining Date</span>
            <span className="fw-bold">{selectedEmployee.joiningDate}</span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center border rounded mb-2 shadow-sm">
            <span>Status</span>
            <span
              className={`badge rounded-pill px-3 py-2 ${
                selectedEmployee.status === "Approved"
                  ? "bg-success"
                  : selectedEmployee.status === "Rejected"
                  ? "bg-danger"
                  : "bg-warning"
              }`}
            >
              {selectedEmployee.status}
            </span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center border rounded mb-2 shadow-sm">
            <span>Created By</span>
            <span className="fw-bold">
              {selectedEmployee.createdBy} ({selectedEmployee.createdAt})
            </span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center border rounded mb-2 shadow-sm">
            <span>Updated By</span>
            <span className="fw-bold">
              {selectedEmployee.updatedBy} ({selectedEmployee.updatedAt})
            </span>
          </li>
        </ul>
      </div>
    ) : (
      <p className="text-muted">No details available.</p>
    )}
  </div>
</div> */}

    </>
  );
};

export default EmployeeApproval;
