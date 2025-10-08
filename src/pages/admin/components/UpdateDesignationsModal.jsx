// components/UpdateDesignationsModal.jsx
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Modal } from "react-bootstrap";
import { toast } from "react-hot-toast";

const UpdateDesignationsModal = ({ show, handleClose, designation, departments, onUpdate }) => {
  if (!designation) return null;

  // Validation schema
  const validationSchema = Yup.object({
    designationName: Yup.string().required("Designation name is required"),
    status: Yup.string().required("Status is required"),
  });

  // Initial form values
  const initialValues = {
    designationName: designation.name || "",
    status: designation.status || "Active",
  };

  // Handle form submit
  const handleSubmit = (values) => {
    const updatedDesignation = {
      ...designation,
      name: values.designationName,
      status: values.status,
    };

    onUpdate(updatedDesignation);
    toast.success("Designation updated successfully");
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update Valume</Modal.Title>
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
              {/* Designation Name */}
              <div className="mb-3">
                <label className="form-label">Valume Name</label>
                <Field type="text" name="designationName" className="form-control" />
                <ErrorMessage name="designationName" component="div" className="text-danger" />
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

              {/* Read-only fields */}
              {/* <div className="mb-3">
                <label className="form-label">Created By</label>
                <input
                  type="text"
                  className="form-control"
                  value={designation.createdBy || "--"}
                  disabled
                />
              </div> */}

              {/* <div className="mb-3">
                <label className="form-label">Created At</label>
                <input
                  type="text"
                  className="form-control"
                  value={designation.createdAt || "--"}
                  disabled
                />
              </div> */}
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

export default UpdateDesignationsModal;
