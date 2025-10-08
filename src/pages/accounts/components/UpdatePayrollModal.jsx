// src/pages/admin/components/UpdatePayrollModal.jsx
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Modal } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-hot-toast";

const UpdatePayrollModal = ({ show, handleClose, payroll, fetchPayrolls }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("authToken");

  // Validation schema
  const validationSchema = Yup.object({
    employeeName: Yup.string().required("Employee Name is required"),
    title: Yup.string().required("Title is required"),
    salary: Yup.number().required("Salary is required").positive("Must be positive"),
    overtimeHours: Yup.number().min(0, "Cannot be negative"),
    overtimePay: Yup.number().min(0, "Cannot be negative"),
    grossSalary: Yup.number().required("Gross Salary is required").positive("Must be positive"),
    payDate: Yup.date().required("Pay Date is required"),
    paymentType: Yup.string().required("Payment Type is required"),
    status: Yup.string().required("Status is required"),
  });

  // Default values
  const initialValues = {
    employeeName: payroll?.employeeName || "Jane Doe",
    title: payroll?.title || "Manager",
    salary: payroll?.salary || 40000,
    overtimeHours: payroll?.overtimeHours || 5,
    overtimePay: payroll?.overtimePay || 1000,
    grossSalary: payroll?.grossSalary || 41000,
    payDate: payroll?.payDate
      ? payroll.payDate.split("T")[0]
      : "2025-07-30", // input date format
    paymentType: payroll?.paymentType || "Cash",
    status: payroll?.status || "Paid",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await axios.put(`${API_URL}/payrolls/update/${payroll._id}`, values, {
        headers: { Authorization: `Bearer ${token}` },
      });

      handleClose();
      toast.success("Payroll updated successfully");
      fetchPayrolls();
    } catch (err) {
      console.error("Failed to update payroll:", err);
      toast.error("Failed to update payroll");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Update Payroll</Modal.Title>
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
                {/* Employee Name */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field
                      type="text"
                      name="employeeName"
                      className="form-control"
                      placeholder="Employee Name"
                      readOnly
                    />
                    <label>Employee Name</label>
                  </div>
                  <ErrorMessage name="employeeName" component="div" className="text-danger" />
                </div>

                {/* Title */}
                {/* <div className="col-md-6">
                  <div className="form-floating">
                    <Field type="text" name="title" className="form-control" placeholder="Title" />
                    <label>Title</label>
                  </div>
                  <ErrorMessage name="title" component="div" className="text-danger" />
                </div> */}

                {/* Salary */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field type="number" name="salary" className="form-control" placeholder="Salary" />
                    <label>Salary</label>
                  </div>
                  <ErrorMessage name="salary" component="div" className="text-danger" />
                </div>

                {/* Overtime Hours */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field type="number" name="overtimeHours" className="form-control" placeholder="Overtime Hours" />
                    <label>Overtime Hours</label>
                  </div>
                  <ErrorMessage name="overtimeHours" component="div" className="text-danger" />
                </div>

                {/* Overtime Pay */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field type="number" name="overtimePay" className="form-control" placeholder="Overtime Pay" />
                    <label>Overtime Pay</label>
                  </div>
                  <ErrorMessage name="overtimePay" component="div" className="text-danger" />
                </div>

                {/* Gross Salary */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field type="number" name="grossSalary" className="form-control" placeholder="Gross Salary" />
                    <label>Total Salary</label>
                  </div>
                  <ErrorMessage name="grossSalary" component="div" className="text-danger" />
                </div>

                {/* Pay Date */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field type="date" name="payDate" className="form-control" placeholder="Pay Date" />
                    <label>Pay Date</label>
                  </div>
                  <ErrorMessage name="payDate" component="div" className="text-danger" />
                </div>

                {/* Payment Type */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field type="text" name="paymentType" className="form-control" placeholder="Payment Type" />
                    <label>Payment Method</label>
                  </div>
                  <ErrorMessage name="paymentType" component="div" className="text-danger" />
                </div>

                {/* Status */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field type="text" name="status" className="form-control" placeholder="Status" />
                    <label>Status</label>
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

export default UpdatePayrollModal;
