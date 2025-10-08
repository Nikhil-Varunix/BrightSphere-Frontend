// LogsAttendance.jsx
//  need action types same as crud and  Logs Desc
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import BreadCrumb from '../components/BreadCrumb';
import { Link } from 'react-router-dom';

// Sample logs data
const logsData = [
  {
    id: "LOG2025-001",
    employeeId: "EMP101",
    name: "John Doe",
    action: "Check-in",
    timestamp: "2025-08-11 09:01 AM",
    source: "Biometric",
    location: "HQ Main Gate"
  },
  {
    id: "LOG2025-002",
    employeeId: "EMP102",
    name: "Jane Smith",
    action: "Check-out",
    timestamp: "2025-08-11 06:05 PM",
    source: "Mobile App",
    location: "Remote (WFH)"
  },
  {
    id: "LOG2025-003",
    employeeId: "EMP103",
    name: "Mike Lee",
    action: "Check-in",
    timestamp: "2025-08-11 08:58 AM",
    source: "Web App",
    location: "Branch Office"
  },
  {
    id: "LOG2025-004",
    employeeId: "EMP101",
    name: "John Doe",
    action: "Edited",
    timestamp: "2025-08-11 10:15 AM",
    source: "Admin Panel",
    location: "HQ Main Gate"
  },
  {
    id: "LOG2025-005",
    employeeId: "EMP104",
    name: "Anna Kim",
    action: "Check-in",
    timestamp: "2025-08-11 09:12 AM",
    source: "Biometric",
    location: "HQ Side Gate"
  }
];

const LogsAttendance = () => {
  const [logs] = useState(logsData);

  return (
    <>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center">
        <BreadCrumb subLabel="Attendance" pageTitle="Logs" subUrl="/attendance" />
        <Link
          className="btn d-flex align-content-center btn-primary mt-3"
          type="button"
          to="/attendance/logs/new"
        >
          <i className="ti ti-plus f-24"></i> Add Logs
        </Link>
      </div>

      {/* Filters */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="d-flex flex-wrap gap-3 align-items-center">
            {/* Action Type Filter */}
            <select className="form-select w-auto" defaultValue="all">
              <option value="all">All Actions</option>
              <option value="checkin">Check-in</option>
              <option value="checkout">Check-out</option>
              <option value="edited">Edited</option>
            </select>

            {/* Source Filter */}
            <select className="form-select w-auto" defaultValue="all">
              <option value="all">All Sources</option>
              <option value="biometric">Biometric</option>
              <option value="webapp">Web App</option>
              <option value="mobileapp">Mobile App</option>
              <option value="admin">Admin Panel</option>
            </select>

            {/* Date Range */}
            From: 
            <input type="date" className="form-control w-auto" />
            To:
            <input type="date" className="form-control w-auto" />

            {/* Search */}
            <input
              type="search"
              className="form-control w-auto flex-grow-1"
              placeholder="Search logs..."
            />
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body table-responsive">
              <table className="table table-hover">
                <thead className="bg-secondary-subtle">
                  <tr>
                    <th>Log ID</th>
                    {/* <th>Employee ID</th> */}
                    <th>Name</th>
                    <th>Action</th>
                    <th>Description</th>
                    <th>Time stamp</th>
                    <th>Source</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="align-middle">
                      <td>{log.id}</td>
                      {/* <td>{log.employeeId}</td> */}
                      <td className="fw-bold">{log.name}</td>
                      <td>{log.action}</td>
                      <td>{log.action}</td>
                      <td>{log.timestamp}</td>
                      <td>{log.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
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
    </>
  );
};

export default LogsAttendance;
