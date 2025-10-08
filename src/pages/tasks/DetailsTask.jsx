import React, { useEffect } from "react";
import BreadCrumb from "../../components/BreadCrumb";
import { Link } from "react-router-dom";

const taskData = {
  taskDetails: {
    id: "#12345",
    Task: "Washing Machine Operational Issue",
    service: "Installation Service",
    createdDate: "2025-09-09",
    createdBy: "Nikhil Shetty",
    assignedBy: "Nikhil Shetty",
    assignedDate: "2025-09-09",
    tat: "2 days",
    status: "Pending",
    priority: "Medium",
    dueDate: "2025-09-12",
    // updatedBy: "John Doe",
    updatedDate: "2025-09-12",
    recurrence: "Weekly",
    address: "Hyderabad",
  },
  assignedTo: {
    name: "Satish Netha",
    role: "Field Operator",
    location: "Remote",
    phone: "+9876543222",
    email: "satish@example.com",
    assignedDate: "2025-09-09",
    photo: "https://randomuser.me/api/portraits/men/75.jpg",
  },
  customerDetails: {
    company: "John ",
    phone: "+9876543210",
    email: "john.smith@example.com",
    primaryContact: "Hyderabad",
    photo: "https://randomuser.me/api/portraits/women/65.jpg",
    siteAddress: "Begumper, Hyderabad",
  },
};

// Function to format date as dd/mm/yyyy
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Status badge colors
const getStatusBadge = (status) => {
  switch (status) {
    case "Pending":
      return "badge bg-light-warning text-dark";
    case "In Progress":
      return "badge bg-light-primary";
    case "Completed":
      return "badge bg-light-success";
    case "Cancelled":
      return "badge bg-light-danger";
    default:
      return "badge bg-light-secondary";
  }
};

// Priority badge colors
const getPriorityBadge = (priority) => {
  switch (priority) {
    case "High":
      return "badge bg-light-danger";
    case "Medium":
      return "badge bg-light-warning text-dark";
    case "Low":
      return "badge bg-light-success";
    default:
      return "badge bg-secondary";
  }
};

const DetailsTask = () => {
  const { taskDetails, assignedTo, customerDetails } = taskData;

  useEffect(() => {
    const sections = document.querySelectorAll(".fade-section");
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100");
            entry.target.classList.remove("opacity-0");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    sections.forEach((section) => observer.observe(section));
  }, []);

  return (
    <>
      
      <div className="d-flex justify-content-between align-items-center">
<BreadCrumb subLabel="Tasks" pageTitle="Details" />
  <div className="d-flex gap-2">
    <Link
      className="btn d-flex align-items-center btn-primary mt-3 mb-4"
      to="/tasks/task-managment"
    >
      <i className="ti ti-chevron-left f-24 me-2"></i>
      Go to Tasks
    </Link>
  </div>
</div>


      <div className="container py-4">
        <div className="card p-4">
          {/* Task Details */}
          <div className="fade-section card shadow-sm p-4 mb-4">
            <h3 className="mb-4">Task Details</h3>
            <div className="row gx-3 gy-2">
              {Object.entries(taskDetails).map(([key, value]) => (
                <div className="col-6 col-md-4 col-lg-3" key={key}>
                  <div className="d-flex flex-column">
                    <small className="text-muted text-uppercase">
                      {key.replace(/([A-Z])/g, " $1")}
                    </small>

                    {key === "status" ? (
                      <span className={`${getStatusBadge(value)} mt-1`} style={{ width: "fit-content" }}>
                        {value}
                      </span>
                    ) : key === "priority" ? (
                      <span className={`${getPriorityBadge(value)} mt-1`} style={{ width: "fit-content" }}>
                        {value}
                      </span>
                    ) : key.toLowerCase().includes("date") ? (
                      <span className="fw-semibold mt-1">{formatDate(value)}</span>
                    ) : (
                      <span className="fw-semibold mt-1">{value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assigned & Customer */}
          <div className="row mb-4">
            {/* Assigned To */}
            <div className="col-md-6">
              <div className="card shadow-sm p-3 mb-4">
                <h4 className="mb-3">Assigned To</h4>
                <div className="d-flex align-items-start">
                  <img
                    src={assignedTo.photo}
                    alt={assignedTo.name}
                    className="me-3"
                    width={64}
                    height={64}
                    style={{ borderRadius: "8px" }}
                  />
                  <div>
                    <h5 className="mb-1">{assignedTo.name}</h5>
                    <p className="text-muted mb-1">{assignedTo.role}</p>
                    <p className="mb-0">
                      <i className="ti ti-phone me-2"></i> {assignedTo.phone}
                    </p>
                    <p className="mb-0">
                      <i className="ti ti-mail me-2"></i> {assignedTo.email}
                    </p>
                    <p className="mb-0 text-muted">
                      Assigned On: {assignedTo.assignedDate}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="col-md-6">
              <div className="card shadow-sm p-3 mb-4">
                <h4 className="mb-3">Customer Details</h4>
                <div className="d-flex align-items-start">
                  <img
                    src={customerDetails.photo}
                    alt={customerDetails.company}
                    className="me-3"
                    width={64}
                    height={64}
                    style={{ borderRadius: "8px" }}
                  />
                  <div>
                    <h5 className="mb-1">{customerDetails.company}</h5>
                    <p className="mb-0">
                      <i className="ti ti-phone me-2"></i> {customerDetails.phone}
                    </p>
                    <p className="mb-0">
                      <i className="ti ti-mail me-2"></i> {customerDetails.email}
                    </p>
                    <p className="mb-0">
                      <i className="ti ti-map-pin me-2"></i> Address: {customerDetails.primaryContact}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailsTask;
