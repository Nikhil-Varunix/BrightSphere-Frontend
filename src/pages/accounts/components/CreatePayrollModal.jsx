// src/pages/admin/components/CreatePayrollModal.jsx
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Modal } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-hot-toast";

const CreatePayrollModal = ({ show, handleClose, fetchPayrolls }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("authToken");

  // Validation schema
  const validationSchema = Yup.object({
    employeeName: Yup.string().required("Employee Name is required"),
    salary: Yup.number().required("Salary is required").positive("Must be positive"),
    overtimeHours: Yup.number().required("Overtime Hours required").min(0),
    overtimePay: Yup.number().required("Overtime Pay required").min(0),
    grossSalary: Yup.number().required("Gross Salary required").positive("Must be positive"),
    payDate: Yup.date().required("Pay Date is required"),
    paymentType: Yup.string().required("Payment Type is required"),
    status: Yup.string().required("Status is required"),
  });

  const initialValues = {
    employeeName: "",
    salary: "",
    overtimeHours: "",
    overtimePay: "",
    grossSalary: "",
    payDate: "",
    paymentType: "",
    status: "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await axios.post(`${API_URL}/payrolls/create`, values, {
        headers: { Authorization: `Bearer ${token}` },
      });

      handleClose();
      toast.success("Payroll added successfully");
      fetchPayrolls();
    } catch (err) {
      console.error("Failed to add payroll:", err);
      toast.error("Failed to add payroll");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add Payroll</Modal.Title>
      </Modal.Header>

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form>
            <Modal.Body>
              <div className="row g-3">
                {/* Employee Name */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field
                      type="text"
                      name="employeeName"
                      className="form-control"
                      placeholder="Employee Name"
                    />
                    <label>Employee <span className="text-danger">*</span></label>
                  </div>
                  <ErrorMessage name="employeeName" component="div" className="text-danger" />
                </div>

                {/* Salary */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field type="number" name="salary" className="form-control" placeholder="Salary" />
                    <label>Salary <span className="text-danger">*</span></label>
                  </div>
                  <ErrorMessage name="salary" component="div" className="text-danger" />
                </div>

                {/* Overtime Hours */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field type="number" name="overtimeHours" className="form-control" placeholder="Overtime Hours" />
                    <label>Overtime Hours <span className="text-danger">*</span></label>
                  </div>
                  <ErrorMessage name="overtimeHours" component="div" className="text-danger" />
                </div>

                {/* Overtime Pay */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field type="number" name="overtimePay" className="form-control" placeholder="Overtime Pay" />
                    <label>Overtime Pay <span className="text-danger">*</span></label>
                  </div>
                  <ErrorMessage name="overtimePay" component="div" className="text-danger" />
                </div>

                {/* Gross Salary (auto-calculated) */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field
                      type="number"
                      name="grossSalary"
                      className="form-control"
                      placeholder="Gross Salary"
                      // value={Number(values.salary || 0) + Number(values.overtimePay || 0)}
                     
                    />
                    <label>Total Salary</label>
                  </div>
                </div>

                {/* Pay Date */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field type="date" name="payDate" className="form-control" placeholder="Pay Date" />
                    <label>Pay Date <span className="text-danger">*</span></label>
                  </div>
                  <ErrorMessage name="payDate" component="div" className="text-danger" />
                </div>

                {/* Payment Type */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field as="select" name="paymentType" className="form-select">
                     
                      <option value="Cash">Cash</option>
                      <option value="Cheque">Cheque</option>
                       <option value="Bank Transfer">Bank Transfer</option>
                    </Field>
                    <label>Payment Method <span className="text-danger">*</span></label>
                  </div>
                  <ErrorMessage name="paymentType" component="div" className="text-danger" />
                </div>

                {/* Status */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field as="select" name="status" className="form-select">
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
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
                Add Payroll
              </button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default CreatePayrollModal;
