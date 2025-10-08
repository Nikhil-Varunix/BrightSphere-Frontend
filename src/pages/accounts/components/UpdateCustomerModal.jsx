// src/pages/admin/UpdateCustomerModal.jsx
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Modal } from "react-bootstrap";
import { toast } from "react-hot-toast";

const UpdateCustomerModal = ({ show, handleClose, customer, onUpdate }) => {
  if (!customer) return null;

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    contactPerson: Yup.string().required("Mobile is required"),
    city: Yup.string().required("City is required"),
    gst: Yup.string().required("GST No. is required"),
  });

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Update Customer</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{
          ...customer,
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          onUpdate(values);
          toast.success("Customer updated successfully");
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Modal.Body>
              {/* Customer Name */}
              <div className="form-floating mb-3">
                <Field name="name" className="form-control" placeholder="Customer Name" />
                <label>Customer Name</label>
                <ErrorMessage name="name" component="div" className="text-danger small" />
              </div>

              {/* Email */}
              <div className="form-floating mb-3">
                <Field name="email" className="form-control" placeholder="Email" />
                <label>Email</label>
                <ErrorMessage name="email" component="div" className="text-danger small" />
              </div>

              {/* Mobile */}
              <div className="form-floating mb-3">
                <Field name="contactPerson" className="form-control" placeholder="Mobile" />
                <label>Mobile</label>
                <ErrorMessage name="contactPerson" component="div" className="text-danger small" />
              </div>

              {/* City */}
              <div className="form-floating mb-3">
                <Field name="city" className="form-control" placeholder="City" />
                <label>Address</label>
                <ErrorMessage name="city" component="div" className="text-danger small" />
              </div>

              {/* GST No */}
              <div className="form-floating mb-3">
                <Field name="gst" className="form-control" placeholder="GST No." />
                <label>GST No.</label>
                <ErrorMessage name="gst" component="div" className="text-danger small" />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <button type="button" className="btn btn-secondary" onClick={handleClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                Update
              </button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default UpdateCustomerModal;
