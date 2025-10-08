import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const UpdateExpenseModal = ({ show, onClose, expense, onUpdate }) => {
  const [formData, setFormData] = useState(expense || {});

  // Update form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit updated expense
  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
    toast.success("Expense updated successfully");
    onClose();
  };

  useEffect(() => {
    setFormData(expense || {});
  }, [expense]);

  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        style={{ zIndex: 1040 }}
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        style={{ zIndex: 1050 }}
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Update Expense</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="row g-3">
                  
                  {/* Employee */}
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="text"
                        name="employeeName"
                        className="form-control"
                        placeholder="Employee"
                        value={formData.employeeName || ""}
                        onChange={handleChange}
                        required
                      />
                      <label>Employee</label>
                    </div>
                  </div>

                  {/* Title */}
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="text"
                        name="title"
                        className="form-control"
                        placeholder="Title"
                        value={formData.title || ""}
                        onChange={handleChange}
                      />
                      <label>Title</label>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="text"
                        name="category"
                        className="form-control"
                        placeholder="Category"
                        value={formData.category || ""}
                        onChange={handleChange}
                      />
                      <label>Category</label>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="number"
                        name="amount"
                        className="form-control"
                        placeholder="Amount"
                        value={formData.amount || ""}
                        onChange={handleChange}
                      />
                      <label>Amount</label>
                    </div>
                  </div>

                  {/* Date Spent */}
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="date"
                        name="dateIncurred"
                        className="form-control"
                        placeholder="Spent Date"
                        value={formData.dateIncurred || ""}
                        onChange={handleChange}
                      />
                      <label>Spent Date</label>
                    </div>
                  </div>

                  {/* Requested Date */}
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="date"
                        name="requestedDate"
                        className="form-control"
                        placeholder="Requested Date"
                        value={formData.requestedDate || ""}
                        onChange={handleChange}
                      />
                      <label>Requested Date</label>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-md-6">
                    <div className="form-floating">
                      <select
                        name="paymentStatus"
                        className="form-select"
                        value={formData.paymentStatus || "Pending"}
                        onChange={handleChange}
                      >
                        <option value="Paid">Closed</option>
                        <option value="Pending">Pending</option>
                        <option value="Overdue">Overdue</option>
                      </select>
                      <label>Status</label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateExpenseModal;
