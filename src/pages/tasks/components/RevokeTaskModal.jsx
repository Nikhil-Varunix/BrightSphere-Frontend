import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Modal } from "react-bootstrap";
import toast from "react-hot-toast";

const RevokeTaskModal = ({ show, handleClose, taskData, onRevoke }) => {
  const validationSchema = Yup.object({
    reason: Yup.string().required("Please provide a reason for revocation"),
  });

  const initialValues = { reason: "" };

 const handleSubmit = (values, { setSubmitting, resetForm }) => {
  if (!onRevoke || typeof onRevoke !== "function") {
    toast.error("⚠️ Revoke function not defined!");
    setSubmitting(false);
    return;
  }

  // Remove task immediately
  onRevoke({ ...taskData, revokeReason: values.reason });

  // Close modal
  handleClose();

  // Show toast
  toast.success("Task revoked successfully!", {
    duration: 2000,
  });

  resetForm();
  setSubmitting(false);
};


  return (
    <Modal show={show} onHide={handleClose} centered size="md">
      <Modal.Header closeButton>
        <Modal.Title>Revoke Task</Modal.Title>
      </Modal.Header>

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, isValid }) => (
          <Form>
            <Modal.Body>
              <div className="mb-3">
                <label className="form-label">Reason for Revoke</label>
                <Field
                  as="textarea"
                  name="reason"
                  className="form-control"
                  rows={3}
                  placeholder="Enter reason for revoking this task"
                />
                <ErrorMessage
                  name="reason"
                  component="div"
                  className="text-danger mt-1"
                />
              </div>
            </Modal.Body>

            <Modal.Footer>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting || !isValid}
              >
                Confirm Revoke
              </button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default RevokeTaskModal;
