import React, { useEffect } from "react";
import BreadCrumb from "../../components/BreadCrumb";

const tatEffectedData = {
  taskDetails: {
    id: "#T12345",
    taskName: "Client Portal Update",
    category: "Development",
    assignmentTAT: "Apr 20 - Apr 28, 2024",
    responseTAT: "4 hours",
    resolutionTAT: "2 days",
    status: "Delayed",
    priority: "High",
    delayReason: "Resource unavailable",
   
    createdDate: "Apr 15, 2024 08:00 AM",
    assignedDate: "Apr 15, 2024 09:00 AM",
    completedDate: "Apr 28, 2024 04:00 PM",
  },
  assignedTo: {
    name: "John Doe",
    role: "Senior Developer",
    team: "Frontend Team",
    phone: "+1 234 567 8900",
    email: "john.doe@example.com",
    photo: "https://randomuser.me/api/portraits/men/75.jpg",
  },
  activityLog: [
    { date: "Apr 15, 2024 08:00 AM", activity: "Task created." },
    { date: "Apr 15, 2024 09:00 AM", activity: "Task assigned by John Doe." },
    {
      date: "Apr 20, 2024 08:30 AM",
      activity: "Task started.",
      badge: "bg-primary",
      badgeText: "Started",
    },
    {
      date: "Apr 22, 2024 03:00 PM",
      activity: "Response delayed.",
      badge: "bg-danger",
      badgeText: "Delayed",
    },
    {
      date: "Apr 28, 2024 04:00 PM",
      activity: "Task completed.",
      badge: "bg-success",
      badgeText: "Completed",
    },
  ],
};

const TATEffectedDetails = () => {
  const { taskDetails, assignedTo, activityLog } = tatEffectedData;

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
      <BreadCrumb
        subLabel="Tasks"
        pageTitle="TAT Effected Details"
        subUrl="/tasks/tat-effected"
      />

      <div className="row">
        <div className="col-sm-12">
          <div
            className="fade-section opacity-0 transition card shadow-sm p-4 mb-4"
          >
            <h3 className="mb-3">TAT Details</h3>
            <div className="row mb-3">
              <div className="col-md-6">
                <p><strong>Task ID:</strong> {taskDetails.id}</p>
                <p><strong>Task Name:</strong> {taskDetails.taskName}</p>
                <p><strong>Category:</strong> {taskDetails.category}</p>
                <p><strong>Status:</strong> {taskDetails.status}</p>
                <p><strong>Priority:</strong> {taskDetails.priority}</p>
                <p><strong>Delay Reason:</strong> {taskDetails.delayReason}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Assignment TAT:</strong> {taskDetails.assignmentTAT}</p>
                <p><strong>Response TAT:</strong> {taskDetails.responseTAT}</p>
                <p><strong>Resolution TAT:</strong> {taskDetails.resolutionTAT}</p>
                <p><strong>Created Date:</strong> {taskDetails.createdDate}</p>
                <p><strong>Assigned Date:</strong> {taskDetails.assignedDate}</p>
                <p><strong>Completed Date:</strong> {taskDetails.completedDate}</p>
              </div>
            </div>
            {/* <p><strong>Description:</strong> {taskDetails.description}</p> */}

            <hr />

            <h3 className="mb-3">Assigned by</h3>
            <div className="d-flex align-items-center mb-4">
              <img
                src={assignedTo.photo}
                alt={assignedTo.name}
                className="rounded-circle me-3"
                width={64}
                height={64}
              />
              <div>
                <h4 className="mb-1">{assignedTo.name}</h4>
                <p className="mb-1 text-muted">{assignedTo.role}</p>
                <p className="mb-0"><i className="ti ti-phone me-2"></i> {assignedTo.phone}</p>
                <p className="mb-0"><i className="ti ti-mail me-2"></i> {assignedTo.email}</p>
              </div>
            </div>

            <hr />

            <h3 className="mb-3">Activity Log</h3>
            <div style={{ maxHeight: "300px", overflowY: "auto" }}>
              <ul className="timeline">
                {activityLog.map((log, index) => (
                  <li key={index}>
                    <div className="timeline-time">{log.date}</div>
                    <div className="timeline-content">
                      {log.badge ? (
                        <>
                          {log.activity.replace(/:.*$/, "")}:
                          <span className={`badge ${log.badge} ms-1`}>{log.badgeText}</span>
                        </>
                      ) : log.activity}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .timeline {
          list-style: none;
          padding-left: 0;
          position: relative;
          margin-left: 20px;
          border-left: 3px solid #0d6efd;
        }
        .timeline li {
          position: relative;
          margin-bottom: 20px;
          padding-left: 20px;
        }
        .timeline li::before {
          content: "";
          position: absolute;
          left: -11px;
          top: 5px;
          width: 15px;
          height: 15px;
          background-color: #0d6efd;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 0 0 2px #0d6efd;
        }
        .timeline-time {
          font-size: 0.85rem;
          color: #6c757d;
          margin-bottom: 4px;
        }
        .timeline-content {
          font-size: 1rem;
        }
      `}</style>
    </>
  );
};

export default TATEffectedDetails;
