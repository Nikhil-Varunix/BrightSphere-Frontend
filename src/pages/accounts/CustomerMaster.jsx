// src/pages/admin/CustomerMaster.jsx
import BreadCrumb from "../../components/BreadCrumb";
import toast from "react-hot-toast";
import { useState } from "react";
import UpdateCustomerModal from "./components/UpdateCustomerModal";
import CreateCustomerModal from "./components/CreateCustomerModal";

const CustomerMaster = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [previewCustomer, setPreviewCustomer] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const [customers, setCustomers] = useState([
    {
      id: "CUST001",
      name: "John Doe",
      type: "Individual",
      email: "john@example.com",
      phone: "+91 9876543210",
      address: "Hyderabad",
      // city: "Hyderabad",
      gst: "29ABCDE1234F1Z5",
      creditLimit: "50000",
      paymentTerms: "Net 30",
      priority: "Gold",
      accountOwner: "Jane Smith",
      onboardedDate: "2024-05-10",
      createdBy: "Admin",
      createdAt: "20/08/2025",
      updatedBy: "Admin",
      updatedAt: "25/08/2025",
      status: "Active",
    },
  ]);

  // 🔹 helper for next ID
  const createNextCustomerId = () => {
    const maxNum =
      Math.max(
        0,
        ...customers.map((c) => {
          const n = parseInt((c.id || "").replace(/\D/g, ""), 10);
          return Number.isNaN(n) ? 0 : n;
        })
      ) || 0;
    return "CUST" + String(maxNum + 1).padStart(3, "0");
  };

  // 🔹 Sorting icons
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
        <BreadCrumb
          subLabel="Admin"
          pageTitle="Customer Records"
          subUrl="/customer-master"
        />

        {/* 🔹 Create Record Button */}
        <button
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          + Create Customer
        </button>
      </div>

      {/* Table Section */}
      <div className="row">
        <div className="col-12">
          <div className="card table-card">
            <div className="card-body pt-3">
              {/* Search and Filter */}
              <div className="row mb-3 g-3">
                <div className="col-md-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by customer or GST no."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="col-md-2">
                  <input
                    type="date"
                    className="form-control"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Table */}
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>S.No {renderSortIcons("sno")}</th>
                      <th>Customer {renderSortIcons("name")}</th>
                      <th>Mobile {renderSortIcons("phone")}</th>
                      <th>GST No. {renderSortIcons("gst")}</th>
                      <th>Address {renderSortIcons("city")}</th>
                      <th>Created {renderSortIcons("createdAt")}</th>
                      <th>Updated {renderSortIcons("updatedAt")}</th>
                      <th>Status {renderSortIcons("status")}</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {customers.map((cust, index) => (
                      <tr key={cust.id}>
                        <td>{index + 1}</td>
                        <td>
                          <strong>{cust.name}</strong>
                          <br />
                          <small>{cust.email}</small>
                        </td>
                        <td>{cust.phone || "-"}</td>
                        <td>{cust.gst || "-"}</td>
                        <td>
                          {cust.address}, {cust.city}
                        </td>
                        <td>
                          <div>{cust.createdBy}</div>
                          <small className="text-muted">{cust.createdAt}</small>
                        </td>
                        <td>
                          <div>{cust.updatedBy}</div>
                          <small className="text-muted">{cust.updatedAt}</small>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              cust.status === "Active"
                                ? "bg-light-success"
                                : "bg-light-danger"
                            }`}
                          >
                            {cust.status}
                          </span>
                        </td>
                        <td className="text-center">
                          <ul className="list-inline m-0">
                            {/* View */}
                            <li className="list-inline-item">
                              <span title="View" data-bs-toggle="offcanvas" data-bs-target="#customerDetailsPanel" 
                              onClick={() => setPreviewCustomer(cust)}
                              className="avtar avtar-s btn-light-info cursor-pointer">
                                <i className="ti ti-eye f-18" />
                                </span>
                            </li>

                            {/* Edit */}
                            <li className="list-inline-item">
                              <span
                                className="avtar avtar-s btn-light-warning cursor-pointer"
                                title="Edit"
                                onClick={() => {
                                  setSelectedCustomer(cust);
                                  setShowModal(true);
                                }}
                              >
                                <i className="ti ti-pencil f-18" />
                              </span>
                            </li>
                            {/* Delete */}
                            <li className="list-inline-item">
                              <span
                                title="Delete"
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      "Are you sure you want to delete this customer?"
                                    )
                                  ) {
                                    setCustomers((prev) =>
                                      prev.filter((c) => c.id !== cust.id)
                                    );
                                    toast.success(
                                      "Customer deleted successfully"
                                    );
                                  }
                                }}
                                className="avtar avtar-s btn-light-danger cursor-pointer"
                              >
                                <i className="ti ti-trash f-18" />
                              </span>
                            </li>
                          </ul>
                        </td>
                      </tr>
                    ))}
                    {customers.length === 0 && (
                      <tr>
                        <td colSpan="20" className="text-center text-muted">
                          No customers found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Offcanvas Preview */}
              <div
                className="offcanvas offcanvas-end"
                style={{
              width: "400px",
              zIndex: 1050,
            }}
                tabIndex="-1"
                id="customerDetailsPanel"
                aria-labelledby="customerDetailsLabel"
              >
                <div className="offcanvas-header border-bottom">
                  <h5 id="customerDetailsLabel" className="mb-0 fw-bold">
                    Customer Details
                  </h5>
                  <button
                    type="button"
                    className="btn-close text-reset"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                    onClick={() => setPreviewCustomer(null)}
                  ></button>
                </div>

                <div className="offcanvas-body">
                  {previewCustomer ? (
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
                            <h6 className="mb-1 fw-bold">
                              {previewCustomer.name}
                            </h6>
                            <small className="text-muted">
                              Email: {previewCustomer.email}
                            </small>
                          </div>
                        </div>
                      </div>

                      {/* Customer Info List */}
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item d-flex justify-content-between align-items-center border rounded mb-2 shadow-sm">
                          <span>Customer ID</span>
                          <span className="fw-bold">
                            {previewCustomer.id}
                          </span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center border rounded mb-2 shadow-sm">
                          <span>Phone</span>
                          <span className="fw-bold">
                            {previewCustomer.phone}
                          </span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center border rounded mb-2 shadow-sm">
                          <span>Type</span>
                          <span className="fw-bold">
                            {previewCustomer.type}
                          </span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center border rounded mb-2 shadow-sm">
                          <span>Address</span>
                          <span className="fw-bold">
                            {previewCustomer.address}, {previewCustomer.city}
                          </span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center border rounded mb-2 shadow-sm">
                          <span>GST No.</span>
                          <span className="fw-bold">
                            {previewCustomer.gst || "-"}
                          </span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center border rounded mb-2 shadow-sm">
                          <span>Status</span>
                          <span
                            className={`badge rounded-pill px-3 py-2 ${
                              previewCustomer.status === "Active"
                                ? "bg-success"
                                : "bg-danger"
                            }`}
                          >
                            {previewCustomer.status}
                          </span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center border rounded mb-2 shadow-sm">
                          <span>Created By</span>
                          <span className="fw-bold">
                            {previewCustomer.createdBy} (
                            {previewCustomer.createdAt})
                          </span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center border rounded mb-2 shadow-sm">
                          <span>Updated By</span>
                          <span className="fw-bold">
                            {previewCustomer.updatedBy} (
                            {previewCustomer.updatedAt})
                          </span>
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <p className="text-muted">No details available.</p>
                  )}
                </div>
              </div>

              {/* Update Customer Modal */}
              {selectedCustomer && (
                <UpdateCustomerModal
                  show={showModal}
                  handleClose={() => setShowModal(false)}
                  customer={selectedCustomer}
                  onUpdate={(updatedCustomer) => {
                    setCustomers((prev) =>
                      prev.map((c) =>
                        c.id === updatedCustomer.id ? updatedCustomer : c
                      )
                    );
                    toast.success("Customer updated successfully");
                    setShowModal(false);
                  }}
                />
              )}

              {/* Create Customer Modal */}
              {showCreateModal && (
                <CreateCustomerModal
                  show={showCreateModal}
                  handleClose={() => setShowCreateModal(false)}
                  onCreate={(newCustomer) => {
                    setCustomers((prev) => [
                      ...prev,
                      { ...newCustomer, id: createNextCustomerId() },
                    ]);
                    toast.success("Customer created successfully");
                    setShowCreateModal(false);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerMaster;
