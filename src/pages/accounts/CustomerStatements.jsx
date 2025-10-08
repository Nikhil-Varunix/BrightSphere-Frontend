// src/pages/admin/CustomerStatements.jsx
import BreadCrumb from "../../components/BreadCrumb";
import { toast } from "react-hot-toast";
import { useState, useMemo } from "react";
import GenerateStatementModal from './components/GenerateStatementModal';

// Dummy Customer Statements Data
const dummyStatements = [
  {
    id: 1,
    statementNumber: "1",
    customerName: "John Doe",
    customerNumber: "9876543210",
    customerEmail: "john@example.com",
    gstNumber: "27ABCDE1234F1Z5",
    address: "Hyderabad",
    openingBalance: 25000,
    totalInvoices: 15000,
    // totalPayments: 12000,
    service: "Wahing machine Repair",
    createdBy: "Admin ",
    createdAt:"08/08/2025",
    // currency: "₹",
    statementPeriod: "09/08/2025",
    generatedDate: "09/08/2025",
    status: "Active",
  },
];

const CustomerStatements = () => {
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [filterDate, setFilterDate] = useState("");
  const [previewStatement, setPreviewStatement] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "statementNumber",
    direction: "asc",
  });
  const [searchTerm, setSearchTerm] = useState("");

  // Sorting + Filtering
  const filteredStatements = useMemo(() => {
    return dummyStatements.filter(
      (s) =>
        s.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.statementNumber.includes(searchTerm) ||
        s.customerNumber.includes(searchTerm)
    );
  }, [searchTerm]);

  const sortedStatements = useMemo(() => {
    return [...filteredStatements].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key])
        return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key])
        return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredStatements, sortConfig]);

  // Actions
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this statement?")) {
      toast.success("Statement deleted successfully");
    }
  };

  const handleDownload = (type) => {
    toast.success(`${type} downloaded successfully!`);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

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
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center">
        <BreadCrumb pageTitle="Customer Statements" subLabel="Accounts" />
        {/* <div className="d-flex gap-2 mt-3">
          <button
            className="btn btn-primary"
            onClick={() => setShowGenerateModal(true)}
          >
            <i className="ti ti-plus f-20 me-1"></i> Generate Statement
          </button>
        </div> */}
      </div>

      {/* Table */}
      <div className="row mt-3">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              {/* Search */}
              <div className="row mb-3 g-3">
                <div className="col-md-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by customer, number or email"
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

              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th>S.No {renderSortIcons("statementNumber")}</th>
                      <th>Customer {renderSortIcons("customerName")}</th>
                      <th>Mobile {renderSortIcons("customerNumber")}</th>
                      <th>Service {renderSortIcons("service")}</th>
                      {/* <th>GST No {renderSortIcons("gstNumber")}</th> */}
                      <th>Address  {renderSortIcons("address")}</th>
                      <th>Spent Amount {renderSortIcons("totalInvoices")}</th>
                      <th>Total Amount {renderSortIcons("openingBalance")}</th>
                      {/* <th>Opening Balance {renderSortIcons("openingBalance")}</th>
                      <th>Closing Balance {renderSortIcons("service")}</th> */}
                      <th>Created  {renderSortIcons("created")}</th>
                      <th>Status  {renderSortIcons("status")}</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedStatements.length ? (
                      sortedStatements.map((st) => (
                        <tr key={st.id}>
                          <td>{st.statementNumber}</td>
                          <td className="fw-bold">
                            {st.customerName}
                            <br />
                            <small>{st.customerEmail}</small>
                          </td>
                          <td>{st.customerNumber}</td>
                          <td>
                            {st.currency}
                            {st.service}
                          </td>
                          {/* <td>{st.gstNumber || "-"}</td> */}
                          <td>{st.address || "-"}</td>
                          <td>
                            {st.currency}
                            {st.totalInvoices.toLocaleString()}
                          </td>
                          <td>
                            {st.currency}
                            {st.openingBalance.toLocaleString()}
                          </td>
                          
                          {/* <td>
                            {st.currency}
                            {st.openingBalance.toLocaleString()}
                          </td> */}
                          {/* <td>
                            {st.currency}
                            {st.openingBalance.toLocaleString()}
                          </td>
                          <td>
                            {st.currency}
                            {st.service.toLocaleString()}
                          </td> */}
                          <td><div>{st.createdBy?.name || st.createdBy || "-"}</div> 
                          <div>{st.createdAt ? new Date(st.createdAt).toLocaleDateString() : "-"}</div>
                          </td>

                          <td>
                            <span
                              className={`badge rounded-pill px-2 py-1 ${
                                st.status === "Active"
                                  ? "bg-light-success"
                                  : st.status === "Overdue"
                                  ? "bg-light-danger"
                                  : "bg-light-warning"
                              }`}
                            >
                              {st.status || "-"}
                            </span>
                          </td>
                          <td>
                            <ul className="list-inline mb-0 align-items-center">
                              <li className="list-inline-item m-0">
                                <span
                                  className="avtar avtar-s btn-light-primary mx-1"
                                  title="Preview"
                                  onClick={() => setPreviewStatement(st)}
                                >
                                  <i className="ti ti-eye f-18" />
                                </span>
                              </li>
                              <li className="list-inline-item m-0">
                                <span
                                  className="avtar avtar-s btn-light-info mx-1"
                                  title="Download PDF"
                                  onClick={() => handleDownload("PDF")}
                                >
                                  <i className="ti ti-file-text f-18" />
                                </span>
                              </li>
                              <li className="list-inline-item m-0">
                                <span
                                  className="avtar avtar-s btn-light-secondary mx-1"
                                  title="Download Excel"
                                  onClick={() => handleDownload("Excel")}
                                >
                                  <i className="ti ti-file-type-xls f-18" />
                                </span>
                              </li>
                              <li className="list-inline-item cursor-pointer m-0">
                                <span
                                  className="avtar avtar-s btn-light-danger mx-1"
                                  onClick={() => handleDelete(st.id)}
                                  title="Delete"
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
                        <td colSpan="11" className="text-center">
                          No statements found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <GenerateStatementModal
                show={showGenerateModal}
                onClose={() => setShowGenerateModal(false)}
                onSave={(newStatement) => {
                  console.log("New statement:", newStatement);
                }}
              />
            </div>
          </div>
        </div>
      </div>

{/* Preview Drawer Backdrop */}
{previewStatement && (
  <div
    className="offcanvas-backdrop fade show"
    style={{ zIndex: 1040 }}
    onClick={() => setPreviewStatement(null)}
  ></div>
)}

{/* Offcanvas Drawer */}
<div
  className={`offcanvas offcanvas-end ${previewStatement ? "show" : ""}`}
  style={{
    visibility: previewStatement ? "visible" : "hidden",
    zIndex: 1050,
    transition: "visibility 0.3s ease, transform 0.3s ease",
  }}
  tabIndex="-1"
  id="customerStatementPanel"
  aria-labelledby="customerStatementLabel"
>
  <div className="offcanvas-header border-bottom">
    <h5 id="customerStatementLabel" className="mb-0 fw-bold">
      Customer Statement
    </h5>
    <button
      type="button"
      className="btn-close text-reset"
      onClick={() => setPreviewStatement(null)}
    ></button>
  </div>

  <div className="offcanvas-body">
    {previewStatement ? (
      <div className="p-2">
        {/* Customer Card */}
        <div className="card border shadow-sm mb-4">
          <div className="card-body d-flex align-items-center">
            <div
              className="avtar bg-light-light-primary rounded-circle me-3 d-flex justify-content-center align-items-center"
              style={{ width: "50px", height: "50px" }}
            >
              <i className="ti ti-user f-24 text-primary"></i>
            </div>
            <div>
              <h6 className="mb-1 fw-bold">{previewStatement.customerName || "-"}</h6>
              <small className="text-muted">
                Email: {previewStatement.customerEmail || "-"}

              </small>
            </div>
          </div>
        </div>

        {/* Statement Details List */}
        <ul className="list-group list-group-flush">
          <li className="list-group-item d-flex justify-content-between align-items-center border rounded mb-2 shadow-sm">
            <span>Statement Period</span>
            <span className="fw-bold">{previewStatement.statementPeriod || "-"}</span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center border rounded mb-2 shadow-sm">
            <span>Opening Balance</span>
            <span className="fw-bold">
              {previewStatement.currency || ""} {(previewStatement.openingBalance || 0).toLocaleString()}
            </span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center border rounded mb-2 shadow-sm">
            <span>Total Invoices</span>
            <span className="fw-bold">
              {previewStatement.currency || ""} {(previewStatement.totalInvoices || 0).toLocaleString()}
            </span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center border rounded mb-2 shadow-sm">
            <span>Total Payments</span>
            <span className="fw-bold">
              {previewStatement.currency || ""} {(previewStatement.totalPayments || 0).toLocaleString()}
            </span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center border rounded mb-2 shadow-sm">
            <span>Closing Balance</span>
            <span className="fw-bold">
              {previewStatement.currency || ""} {(previewStatement.closingBalance || 0).toLocaleString()}
            </span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center border rounded mb-2 shadow-sm">
            <span>Generated On</span>
            <span className="fw-bold">
              {previewStatement.generatedDate ? new Date(previewStatement.generatedDate).toLocaleDateString() : "-"}
            </span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center border rounded mb-2 shadow-sm">
            <span>Status</span>
            <span
              className={`badge rounded-pill px-3 py-2 ${
                previewStatement.status === "Active"
                  ? "bg-light-success"
                  : previewStatement.status === "Overdue"
                  ? "bg-light-danger"
                  : "bg-light-warning"
              }`}
            >
              {previewStatement.status || "N/A"}
            </span>
          </li>
        </ul>
      </div>
    ) : (
      <p className="text-muted">No details available.</p>
    )}
  </div>
</div>

    </>
  );
};

export default CustomerStatements;
