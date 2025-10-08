// src/pages/admin/components/CreateTaxModal.jsx
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Modal } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-hot-toast";

const CreateTaxModal = ({ show, handleClose, fetchTaxes }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("authToken");

  // Validation Schema
  const validationSchema = Yup.object({
    filingDate: Yup.date().required("Filing Date is required"),
    taxType: Yup.string().required("Tax Type is required"),
    amount: Yup.number().required("Amount is required").positive("Must be positive"),
    dueDate: Yup.date().required("Due Date is required"),
    status: Yup.string().required("Status is required"),
    paymentMethod: Yup.string(),
    notes: Yup.string(),
    attachments: Yup.array(),
    documentNames: Yup.array(),
  });

  const initialValues = {
    filingDate: "",
    taxType: "",
    amount: "",
    dueDate: "",
    status: "Pending",
    paymentMethod: "Bank Transfer",
    notes: "",
    attachments: [],
    documentNames: [],
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();

      // Append normal fields
      Object.keys(values).forEach((key) => {
        if (key !== "attachments" && key !== "documentNames") {
          formData.append(key, values[key]);
        }
      });

      // Append attachments with document names
      if (values.attachments.length > 0) {
        values.attachments.forEach((file, index) => {
          formData.append("attachments", file);
          formData.append("documentNames", values.documentNames[index] || file.name);
        });
      }

      await axios.post(`${API_URL}/tax/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      handleClose();
      toast.success("Tax record created successfully");
      fetchTaxes();
    } catch (err) {
      console.error("Failed to create tax record:", err);
      toast.error("Failed to create tax record");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add Tax Record</Modal.Title>
      </Modal.Header>

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form>
            <Modal.Body>
              <div className="row g-3">

                {/* Tax Type */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field type="text" name="taxtype" className="form-control" placeholder="Tax Type" />
                    <label>Tax Type <span className="text-danger">*</span></label>
                  </div>
                  <ErrorMessage name="taxtype" component="div" className="text-danger" />
                </div>

                {/* Amount */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field type="number" name="amount" className="form-control" placeholder="Amount" />
                    <label>Amount <span className="text-danger">*</span></label>
                  </div>
                  <ErrorMessage name="amount" component="div" className="text-danger" />
                </div>

                {/* Payment Method */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field type="text" name="taxtype" className="form-control" placeholder="Payment Method" />
                    <label>Payment Method <span className="text-danger">*</span></label>
                  </div>
                  <ErrorMessage name="taxtype" component="div" className="text-danger" />
                </div>

                
                 {/* Filing Date */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field type="date" name="filingDate" className="form-control" placeholder="Filing Date" />
                    <label>Filing Date <span className="text-danger">*</span></label>
                  </div>
                  <ErrorMessage name="filingDate" component="div" className="text-danger" />
                </div>

                {/* Due Date */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field type="date" name="dueDate" className="form-control" placeholder="Due Date" />
                    <label>Due Date <span className="text-danger">*</span></label>
                  </div>
                  <ErrorMessage name="dueDate" component="div" className="text-danger" />
                </div>
                
                {/* Status */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field as="select" name="status" className="form-select">
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Overdue">Overdue</option>
                    </Field>
                    <label>Status <span className="text-danger">*</span></label>
                  </div>
                  <ErrorMessage name="status" component="div" className="text-danger" />
                </div>

                {/* Notes */}
                <div className="col-12">
                  <div className="form-floating">
                    <Field
                      as="textarea"
                      name="notes"
                      className="form-control"
                      placeholder="Notes"
                      style={{ height: "80px" }}
                    />
                    <label>Notes / Remarks</label>
                  </div>
                  <ErrorMessage name="notes" component="div" className="text-danger" />
                </div>

                {/* Attachments with document name */}
                <div className="col-12">
                  <label className="form-label">Upload Documents</label>
                  <input
                    type="file"
                    className="form-control mb-2"
                    multiple
                    onChange={(event) => {
                      const files = Array.from(event.currentTarget.files);
                      setFieldValue("attachments", files);

                      // Initialize document names with file names
                      setFieldValue("documentNames", files.map((f) => f.name));
                    }}
                  />

                  {/* Document name inputs */}
                  {values.attachments.length > 0 &&
                    values.attachments.map((file, index) => (
                      <div key={index} className="mb-2">
                        <label className="form-label">Document Name for {file.name}</label>
                        <Field
                          type="text"
                          name={`documentNames.${index}`}
                          className="form-control"
                          placeholder="Enter Document Name"
                        />
                      </div>
                    ))}
                </div>
              </div>
            </Modal.Body>

            <Modal.Footer>
              <button type="button" className="btn btn-secondary" onClick={handleClose} disabled={isSubmitting}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                Add Tax Record
              </button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default CreateTaxModal;
