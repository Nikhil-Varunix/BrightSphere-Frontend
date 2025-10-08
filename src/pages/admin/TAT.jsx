// AdminTimeSetupPage.jsx
import React, { useState } from "react";
import toast from "react-hot-toast";
import BreadCrumb from "../../components/BreadCrumb";

const AdminTimeSetupPage = ({ onSetupComplete }) => {
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });

  const [tats, setTats] = useState([
    { id: 1, service: "Installation", tat: "02:00", status: "Active" },
    { id: 2, service: "Repair", tat: "03:30", status: "Active" },
  ]);

  const [newTat, setNewTat] = useState({ service: "", tat: "" });
  const [editTatId, setEditTatId] = useState(null);

  // Sort icons
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

  // Helper: Convert input time to HH:mm
  const parseTime = (timeStr) => {
    if (!timeStr) return "";
    const match = timeStr.match(/(\d{1,2}):(\d{2})/);
    if (!match) return "";
    let [_, h, m] = match;
    h = parseInt(h, 10);
    m = parseInt(m, 10);
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  };

  // Helper: Display as Xh Ymin
  const formatTAT = (tat) => {
    if (!tat) return "";
    const [hours, minutes] = tat.split(":").map(Number);
    let result = "";
    if (hours) result += `${hours}h `;
    if (minutes) result += `${minutes}min`;
    return result.trim();
  };

  // Add or Update TAT
  const handleAddTat = () => {
    if (!newTat.service || !newTat.tat) {
      toast.error("Service & TAT required");
      return;
    }

    const parsedTat = parseTime(newTat.tat);

    if (editTatId) {
      setTats(tats.map((t) => (t.id === editTatId ? { ...t, ...newTat, tat: parsedTat } : t)));
      setEditTatId(null);
      toast.success("TAT updated");
    } else {
      setTats([...tats, { id: Date.now(), ...newTat, tat: parsedTat, status: "Active" }]);
      toast.success("TAT added");
    }

    setNewTat({ service: "", tat: "" });
  };

  // Edit TAT (no AM/PM)
  const handleEditTat = (tat) => {
    setNewTat({ service: tat.service, tat: tat.tat });
    setEditTatId(tat.id);
  };

  const handleDeleteTat = (id) => {
    setTats(tats.filter((t) => t.id !== id));
    toast.success("TAT deleted");
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <BreadCrumb subLabel="Admin" pageTitle="TAT" subUrl="/TAT" />
      </div>

      <div className="container mt-4">
        {/* <h3>TAT</h3> */}

        <div className="card my-3">
          <div className="card-body">
            <div className="d-flex justify-content-start align-items-center gap-2 mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Service"
                style={{ width: "200px" }}
                value={newTat.service}
                onChange={(e) => setNewTat((prev) => ({ ...prev, service: e.target.value }))}
              />
              <input
                type="text"
                className="form-control"
                style={{ width: "150px" }}
                placeholder="e.g. 02:30"
                value={newTat.tat}
                onChange={(e) => setNewTat((prev) => ({ ...prev, tat: e.target.value }))}
              />
              <button className="btn btn-primary" onClick={handleAddTat}>
                <i className={`bi ${editTatId ? "bi-pencil-square" : "bi-plus-circle"} me-1`} />
                {editTatId ? "Update TAT" : "Add TAT"}
              </button>
            </div>

            <table className="table table-bordered text-center">
              <thead>
                <tr>
                  <th>S.No {renderSortIcons("sno")}</th>
                  <th>Service {renderSortIcons("service")}</th>
                  <th>TAT {renderSortIcons("tat")}</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tats.length > 0 ? (
                  tats.map((tat, idx) => (
                    <tr key={tat.id}>
                      <td>{idx + 1}</td>
                      <td>{tat.service}</td>
                      <td>{formatTAT(tat.tat)}</td>
                      <td>
                        <ul className="list-inline m-0">
                          <li className="list-inline-item">
                            <span
                              title="Edit"
                              onClick={() => handleEditTat(tat)}
                              className="avtar avtar-s btn-light-warning mx-1"
                            >
                              <i className="ti ti-pencil f-18" />
                            </span>
                          </li>
                          <li className="list-inline-item cursor-pointer">
                            <span
                              title="Delete"
                              onClick={() => handleDeleteTat(tat.id)}
                              className="avtar avtar-s  btn-light-danger mx-1"
                            >
                              <i className="ti ti-trash f-18" />
                            </span>
                          </li>
                        </ul>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center text-muted">
                      No TAT entries
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminTimeSetupPage;
