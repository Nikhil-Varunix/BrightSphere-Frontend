// src/pages/admin/components/CreateExpenseModal.jsx
import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Modal } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-hot-toast";

const CreateExpenseModal = ({ show, handleClose, fetchExpenses }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const orgId = import.meta.env.VITE_ORG_ID;
  const token = localStorage.getItem("authToken");
  const [employees, setEmployees] = useState([]);

  // Fetch employees
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userOptions = res.data.data.map((user) => ({
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
      }));
      setEmployees(userOptions);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      toast.error("Failed to fetch employees");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Validation
  const validationSchema = Yup.object({
    employeeName: Yup.string().required("Employee Name is required"),
    category: Yup.string().required("Category is required"),
    expenseType: Yup.string().required("Expense Type is required"),
    amount: Yup.number().required("Amount is required").positive("Must be positive"),
    paymentStatus: Yup.string().required("Payment Status is required"),
    dateIncurred: Yup.date().required("Date Incurred is required"),
    notes: Yup.string(),
    attachments: Yup.mixed(),
  });

  const initialValues = {
    employeeName: "",
    category: "",
    expenseType: "Reimbursable",
    amount: "",
    paymentStatus: "Pending",
    dateIncurred: "",
    notes: "",
    attachments: [],
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (key === "attachments" && values.attachments.length > 0) {
          values.attachments.forEach((file) => formData.append("attachments", file));
        } else {
          formData.append(key, values[key]);
        }
      });

      await axios.post(`${API_URL}/expenses/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      handleClose();
      toast.success("Expense added successfully");
      fetchExpenses();
    } catch (err) {
      console.error("Failed to add expense:", err);
      toast.error("Failed to add expense");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add Expense</Modal.Title>
      </Modal.Header>

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form>
            <Modal.Body>
              <div className="row g-3">
                {/* Employee */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field type="text" name="category" className="form-control" placeholder="Employee" />
                    <label>Employee Name <span className="text-danger">*</span></label>
                  </div>
                  <ErrorMessage name="category" component="div" className="text-danger" />
                </div>
                {/* Title */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field type="text" name="category" className="form-control" placeholder="Title" />
                    <label>Title <span className="text-danger">*</span></label>
                  </div>
                  <ErrorMessage name="category" component="div" className="text-danger" />
                </div>

                {/* Category */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field type="text" name="category" className="form-control" placeholder="Category" />
                    <label>Category <span className="text-danger">*</span></label>
                  </div>
                  <ErrorMessage name="category" component="div" className="text-danger" />
                </div>

                {/* Amount */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field type="number" name="amount" className="form-control" placeholder="Amount" />
                    <label>Amount <span className="text-danger">*</span></label>
                  </div>
                  <ErrorMessage name="amount" component="div" className="text-danger" />
                </div>

                

                {/* Date Incurred */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field type="date" name="dateIncurred" className="form-control" placeholder="Spent Date" />
                    <label>Spent Date <span className="text-danger">*</span></label>
                  </div>
                  <ErrorMessage name="dateIncurred" component="div" className="text-danger" />
                </div>

                {/* Requested Date */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field type="date" name="dateIncurred" className="form-control" placeholder="Requested Date" />
                    <label>Requested Date <span className="text-danger">*</span></label>
                  </div>
                  <ErrorMessage name="dateIncurred" component="div" className="text-danger" />
                </div>

                {/* Payment Status */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field as="select" name="paymentStatus" className="form-select">
                      <option value="Pending">Pending</option>
                      <option value="Paid">Closed</option>
                    </Field>
                    <label>Status <span className="text-danger">*</span></label>
                  </div>
                  <ErrorMessage name="paymentStatus" component="div" className="text-danger" />
                </div>

                {/* Notes / Description */}
                <div className="col-12">
                  <div className="form-floating">
                    <Field
                      as="textarea"
                      name="notes"
                      className="form-control"
                      placeholder="Description / Notes"
                      style={{ height: "80px" }}
                    />
                    <label>Description / Notes</label>
                  </div>
                  <ErrorMessage name="notes" component="div" className="text-danger" />
                </div>

                {/* Attachments */}
                <div className="col-12">
                  <label className="form-label">Attachments</label>
                  <input
                    type="file"
                    className="form-control"
                    multiple
                    onChange={(event) => {
                      const files = Array.from(event.currentTarget.files);
                      setFieldValue("attachments", files);
                    }}
                  />
                </div>
              </div>
            </Modal.Body>

            <Modal.Footer>
              <button type="button" className="btn btn-secondary" onClick={handleClose} disabled={isSubmitting}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                Add Expense
              </button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default CreateExpenseModal;
