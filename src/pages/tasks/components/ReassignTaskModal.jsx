import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Modal } from "react-bootstrap";
import toast from "react-hot-toast";

const ReassignTaskModal = ({ show, handleClose, taskData, onReassign }) => {
  // Sample agent list – replace with API data if needed
  const agents = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Michael Johnson" },
    { id: 4, name: "Sarah Wilson" },
  ];

  // Validation schema
  const validationSchema = Yup.object({
    assignedTo: Yup.string().required("Please select an agent"),
  });

  const initialValues = {
    assignedTo: taskData?.assignedTo || "",
  };

  // Handle form submission
  const handleSubmit = (values) => {
    if (!values.assignedTo) {
      toast.error("⚠️ Please select an agent before confirming.");
      return;
    }
    onReassign({ ...taskData, ...values });
    toast.success(` Task successfully reassigned to ${values.assignedTo}`);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="md">
      <Modal.Header closeButton>
        <Modal.Title>Reassign Task</Modal.Title>
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
                <label className="form-label">Select Agent</label>
                <Field as="select" name="assignedTo" className="form-select">
                  <option value="">-- Select Agent --</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.name}>
                      {agent.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="assignedTo"
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
                Confirm Reassign
              </button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default ReassignTaskModal;
