// Payroll.jsx

import BreadCrumb from '../../components/BreadCrumb';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import CreatePayrollModal from "./components/CreatePayrollModal";
import UpdatePayrollModal from "./components/UpdatePayrollModal"; // import update modal

const dummyPayrolls = [
  {
    id: 2,
    payrollId: '2',
    payDate: '2025-07-31',
    employeeName: 'Jane Doe',
    employeeRole: 'Manager',
    basicSalary: 40000,
    overtimeHours: 5,
    overtimePay: 1000,
    allowances: 2000,
    deductions: 1500,
    grossSalary: 41000,
    netPay: 41500,
    currency: '₹',
    paymentStatus: 'Paid',
    paymentType: 'Cash',
    nextPayDate: '2025-08-31',
  },
];

const Payroll = () => {
  const [sortConfig, setSortConfig] = useState({ key: "sno", direction: "asc" });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState(null);

  const filteredPayrolls = dummyPayrolls.filter(pay => {
    const matchesSearch =
      pay.payrollId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pay.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus ? pay.paymentStatus === filterStatus : true;
    const matchesType = filterType ? pay.paymentType === filterType : true;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this payroll record?")) {
      toast.success("Payroll deleted successfully");
      // here you can also remove from state if integrated with backend
    }
  };

  const handleEdit = (pay) => {
    setSelectedPayroll(pay);
    setShowUpdateModal(true);
  };

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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <BreadCrumb pageTitle="Payroll" subLabel="Accounts" />
        <button
          className="btn d-flex align-content-center btn-primary mt-3"
          onClick={() => setShowCreateModal(true)} // open create modal
        >
          <i className="ti ti-plus f-24"></i> Create Payroll
        </button>
      </div>

      {/* Create Payroll Modal */}
      <CreatePayrollModal
        show={showCreateModal}
        handleClose={() => setShowCreateModal(false)}
      />

      {/* Update Payroll Modal */}
      <UpdatePayrollModal
        show={showUpdateModal}
        handleClose={() => setShowUpdateModal(false)}
        payroll={selectedPayroll}
      />

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              {/* Filters */}
              <div className="row mb-3 g-3 align-items-center">
                <div className="col-md-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by employee, payment type, or status"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th>S.No {renderSortIcons("sno")}</th>
                      <th>Employee {renderSortIcons("employee")}</th>
                      <th>Salary {renderSortIcons("basicSalary")}</th>
                      <th>Overtime Hrs {renderSortIcons("overtimeHrs")}</th>
                      <th>Overtime Pay {renderSortIcons("overtimePay")}</th>
                      <th>Total {renderSortIcons("grossSalary")}</th>
                      <th>Pay Date {renderSortIcons("payDate")}</th>
                      <th>Payment Method {renderSortIcons("paymentType")}</th>
                      <th>Status {renderSortIcons("status")}</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayrolls.length ? (
                      filteredPayrolls.map(pay => (
                        <tr key={pay.id}>
                          <td>{pay.payrollId}</td>
                          <td>{pay.employeeName}
                          </td>
                          <td>{pay.basicSalary.toLocaleString("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 })}</td>
                          <td>{pay.overtimeHours}</td>
                          <td>{pay.overtimePay.toLocaleString("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 })}</td>
                          <td>{pay.grossSalary.toLocaleString("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 })}</td>
                          <td>{new Date(pay.payDate).toLocaleDateString()}</td>
                          <td>{pay.paymentType}</td>
                          <td>
                            <span className={`p-1 rounded-1 bg-light-${pay.paymentStatus === 'Paid' ? 'success' : pay.paymentStatus === 'Pending' ? 'warning' : 'danger'}`}>
                              {pay.paymentStatus}
                            </span>
                          </td>
                          <td>
                            <ul className="list-inline mb-0 align-items-center">
                              {/* <li className="list-inline-item m-0">
                                <Link to={`/payroll/${pay.id}`} className="avtar avtar-s btn-light-primary mx-1" title="View">
                                  <i className="ti ti-eye f-18" />
                                </Link>
                              </li> */}
                              <li className="list-inline-item m-0">
                                <span
                                  className="avtar avtar-s btn-light-warning mx-1"
                                  title="Edit"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => handleEdit(pay)}
                                >
                                  <i className="ti ti-pencil f-18" />
                                </span>
                              </li>
                              <li className="list-inline-item m-0">
                                <span className="avtar avtar-s btn-light-danger mx-1" onClick={() => handleDelete(pay.id)} title="Delete">
                                  <i className="ti ti-trash f-18" />
                                </span>
                              </li>
                            </ul>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="15" className="text-center">No payrolls found.</td>
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
    </>
  );
};

export default Payroll;
