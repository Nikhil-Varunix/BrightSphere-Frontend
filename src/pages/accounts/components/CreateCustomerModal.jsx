// src/pages/admin/components/CreateCustomerModal.jsx
import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const CreateCustomerModal = ({ show, handleClose, onCreate }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    gst: "",
    status: "Active",
    createdBy: "Admin",
    createdAt: new Date().toISOString().slice(0, 10),
    updatedBy: "Admin",
    updatedAt: new Date().toISOString().slice(0, 10),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.city.trim()
    ) {
      alert("Please fill required fields (Name, Email, Phone, City)");
      return;
    }
    onCreate(formData);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create Customer</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="form-floating mb-3">
          <input
            type="text"
            name="name"
            className="form-control"
            id="floatingName"
            placeholder="Customer Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <label htmlFor="floatingName">Name *</label>
        </div>

        <div className="form-floating mb-3">
          <input
            type="email"
            name="email"
            className="form-control"
            id="floatingEmail"
            placeholder="Customer Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <label htmlFor="floatingEmail">Email *</label>
        </div>

        <div className="form-floating mb-3">
          <input
            type="text"
            name="phone"
            className="form-control"
            id="floatingPhone"
            placeholder="Mobile Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <label htmlFor="floatingPhone">Mobile *</label>
        </div>

        <div className="form-floating mb-3">
          <input
            type="text"
            name="gst"
            className="form-control"
            id="floatingGst"
            placeholder="GST Number"
            value={formData.gst}
            onChange={handleChange}
          />
          <label htmlFor="floatingGst">GST No.</label>
        </div>
        <div className="form-floating mb-3">
          <input
            type="text"
            name="city"
            className="form-control"
            id="floatingCity"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            required
          />
          <label htmlFor="floatingCity">Address *</label>
        </div>

        

        {/* Uncomment if you want these later
        <div className="form-floating mb-3">
          <input
            type="number"
            name="creditLimit"
            className="form-control"
            id="floatingCreditLimit"
            placeholder="Credit Limit"
            value={formData.creditLimit}
            onChange={handleChange}
          />
          <label htmlFor="floatingCreditLimit">Credit Limit</label>
        </div>

        <div className="form-floating mb-3">
          <input
            type="text"
            name="paymentTerms"
            className="form-control"
            id="floatingPaymentTerms"
            placeholder="Payment Terms"
            value={formData.paymentTerms}
            onChange={handleChange}
          />
          <label htmlFor="floatingPaymentTerms">Payment Terms</label>
        </div>
        */}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateCustomerModal;
