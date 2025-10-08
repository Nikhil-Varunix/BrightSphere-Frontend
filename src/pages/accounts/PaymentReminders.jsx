// src/pages/admin/PaymentReminders.jsx
import BreadCrumb from '../../components/BreadCrumb'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useState, useEffect } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

// ---------------- Dynamic Payment Reminders ---------------- //
const PaymentReminders = () => {
  const [previewReminder, setPreviewReminder] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "sno", direction: "asc" });
  const [reminders, setReminders] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [loading, setLoading] = useState(true)

  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [selectedReminder, setSelectedReminder] = useState(null)

  const handlePreview = (reminder) => {
  setPreviewReminder(reminder);
}
  // Simulate API fetch (replace with real API)
  useEffect(() => {
    setTimeout(() => {
      const apiData = [
        {
          id: 1,
          customer: 'John Doe',
          invoice: '1',
          amount: 12500,
          currency: '₹',
          dueDate: '2025-07-15',
          status: 'Overdue',
          lastNotification: '2025-08-28',
          nextReminder: '2025-09-01',
        },
      ]
      setReminders(apiData)
      setLoading(false)
    }, 800)
  }, [])

  // ---------------- Calculations for Cards ---------------- //
  const totalPendingAmount = reminders
    .filter(r => r.status !== "Collected")
    .reduce((sum, r) => sum + r.amount, 0)

  const overdueCount = reminders.filter(r => r.status === "Overdue").length
  const remindersSent = reminders.filter(r => r.lastNotification !== "Not Sent").length
  const collectedAmount = reminders
    .filter(r => r.status === "Collected")
    .reduce((sum, r) => sum + r.amount, 0)

  // ---------------- Filtering ---------------- //
  const filteredReminders = reminders.filter(r => {
    const matchesSearch =
      r.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.invoice.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus ? r.status === filterStatus : true
    return matchesSearch && matchesStatus
  })

  // ---------------- Delete Action ---------------- //
  const handleDelete = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this reminder?")
    if (confirmed) {
      setReminders(prev => prev.filter(r => r.id !== id))
      toast.success("Reminder deleted successfully")
    }
  }

  // ---------------- Open Update Modal ---------------- //
  const handleEdit = (reminder) => {
    setSelectedReminder(reminder)
    setShowUpdateModal(true)
  }

  // ---------------- Submit Update ---------------- //
  const handleUpdateSubmit = (values) => {
    setReminders(prev =>
      prev.map(r => r.id === selectedReminder.id ? { ...r, ...values } : r)
    )
    toast.success("Reminder updated successfully")
    setShowUpdateModal(false)
  }

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
      <div className="d-flex justify-content-between align-items-center mb-3">
        <BreadCrumb pageTitle="Payment Reminders" subLabel="Accounts" />
        {/* <button className="btn d-flex align-content-center btn-primary" type="button">
          <i className="ti ti-plus f-24 me-2"></i> Add Reminder
        </button> */}
      </div>

      <div className="row g-3">
        {/* [ Revenue / Summary Cards ] */}
        {/* <div className="col-12 col-md-3">
          <div className="card h-150">
            <div className="card-body d-flex align-items-center">
              <div className="avtar bg-light-primary">
                <i className="ti ti-currency-rupee f-24"></i>
              </div>
              <div className="ms-3 flex-grow-1">
                <p className="mb-1">Total Pending Amount</p>
                <h4 className="mb-0">₹{totalPendingAmount.toLocaleString("en-IN")}</h4>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-3">
          <div className="card h-150">
            <div className="card-body d-flex align-items-center">
              <div className="avtar bg-light-danger">
                <i className="ti ti-alert-circle f-24"></i>
              </div>
              <div className="ms-3 flex-grow-1">
                <p className="mb-1">Overdue Payments</p>
                <h4 className="mb-0">{overdueCount} Invoices</h4>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-3">
          <div className="card h-150">
            <div className="card-body d-flex align-items-center">
              <div className="avtar bg-light-warning">
                <i className="ti ti-bell f-24"></i>
              </div>
              <div className="ms-3 flex-grow-1">
                <p className="mb-1">Reminders</p>
                <h4 className="mb-0">{remindersSent}</h4>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-3">
          <div className="card h-0">
            <div className="card-body d-flex align-items-center">
              <div className="avtar bg-light-success">
                <i className="ti ti-check f-24"></i>
              </div>
              <div className="ms-3 flex-grow-1">
                <p className="mb-1">Collected via Reminders</p>
                <h4 className="mb-0">₹{collectedAmount.toLocaleString("en-IN")}</h4>
              </div>
            </div>
          </div>
        </div> */}

        {/* [ Reminders Table ] */}
        <div className="col-12 mt-4">
          <div className="card">
            <div className="card-body">
              {/* Filters */}
              <div className="row mb-3 g-3 align-items-center">
                <div className="col-md-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by customer, invoice, or status"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Table */}
              <div className="table-responsive">
                <table className="table table-hover align-middle text-nowrap">
                  <thead className="table-light">
                    <tr>
                      <th>S.No {renderSortIcons("sno")}</th>
                      <th>Client/Vendor {renderSortIcons("clientVendor")}</th>
                      <th>Due Date {renderSortIcons("dueDate")}</th>
                      <th>Amount {renderSortIcons("amount")}</th>
                      <th>Status {renderSortIcons("status")}</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="8" className="text-center py-3">Loading...</td>
                      </tr>
                    ) : filteredReminders.length ? (
                      filteredReminders.map((r, index) => (
                        <tr key={r.id}>
                          <td>{index + 1}</td>
                          <td className="fw-bold">{r.customer}</td>
                          <td>{new Date(r.dueDate).toLocaleDateString()}</td>
                          <td>
                            {r.amount.toLocaleString("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 })}
                          </td>
                          <td>
                            <span className={`badge bg-light-${r.status === 'Pending' ? 'warning' : r.status === 'Overdue' ? 'danger' : r.status === 'Upcoming' ? 'info' : 'success'}`}>
                              {r.status}
                            </span>
                          </td>
                          <td className="text-center">
                            <ul className="list-inline mb-0">
                              <li className="list-inline-item m-0">
                                <button className="avtar avtar-s btn-light-info mx-1" onClick={() => handlePreview(r)}>
                                  <i className="ti ti-eye f-18" />
                                </button>
                              </li>
                              <li className="list-inline-item m-0">
                                <span className="avtar avtar-s btn-light-warning mx-1" onClick={() => handleEdit(r)}>
                                  <i className="ti ti-pencil f-18" />
                                </span>
                              </li>
                              <li className="list-inline-item m-0">
                                <span className="avtar avtar-s btn-light-danger mx-1" onClick={() => handleDelete(r.id)}>
                                  <i className="ti ti-trash f-18" />
                                </span>
                              </li>
                            </ul>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center py-3">No reminders found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
             {/* Backdrop */}
{previewReminder && (
  <div
    className="offcanvas-backdrop fade show"
    style={{ zIndex: 1040 }} // Behind the offcanvas but above other content
    onClick={() => setPreviewReminder(null)}
  ></div>
)}

{/* Offcanvas Drawer */}
<div
  className={`offcanvas offcanvas-end ${previewReminder ? "show" : ""}`}
  style={{
    visibility: previewReminder ? "visible" : "hidden",
    width: "400px",
    zIndex: 1050, // Ensure it's above the backdrop
  }}
  tabIndex="-1"
  id="previewReminderPanel"
>
  <div className="offcanvas-header border-bottom">
    <h5 className="mb-0 fw-bold">Reminder Details</h5>
    <button
      type="button"
      className="btn-close text-reset"
      onClick={() => setPreviewReminder(null)}
    ></button>
  </div>

  <div className="offcanvas-body">
    {previewReminder ? (
      <div className="p-2">
        {/* Customer Card */}
        <div className="card border shadow-sm mb-4">
          <div className="card-body d-flex align-items-center">
            <div
              className="avtar bg-light-primary rounded-circle me-3 d-flex justify-content-center align-items-center"
              style={{ width: "50px", height: "50px" }}
            >
              <i className="ti ti-user f-24 text-primary"></i>
            </div>
            <div>
              <h6 className="mb-1 fw-bold">{previewReminder.customer}</h6>
              {/* <small className="text-muted">
                Invoice: {previewReminder.invoice}
              </small> */}
            </div>
          </div>
        </div>

        {/* Reminder Details */}
        <ul className="list-group list-group-flush">
          <li className="list-group-item d-flex justify-content-between align-items-center border rounded mb-2 shadow-sm">
            <span>Amount</span>
            <span className="fw-bold">
              ₹{previewReminder.amount.toLocaleString("en-IN")}
            </span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center border rounded mb-2 shadow-sm">
            <span>Due Date</span>
            <span className="fw-bold">
              {new Date(previewReminder.dueDate).toLocaleDateString()}
            </span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center border rounded mb-2 shadow-sm">
            <span>Status</span>
            <span
              className={`badge rounded-pill px-3 py-2 ${
                previewReminder.status === "Overdue"
                  ? "bg-danger"
                  : previewReminder.status === "Pending"
                  ? "bg-warning"
                  : previewReminder.status === "Upcoming"
                  ? "bg-info"
                  : "bg-success"
              }`}
            >
              {previewReminder.status}
            </span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center border rounded mb-2 shadow-sm">
            <span>Last Notification</span>
            <span className="fw-bold">
              {previewReminder.lastNotification || "N/A"}
            </span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center border rounded mb-2 shadow-sm">
            <span>Next Reminder</span>
            <span className="fw-bold">
              {previewReminder.nextReminder || "N/A"}
            </span>
          </li>
        </ul>
      </div>
    ) : (
      <p className="text-muted">No details available.</p>
    )}
  </div>
</div>

            </div>
          </div>
        </div>

        {/* ---------------- Update Reminder Modal ---------------- */}
        <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Update Reminder</Modal.Title>
          </Modal.Header>
          <Formik
            enableReinitialize
            initialValues={{
              customer: selectedReminder?.customer || '',
              invoice: selectedReminder?.invoice || '',
              amount: selectedReminder?.amount || '',
              dueDate: selectedReminder?.dueDate || '',
              status: selectedReminder?.status || '',
            }}
            validationSchema={Yup.object({
              customer: Yup.string().required("Customer name is required"),
              invoice: Yup.string().required("Invoice is required"),
              amount: Yup.number().required("Amount is required"),
              dueDate: Yup.date().required("Due date is required"),
              status: Yup.string().required("Status is required"),
            })}
            onSubmit={handleUpdateSubmit}
          >
            {({ values, handleChange }) => (
              <Form>
                <Modal.Body>
                  <div className="mb-3">
                    <label className="form-label">Customer/Vendor</label>
                    <Field type="text" name="customer" className="form-control" />
                    <ErrorMessage name="customer" component="div" className="text-danger" />
                  </div>

                 

                  <div className="mb-3">
                    <label className="form-label">Amount</label>
                    <Field type="number" name="amount" className="form-control" />
                    <ErrorMessage name="amount" component="div" className="text-danger" />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Due Date</label>
                    <Field type="date" name="dueDate" className="form-control" />
                    <ErrorMessage name="dueDate" component="div" className="text-danger" />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <Field as="select" name="status" className="form-select">
                      <option value="">Select Status</option>
                      <option value="Pending">Pending</option>
                      <option value="Overdue">Overdue</option>
                      <option value="Upcoming">Upcoming</option>
                      <option value="Collected">Collected</option>
                    </Field>
                    <ErrorMessage name="status" component="div" className="text-danger" />
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>Cancel</Button>
                  <Button variant="primary" type="submit">Update</Button>
                </Modal.Footer>
              </Form>
            )}
          </Formik>
        </Modal>
      </div>
    </>
  )
}

export default PaymentReminders
