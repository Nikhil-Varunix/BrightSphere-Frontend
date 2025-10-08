import BreadCrumb from "../../components/BreadCrumb";
import toast from "react-hot-toast";
import { useState } from "react";
import UpdateOfficeTimingModal from "./components/UpdateOfficeTimingModal";
import AddShiftModal from "./components/AddShiftModal"; // ✅ NEW IMPORT

// Helper: Convert 24-hour → 12-hour format
const formatTime = (time24) => {
  if (!time24) return "";
  const [hourStr, minute] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${ampm}`;
};

const OfficeTimingsAndHolidays = () => {
  // ✅ Office Timings State
  const [officeTimings, setOfficeTimings] = useState([
    {
      shift: "First Shift",
      startTime: "09:30",
      endTime: "18:30",
      lunchStart: "13:00",
      lunchEnd: "13:30",
      firstBreak: "11:15 to 11:30 AM",
      secondBreak: "16:15 to 16:30 PM",
    },
    {
      shift: "Second Shift",
      startTime: "18:30",
      endTime: "03:30",
      lunchStart: "21:30",
      lunchEnd: "22:00",
      firstBreak: "19:45 to 20:00 PM",
      secondBreak: "01:15 to 01:30 AM",
    },
  ]);

  const [showTimingModal, setShowTimingModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  // ✅ Add Shift Modal
  const [showAddShiftModal, setShowAddShiftModal] = useState(false);

  // Sorting state
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  // Holidays State
  const [holidays, setHolidays] = useState([
    { id: "H001", name: "Independence Day", date: "2025-08-15" },
    { id: "H002", name: "New Year", date: "2026-01-01" },
  ]);
  const [newHoliday, setNewHoliday] = useState({ name: "", date: "" });
  const [editingHoliday, setEditingHoliday] = useState(null);

  // Generate Holiday IDs
  const createNextHolidayId = () => {
    const maxNum =
      Math.max(
        0,
        ...holidays.map((h) => parseInt(h.id.replace(/\D/g, ""), 10))
      ) || 0;
    return "H" + String(maxNum + 1).padStart(3, "0");
  };

  // Save or Update Holiday
  const handleSaveHoliday = () => {
    if (!newHoliday.name || !newHoliday.date) {
      toast.error("Please fill holiday name and date");
      return;
    }
    if (editingHoliday) {
      setHolidays((prev) =>
        prev.map((h) =>
          h.id === editingHoliday.id ? { ...h, ...newHoliday } : h
        )
      );
      toast.success("Holiday updated successfully");
    } else {
      setHolidays((prev) => [
        ...prev,
        { id: createNextHolidayId(), ...newHoliday },
      ]);
      toast.success("Holiday added successfully");
    }
    setNewHoliday({ name: "", date: "" });
    setEditingHoliday(null);
  };

  const handleEditHoliday = (holiday) => {
    setEditingHoliday(holiday);
    setNewHoliday({ name: holiday.name, date: holiday.date });
  };

  const handleDeleteHoliday = (id) => {
    if (window.confirm("Are you sure you want to delete this holiday?")) {
      setHolidays((prev) => prev.filter((h) => h.id !== id));
      toast.success("Holiday deleted successfully");
    }
  };

  // Update Office Timing from Modal
  const handleUpdateTiming = (updatedTiming) => {
    setOfficeTimings((prev) =>
      prev.map((t, idx) => (idx === editIndex ? updatedTiming : t))
    );
  };

  // Add new Shift from Modal
  const handleAddShift = (newShift) => {
    setOfficeTimings((prev) => [...prev, newShift]);
  };

  // Calculate total working hours (excluding lunch)
  const calculateTotalHours = (timings) => {
    const toMinutes = (time) => {
      const [hour, minute] = time.split(":").map(Number);
      return hour * 60 + minute;
    };

    let start = toMinutes(timings.startTime);
    let end = toMinutes(timings.endTime);
    if (end <= start) end += 24 * 60; // handle overnight shifts

    const lunchStart = toMinutes(timings.lunchStart);
    const lunchEnd = toMinutes(timings.lunchEnd);

    const totalMinutes = end - start - (lunchEnd - lunchStart);

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  // Sort helper
  const sortedHolidays = [...holidays].sort((a, b) => {
    if (!sortConfig.key) return 0;

    let valA, valB;
    if (sortConfig.key === "holidayName") {
      valA = a.name.toLowerCase();
      valB = b.name.toLowerCase();
    } else if (sortConfig.key === "date") {
      valA = a.date;
      valB = b.date;
    } else {
      return 0;
    }

    if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
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
          color:
            sortConfig.key === key && sortConfig.direction === "asc"
              ? "#000"
              : "#ccc",
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
          color:
            sortConfig.key === key && sortConfig.direction === "desc"
              ? "#000"
              : "#ccc",
        }}
        onClick={() => setSortConfig({ key, direction: "desc" })}
      >
        ▼
      </span>
    </span>
  );

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <BreadCrumb subLabel="Admin" pageTitle="Shifts & Timings" />
        <div className="d-flex align-items-start gap-2 flex-wrap">
          <button
            className="btn btn-primary"
            onClick={() => setShowAddShiftModal(true)} // ✅ OPEN ADD SHIFT MODAL
          >
            <i className="ti ti-plus me-1"></i> Add Shift
          </button>
        </div>
      </div>

      {/* Office Timings */}
      <div className="card mb-4">
        <div className="card-body">
          
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>S.No {renderSortIcons("sno")}</th>
                  <th>Shift {renderSortIcons("shift")}</th>
                  <th>Start Time {renderSortIcons("startTime")}</th>
                  <th>End Time {renderSortIcons("endTime")}</th>
                  <th>Lunch Start {renderSortIcons("lunchStart")}</th>
                  <th>Lunch End {renderSortIcons("lunchEnd")}</th>
                  <th>First Break {renderSortIcons("firstBreak")}</th>
                  <th>Second Break {renderSortIcons("secondBreak")}</th>
                  <th>Total Hours {renderSortIcons("totalHours")}</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {officeTimings.map((timing, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{timing.shift}</td>
                    <td>{formatTime(timing.startTime)}</td>
                    <td>{formatTime(timing.endTime)}</td>
                    <td>{formatTime(timing.lunchStart)}</td>
                    <td>{formatTime(timing.lunchEnd)}</td>
                    <td>{timing.firstBreak}</td>
                    <td>{timing.secondBreak}</td>
                    <td>{calculateTotalHours(timing)}</td>
                    <td>
                      <button
                        title="Edit"
                        onClick={() => {
                          setEditIndex(index);
                          setShowTimingModal(true);
                        }}
                        className="avtar avtar-s btn-light-warning mx-1"
                      >
                        <i className="ti ti-pencil f-18" />
                      </button>
                    </td>
                  </tr>
                ))}
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
                  >
                    ‹
                  </button>
                </li>
                <li className="datatable-pagination-list-item datatable-active">
                  <button
                    data-page={1}
                    className="datatable-pagination-list-item-link"
                  >
                    1
                  </button>
                </li>
                <li className="datatable-pagination-list-item">
                  <button
                    data-page={2}
                    className="datatable-pagination-list-item-link"
                  >
                    2
                  </button>
                </li>
                <li className="datatable-pagination-list-item">
                  <button
                    data-page={2}
                    className="datatable-pagination-list-item-link"
                  >
                    ›
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* Update Modal */}
      {showTimingModal && (
        <UpdateOfficeTimingModal
          show={showTimingModal}
          handleClose={() => setShowTimingModal(false)}
          timing={officeTimings[editIndex]}
          onUpdate={handleUpdateTiming}
        />
      )}

      {/* Add Shift Modal */}
      {showAddShiftModal && (
        <AddShiftModal
          show={showAddShiftModal}
          handleClose={() => setShowAddShiftModal(false)}
          onSave={handleAddShift}
        />
      )}
    </>
  );
};

export default OfficeTimingsAndHolidays;


// // AdminTimeSetupPage.jsx
// import React, { useState } from "react";
// import toast from "react-hot-toast";
// import BreadCrumb from "../../components/BreadCrumb";

// const AdminTimeSetupPage = ({ onSetupComplete }) => {
//     const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
//   // ✅ Default data
//   const [slots, setSlots] = useState([
    
//     { id: 1, name: "First Shift", start: "09:30", end: "18:30" }, // fixed time format
//     { id: 2, name: "Second Shift", start: "18:30", end: "03:30" },
//   ]);

//   const [tats, setTats] = useState([
//     { id: 1, service: "Installation", tat: "02:00", status: "Active" },
//     { id: 2, service: "Repair", tat: "04:00", status: "Active" },
//   ]);

//   const [newSlot, setNewSlot] = useState({ name: "", start: "", end: "" });
//   const [newTat, setNewTat] = useState({ service: "", tat: "" });

//   const [editSlotId, setEditSlotId] = useState(null);
//   const [editTatId, setEditTatId] = useState(null);

//   // ✅ Add or Update Slot
//   const handleAddSlot = () => {
//     if (!newSlot.name || !newSlot.start || !newSlot.end) {
//       toast.error("Slot Name, Start & End time required");
//       return;
//     }

//     if (editSlotId) {
//       setSlots(slots.map((s) => (s.id === editSlotId ? { ...s, ...newSlot } : s)));
//       setEditSlotId(null);
//       toast.success("Slot updated");
//     } else {
//       setSlots([...slots, { id: Date.now(), ...newSlot }]);
//       toast.success("Slot added");
//     }

//     setNewSlot({ name: "", start: "", end: "" });
//   };

//   // ✅ Delete Slot
//   const handleDeleteSlot = (id) => {
//     setSlots(slots.filter((s) => s.id !== id));
//     toast.success("Slot deleted");
//   };

//   // ✅ Edit Slot
//   const handleEditSlot = (slot) => {
//     setNewSlot({ name: slot.name, start: slot.start, end: slot.end });
//     setEditSlotId(slot.id);
//   };

//   // ✅ Add or Update TAT
//   const handleAddTat = () => {
//     if (!newTat.service || !newTat.tat) {
//       toast.error("Service & TAT required");
//       return;
//     }

//     if (editTatId) {
//       setTats(tats.map((t) => (t.id === editTatId ? { ...t, ...newTat } : t)));
//       setEditTatId(null);
//       toast.success("TAT updated");
//     } else {
//       setTats([...tats, { id: Date.now(), ...newTat, status: "Active" }]);
//       toast.success("TAT added");
//     }

//     setNewTat({ service: "", tat: "" });
//   };

//   // ✅ Delete TAT
//   const handleDeleteTat = (id) => {
//     setTats(tats.filter((t) => t.id !== id));
//     toast.success("TAT deleted");
//   };

//   // ✅ Edit TAT
//   const handleEditTat = (tat) => {
//     setNewTat({ service: tat.service, tat: tat.tat });
//     setEditTatId(tat.id);
//   };


//    const renderSortIcons = (key) => (
//     <span
//       style={{
//         display: "inline-flex",
//         flexDirection: "column",
//         marginLeft: "5px",
//         verticalAlign: "middle",
//       }}
//     >
//       <span
//         style={{
//           cursor: "pointer",
//           fontSize: "10px",
//           lineHeight: "12px",
//           color:
//             sortConfig.key === key && sortConfig.direction === "asc"
//               ? "#000"
//               : "#ccc",
//         }}
//         onClick={() => setSortConfig({ key, direction: "asc" })}
//       >
//         ▲
//       </span>
//       <span
//         style={{
//           cursor: "pointer",
//           fontSize: "10px",
//           lineHeight: "10px",
//           color:
//             sortConfig.key === key && sortConfig.direction === "desc"
//               ? "#000"
//               : "#ccc",
//         }}
//         onClick={() => setSortConfig({ key, direction: "desc" })}
//       >
//         ▼
//       </span>
//     </span>
//   );
//   return (
//     <>
//     <div className="d-flex justify-content-between align-items-center">
//         <BreadCrumb subLabel="Admin" pageTitle="Shift/Time" subUrl="/ShiftTime" />
//       </div>

//     <div className="container mt-4">
//       {/* <h3>Working Shifts & Timings</h3>  */}

//       {/* Time Slot Setup */}
//       <div className="card my-3">
//         <div className="card-body">
//           {/* Add Slot Form */}
//           <div className="d-flex justify-content-end align-items-center gap-2 mb-3">
//             <input
//               type="text"
//               className="form-control"
//               placeholder="Slot Name (Morning, Evening...)"
//               style={{ width: "200px" }}
//               value={newSlot.name}
//               onChange={(e) => setNewSlot((prev) => ({ ...prev, name: e.target.value }))}
//             />
//             <input
//               type="time"
//               className="form-control"
//               style={{ width: "150px" }}
//               value={newSlot.start}
//               onChange={(e) => setNewSlot((prev) => ({ ...prev, start: e.target.value }))}
//             />
//             <input
//               type="time"
//               className="form-control"
//               style={{ width: "150px" }}
//               value={newSlot.end}
//               onChange={(e) => setNewSlot((prev) => ({ ...prev, end: e.target.value }))}
//             />
//             <button className="btn btn-primary" onClick={handleAddSlot}>
//               <i className={`bi ${editSlotId ? "bi-pencil-square" : "bi-plus-circle"} me-1`} />
//               {editSlotId ? "Update Slot" : "Add Slot"}
//             </button>
//           </div>

//           {/* Table for Slots */}
//           <div className="table-responsive">
//             <table className="table table-bordered table-hover">
//               <thead className="table-light">
//                 <tr>
//   <th>S.No {renderSortIcons("sno")}</th>
//   <th>Shift {renderSortIcons("shift")}</th>
//   <th>Start Time {renderSortIcons("startTime")}</th>
//   <th>End Time {renderSortIcons("endTime")}</th>
//   <th>Actions</th>
// </tr>

//               </thead>
//               <tbody>
//                 {slots.length > 0 ? (
//                   slots.map((slot, index) => {
//                     const formatTime = (time) => {
//                       if (!time) return "";
//                       const [hour, minute] = time.split(":");
//                       let h = parseInt(hour, 10);
//                       const ampm = h >= 12 ? "PM" : "AM";
//                       h = h % 12 || 12;
//                       return `${h}:${minute} ${ampm}`;
//                     };

//                     return (
//                       <tr key={slot.id}>
//                         <td>{index + 1}</td>
//                         <td>{slot.name}</td>
//                         <td>{formatTime(slot.start)}</td>
//                         <td>{formatTime(slot.end)}</td>
//                         <td>
//                           <ul className="list-inline m-0">
//                             <li className="list-inline-item">
//                               <span
//                                 title="Edit"
//                                 onClick={() => handleEditSlot(slot)}
//                                 className="avtar avtar-s btn-link-success mx-1"
//                               >
//                                 <i className="ti ti-pencil f-18" />
//                               </span>
//                             </li>
//                             <li className="list-inline-item cursor-pointer">
//                               <span
//                                 title="Delete"
//                                 onClick={() => handleDeleteSlot(slot.id)}
//                                 className="avtar avtar-s btn-link-secondary mx-1"
//                               >
//                                <i className="ti ti-trash f-18" />
//                               </span>
//                             </li>
//                           </ul>
//                         </td>
//                       </tr>
//                     );
//                   })
//                 ) : (
//                   <tr>
//                     <td colSpan="5" className="text-center text-muted">
//                       No slots defined yet
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//     </>
//   );
// };

// export default AdminTimeSetupPage;
