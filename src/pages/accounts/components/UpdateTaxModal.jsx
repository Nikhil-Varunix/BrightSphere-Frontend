// src/pages/admin/components/UpdateTaxModal.jsx
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Modal } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-hot-toast";

const UpdateTaxModal = ({ show, handleClose, tax, fetchTaxes }) => {
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

  // Default data if no tax passed
  const initialValues = {
    filingDate: tax?.filingDate ? tax.filingDate.split("T")[0] : "2025-07-30",
    taxType: tax?.taxType || "Income Tax",
    amount: tax?.amount || 1500,
    dueDate: tax?.dueDate ? tax.dueDate.split("T")[0] : "2025-08-14",
    status: tax?.status || "Filed",
    paymentMethod: tax?.paymentMethod || "Bank Transfer",
    notes: tax?.notes || "",
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

      await axios.put(`${API_URL}/tax/update/${tax?._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      handleClose();
      toast.success("Tax record updated successfully");
      fetchTaxes();
    } catch (err) {
      console.error("Failed to update tax record:", err);
      toast.error("Failed to update tax record");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Tax Record</Modal.Title>
      </Modal.Header>

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <Modal.Body>
              <div className="row g-3">
                {/* Tax Type */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field type="text" name="taxType" className="form-control" placeholder="Tax Type" />
                    <label>Tax Type <span className="text-danger">*</span></label>
                  </div>
                  <ErrorMessage name="taxType" component="div" className="text-danger" />
                </div>

                {/* Amount */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field type="number" name="amount" className="form-control" placeholder="Amount" />
                    <label>Amount <span className="text-danger">*</span></label>
                  </div>
                  <ErrorMessage name="amount" component="div" className="text-danger" />
                </div>

                 {/* Payment Method (searchable) */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field
                      type="text"
                      name="paymentMethod"
                      className="form-control"
                      placeholder="Enter Payment Method"
                      list="paymentMethodOptions"
                    />
                    <label>Payment Method</label>
                    <datalist id="paymentMethodOptions">
                      <option value="Bank Transfer" />
                      <option value="Cash" />
                      <option value="Cheque" />
                      <option value="Online" />
                    </datalist>
                  </div>
                  <ErrorMessage name="paymentMethod" component="div" className="text-danger" />
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
                      <option value="Filed">Filed</option>
                      <option value="Overdue">Overdue</option>
                    </Field>
                    <label>Status <span className="text-danger">*</span></label>
                  </div>
                  <ErrorMessage name="status" component="div" className="text-danger" />
                </div>

              </div>
            </Modal.Body>

            <Modal.Footer>
              <button type="button" className="btn btn-secondary" onClick={handleClose} disabled={isSubmitting}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                Save & Update
              </button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default UpdateTaxModal;
