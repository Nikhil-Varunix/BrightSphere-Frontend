import BreadCrumb from '../../components/BreadCrumb';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import UpdateExpenseModal from "./components/UpdateExpenseModal";
import CreateExpenseModal from "./components/CreateExpenseModal";

const dummyExpenses = [
  {
    id: 1,
    expenseNumber: '1',
    employeeName: 'John Doe',
    title: 'Mouse',
    category: 'Office',
    amount: 1250,
    currency: '₹',
    paymentStatus: 'Pending',
    expenseType: 'Reimbursable',
    dateIncurred: '2025-07-15',
    dateRequest: '2025-07-10',
    reimbursedDate: '2025-07-20',
    location: 'Hyderabad',
    notes: 'Monthly office rent for July',
    media: [
      '/media/invoice1.jpg',
      '/media/receipt1.pdf'
    ],
    shortDesc: 'Office rent for July 2025',
  },
];

const Expenses = () => {
  const [expenses, setExpenses] = useState(dummyExpenses);
  const [editExpense, setEditExpense] = useState(null);
  const [previewExpense, setPreviewExpense] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: "expenseNumber", direction: "asc" });

  const filteredExpenses = expenses.filter(exp => {
    return (
      exp.expenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getDate().toString().padStart(2,'0')}/${(date.getMonth()+1).toString().padStart(2,'0')}/${date.getFullYear()}`;
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this expense?");
    if (confirmed) {
      setExpenses(prev => prev.filter(exp => exp.id !== id));
      toast.success("Expense deleted successfully");
    }
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
      >▲</span>
      <span
        style={{
          cursor: "pointer",
          fontSize: "10px",
          lineHeight: "10px",
          color: sortConfig.key === key && sortConfig.direction === "desc" ? "#000" : "#ccc",
        }}
        onClick={() => setSortConfig({ key, direction: "desc" })}
      >▼</span>
    </span>
  );

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <BreadCrumb pageTitle="Expenses" subLabel="Accounts" />
        <button
          className="btn d-flex align-content-center btn-primary"
          type="button"
          onClick={() => setShowCreateModal(true)}
        >
          <i className="ti ti-plus f-24 me-2"></i> Add Expenses
        </button>
      </div>

      <div className="row mt-3">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              {/* Filters */}
              <div className="row mb-3 g-3 align-items-center">
                <div className="col-md-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by employee or expense"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Table */}
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th>S.No {renderSortIcons("expenseNumber")}</th>
                      <th>Employee {renderSortIcons("employeeName")}</th>
                      <th>Title {renderSortIcons("title")}</th>
                      <th>Category {renderSortIcons("category")}</th>
                      {/* <th>Type {renderSortIcons("expenseType")}</th> */}
                      <th>Amount {renderSortIcons("amount")}</th>
                      <th>Spent Date {renderSortIcons("dateIncurred")}</th>
                      <th>Requested Date {renderSortIcons("dateRequest")}</th>
                      <th>Status {renderSortIcons("paymentStatus")}</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExpenses.length ? filteredExpenses.map(exp => (
                      <tr key={exp.id}>
                        <td>{exp.expenseNumber}</td>
                        <td className="fw-bold">{exp.employeeName}</td>
                        <td>{exp.title}</td>
                        <td>{exp.category}</td>
                        {/* <td>{exp.expenseType}</td> */}
                        <td>{exp.amount.toLocaleString("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 })}</td>
                        <td>{formatDate(exp.dateIncurred)}</td>
                        <td>{formatDate(exp.dateRequest)}</td>
                        <td>
                          <span className={`badge  ${exp.paymentStatus === 'Closed' ? 'bglight-success' : exp.paymentStatus === 'Pending' ? 'bg-light-warning text-dark' : 'bg-light-danger'}`}>
                            {exp.paymentStatus}
                          </span>
                          
                        </td>
                        <td>
                          <ul className="list-inline mb-0 align-items-center">
                            <li className="list-inline-item m-0">
                              <span
                                className="avtar avtar-s btn-light-primary mx-1 cursor-pointer"
                                title="View"
                                onClick={() => setPreviewExpense(exp)}
                              >
                                <i className="ti ti-eye f-18" />
                              </span>
                            </li>
                            <li className="list-inline-item m-0">
                              <span
                                className="avtar avtar-s btn-light-warning mx-1 cursor-pointer"
                                title="Edit"
                                onClick={() => setEditExpense(exp)}
                              >
                                <i className="ti ti-pencil f-18" />
                              </span>
                            </li>
                            <li className="list-inline-item cursor-pointer m-0">
                              <span
                                className="avtar avtar-s btn-light-danger mx-1"
                                onClick={() => handleDelete(exp.id)}
                                title="Delete"
                              >
                                <i className="ti ti-trash f-18" />
                              </span>
                            </li>
                          </ul>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="10" className="text-center">No expenses found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Modals */}
              <UpdateExpenseModal
                show={!!editExpense}
                expense={editExpense}
                onClose={() => setEditExpense(null)}
                onUpdate={(updatedExpense) => {
                  setExpenses((prev) => prev.map((exp) => (exp.id === updatedExpense.id ? updatedExpense : exp)));
                }}
              />

              <CreateExpenseModal
                show={showCreateModal}
                handleClose={() => setShowCreateModal(false)}
                fetchExpenses={() => toast.success("Refresh your list after adding new expense")}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Expense Preview Drawer */}
      {previewExpense && (
        <>
          <div
            className="offcanvas-backdrop fade show"
            style={{ zIndex: 1040 }}
            onClick={() => setPreviewExpense(null)}
          ></div>

          <div
            className={`offcanvas offcanvas-end show`}
            style={{
              visibility: previewExpense ? "visible" : "hidden",
              width: "400px",
              zIndex: 1050,
            }}
            tabIndex="-1"
            id="previewExpensePanel"
          >
            <div className="offcanvas-header border-bottom">
              <h5 className="mb-0 fw-bold">Expense Details</h5>
              <button
                type="button"
                className="btn-close text-reset"
                onClick={() => setPreviewExpense(null)}
              ></button>
            </div>
            <div className="offcanvas-body">
              <div className="p-2">
                <div className="card border shadow-sm mb-4">
                  <div className="card-body d-flex align-items-center">
                    <div
                      className="avtar bg-light-primary rounded-circle me-3 d-flex justify-content-center align-items-center"
                      style={{ width: "50px", height: "50px" }}
                    >
                      <i className="ti ti-user f-24 text-primary"></i>
                    </div>
                    <div>
                      <h6 className="mb-1 fw-bold">{previewExpense.employeeName}</h6>
                      <small className="text-muted">{previewExpense.shortDesc}</small>
                    </div>
                  </div>
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between align-items-center border rounded mb-2 shadow-sm">
                    <span>Category</span>
                    <span className="fw-bold">{previewExpense.category}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center border rounded mb-2 shadow-sm">
                    <span>Type</span>
                    <span className="fw-bold">{previewExpense.expenseType}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center border rounded mb-2 shadow-sm">
                    <span>Amount</span>
                    <span className="fw-bold">{previewExpense.amount.toLocaleString("en-IN", { style: "currency", currency: "INR" })}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center border rounded mb-2 shadow-sm">
                    <span>Date Incurred</span>
                    <span className="fw-bold">{formatDate(previewExpense.dateIncurred)}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center border rounded mb-2 shadow-sm">
                    <span>Requested Date</span>
                    <span className="fw-bold">{formatDate(previewExpense.dateRequest)}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center border rounded mb-2 shadow-sm">
                    <span>Payment Status</span>
                    <span className={`badge rounded-pill px-3 py-2 ${previewExpense.paymentStatus === "Paid" ? "bg-success" : previewExpense.paymentStatus === "Pending" ? "bg-warning text-dark" : "bg-danger"}`}>{previewExpense.paymentStatus}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center border rounded mb-2 shadow-sm">
                    <span>Location</span>
                    <span className="fw-bold">{previewExpense.location}</span>
                  </li>
                  <li className="list-group-item border rounded mb-2 shadow-sm">
                    <span>Notes: </span> {previewExpense.notes || "N/A"}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Expenses;
