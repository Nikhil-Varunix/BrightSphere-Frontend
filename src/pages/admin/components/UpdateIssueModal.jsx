// components/UpdateDesignationsModal.jsx
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Modal } from "react-bootstrap";
import { toast } from "react-hot-toast";

const UpdateIssueModal = ({ show, handleClose, designation, departments, onUpdate }) => {
  if (!designation) return null;

  // Validation schema
  const validationSchema = Yup.object({
    issue: Yup.string().required("Issue is required"),
    valume: Yup.string().required("Valume is required"),
    status: Yup.string().required("Status is required"),
  });

  // Initial form values with defaults
  const initialValues = {
    issue: designation.name || "Issue",   // fallback value
    valume: designation.valume || "Valume 1", // new field
    status: designation.status || "Active",      // fallback value
  };

  // Handle form submit
  const handleSubmit = (values) => {
    const updatedDesignation = {
      ...designation,
      name: values.issue,
      valume: values.valume,
      status: values.status,
    };

    onUpdate(updatedDesignation);
    toast.success("Designation updated successfully");
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update Issue</Modal.Title>
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
              {/* Issue */}
              <div className="mb-3">
                <label className="form-label">Issue</label>
                <Field type="text" name="issue" className="form-control" />
                <ErrorMessage name="issue" component="div" className="text-danger" />
              </div>

              {/* Valume */}
              <div className="mb-3">
                <label className="form-label">Valume</label>
                <Field type="text" name="valume" className="form-control" />
                <ErrorMessage name="valume" component="div" className="text-danger" />
              </div>

              {/* Status */}
              <div className="mb-3">
                <label className="form-label">Status</label>
                <Field as="select" name="status" className="form-select">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </Field>
                <ErrorMessage name="status" component="div" className="text-danger" />
              </div>
            </Modal.Body>

            <Modal.Footer>
              <button type="button" className="btn btn-secondary" onClick={handleClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                Save Changes
              </button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default UpdateIssueModal;
