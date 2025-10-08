import React, { useState } from "react";
import { toast } from "react-hot-toast";

const GenerateStatementModal = ({ show, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    openingBalance: "",
    totalInvoices: "",
    totalPayments: "",
    closingBalance: "",
    statementPeriod: "",
    generatedDate: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.customerEmail) {
      toast.error("Please fill in all required fields");
      return;
    }
    onSave(formData);
    toast.success("Statement generated successfully");
    setFormData({
      customerName: "",
      customerEmail: "",
      openingBalance: "",
      totalInvoices: "",
      totalPayments: "",
      closingBalance: "",
      statementPeriod: "",
      generatedDate: "",
    });
    onClose(); // Close modal via prop
  };

  if (!show) return null; // Do not render if modal not shown

  return (
    <div className="modal-backdrop fade show">
      <div className="modal d-block" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">Generate Statement</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={onClose}
                />
              </div>

              <div className="modal-body row g-3">
                <div className="col-md-6">
                  <label className="form-label">Customer Name</label>
                  <input
                    type="text"
                    name="customerName"
                    className="form-control"
                    value={formData.customerName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Customer Email</label>
                  <input
                    type="email"
                    name="customerEmail"
                    className="form-control"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Opening Balance</label>
                  <input
                    type="number"
                    name="openingBalance"
                    className="form-control"
                    value={formData.openingBalance}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Total Invoices</label>
                  <input
                    type="number"
                    name="totalInvoices"
                    className="form-control"
                    value={formData.totalInvoices}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Total Payments</label>
                  <input
                    type="number"
                    name="totalPayments"
                    className="form-control"
                    value={formData.totalPayments}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Closing Balance</label>
                  <input
                    type="number"
                    name="closingBalance"
                    className="form-control"
                    value={formData.closingBalance}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Statement Period</label>
                  <input
                    type="text"
                    name="statementPeriod"
                    placeholder="01/07/2025 - 31/07/2025"
                    className="form-control"
                    value={formData.statementPeriod}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Generated Date</label>
                  <input
                    type="date"
                    name="generatedDate"
                    className="form-control"
                    value={formData.generatedDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Generate
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateStatementModal;
