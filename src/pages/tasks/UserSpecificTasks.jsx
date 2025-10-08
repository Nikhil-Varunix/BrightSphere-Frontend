import BreadCrumb from "../../components/BreadCrumb";
import toast from "react-hot-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserTasks = () => {
  const navigate = useNavigate();
  

  const [tasks, setTasks] = useState([
    {
      id: "T101",
      title: "Check Electrical Wiring",
      description: "Check and repair faulty electrical wiring",
      assignedTo: "Sadika",
      role: "Technician",
      status: "Pending",
      avatar: "../assets/images/user/avatar-3.jpg",
    },
    {
      id: "T102",
      title: "Fix Plumbing Pipes",
      description: "Repair leaking pipes in the office",
      assignedTo: "Jane Smith",
      role: "Field Operations Manager",
      status: "In Progress",
      avatar: "../assets/images/user/avatar-1.jpg",
    },
    {
      id: "T103",
      title: "Service Agent",
      description: "Full office cleaning and sanitation",
      assignedTo: "William Bond",
      role: "Service Agent",
      status: "Completed",
      avatar: "../assets/images/user/avatar-2.jpg",
    },
  ]);

  const users = tasks.reduce((acc, task) => {
    if (!acc[task.assignedTo]) {
      acc[task.assignedTo] = {
        name: task.assignedTo,
        role: task.role,
        avatar: task.avatar,
        tasks: [],
      };
    }
    acc[task.assignedTo].tasks.push(task);
    return acc;
  }, {});

  const usersList = Object.values(users);

  const getTaskCounts = (userTasks) => {
    const counts = {
      total: userTasks.length,
      completed: 0,
      inProgress: 0,
      pending: 0,
      cancelled: 0,
      followUp: 0,
      outstanding: 0,
    };

    userTasks.forEach((task) => {
      switch (task.status) {
        case "Completed":
          counts.completed++;
          break;
        case "In Progress":
          counts.inProgress++;
          break;
        case "Pending":
          counts.pending++;
          break;
        case "Cancelled":
          counts.cancelled++;
          break;
        case "Follow Up":
          counts.followUp++;
          break;
        case "Outstanding":
          counts.outstanding++;
          break;
        default:
          break;
      }
    });

    return counts;
  };


  const handleNavigate = (status, user) => {
  navigate(`/tasks/user-task-history?status=${encodeURIComponent(status)}&user=${encodeURIComponent(user)}`);
};


  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <BreadCrumb subLabel="Tasks" pageTitle="User-Specific Tasks" subUrl="/usertasks" />
      </div>

      <div className="row">
        {usersList.map((user, idx) => {
          const counts = getTaskCounts(user.tasks);

          return (
            <div key={idx} className="col-md-6 col-xxl-4">
              <div className="card border shadow-none">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="chat-avtar d-inline-flex me-3">
                      <img
                        className="rounded-circle img-thumbnail img-fluid wid-80"
                        src={user.avatar}
                        alt="User"
                      />
                      <i className={`chat-badge ${counts.pending > 0 ? "bg-danger" : "bg-success"} mb-2 me-2`} />
                    </div>
                    <div>
                      <h5 className="mb-0">{user.name}</h5>
                      <p className="mb-0">
                        Role -{" "}
                        <a href="#" className="link-primary">
                          {user.role}
                        </a>
                      </p>
                    </div>
                  </div>

                  <hr />
                  <div className="">
                    {[
                      { label: "Total Tasks", value: counts.total, badge: "bg-light-primary", status: "All" },
                      { label: "Completed", value: counts.completed, badge: "bg-light-success", status: "Completed" },
                      { label: "In Progress", value: counts.inProgress, badge: "bg-light-warning text-dark", status: "In Progress" },
                      { label: "Pending", value: counts.pending, badge: "bg-light-secondary", status: "Pending" },
                      { label: "Cancelled", value: counts.cancelled, badge: "bg-light-danger", status: "Cancelled" },
                      { label: "Follow Up", value: counts.followUp, badge: "bg-light-info text-dark", status: "Follow Up" },
                      { label: "Outstanding Tasks", value: counts.outstanding, badge: "bg-light-warning text-dark", status: "Outstanding" },
                    ].map((item, i) => (
                      <div key={i} className="row mb-2">
                        <div
                          className="col-12 d-flex justify-content-between"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleNavigate(item.status, user.name)}
                        >
                          <span >{item.label}</span>
                          <span
                            className={`badge ${item.badge} d-flex align-items-center justify-content-center`}
                            style={{ width: "25px", height: "25px" }}
                          >
                            {item.value}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default UserTasks;
