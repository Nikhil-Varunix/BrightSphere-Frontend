// UpdateTask.jsx
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Modal, Button } from "react-bootstrap";

const UpdateTask = ({ show, handleClose, taskData }) => {
  if (!show) return null;

  const STATUS_OPTIONS = ["Open", "In Progress", "Pending", "Completed", "Closed"];
  const PRIORITY_OPTIONS = ["Low", "Medium", "High"];
  const ASSIGNEE_OPTIONS = ["Satish Netha", "John", "Airi Satou", "Bradley Greer"];
  const ASSIGNED_BY_OPTIONS = ["Nikhil Shetty", "Jane Smith", "Robert Fox"];

  const validationSchema = Yup.object({
    service: Yup.string().required("Task / Service is required"),
    customer: Yup.string().required("Customer Name is required"),
    mobile: Yup.string().required("Mobile is required"),
    assignedTo: Yup.string().required("Assigned To is required"),
    assignedBy: Yup.string().required("Assigned By is required"),
    assignedDate: Yup.string().required("Assigned Date is required"),
    dueDate: Yup.string().required("Due Date is required"),
    status: Yup.string().required("Status is required"),
    priority: Yup.string().required("Priority is required"),
  });

  // ✅ Default data (for edit modal)
  const defaultTask = {
    service: "Washing Machine Operation",
    customer: "John",
    mobile: "9876543210",
    assignedTo: "Satish Netha",
    assignedBy: "Nikhil Shetty",
    assignedDate: "2025-09-09",
    dueDate: "09/12/2025",
    status: "Pending",
    priority: "Medium",
  };

  const initialValues = {
    service: taskData?.service || defaultTask.service,
    customer: taskData?.customer || defaultTask.customer,
    mobile: taskData?.mobile || defaultTask.mobile,
    assignedTo: taskData?.assignedTo || defaultTask.assignedTo,
    assignedBy: taskData?.assignedBy || defaultTask.assignedBy,
    assignedDate: taskData?.assignedDate || defaultTask.assignedDate,
    dueDate: taskData?.dueDate || defaultTask.dueDate,
    status: taskData?.status || defaultTask.status,
    priority: taskData?.priority || defaultTask.priority,
  };

  const handleSubmit = (values) => {
    console.log("Updated Task Data:", values);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Edit Task / Service</Modal.Title>
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
                {/* Task / Service */}
                <div className="col-md-6 form-floating">
                  <Field
                    name="service"
                    type="text"
                    className="form-control"
                    id="service"
                    placeholder="Task / Service"
                  />
                  <label htmlFor="service">Task / Service</label>
                  <ErrorMessage name="service" component="div" className="text-danger mt-1" />
                </div>

                {/* Customer Name */}
                <div className="col-md-6 form-floating">
                  <Field
                    name="customer"
                    type="text"
                    className="form-control"
                    id="customer"
                    placeholder="Customer Name"
                  />
                  <label htmlFor="customer">Customer Name</label>
                  <ErrorMessage name="customer" component="div" className="text-danger mt-1" />
                </div>

                {/* Mobile */}
                <div className="col-md-6 form-floating">
                  <Field
                    name="mobile"
                    type="text"
                    className="form-control"
                    id="mobile"
                    placeholder="Mobile"
                  />
                  <label htmlFor="mobile">Mobile</label>
                  <ErrorMessage name="mobile" component="div" className="text-danger mt-1" />
                </div>

                {/* Assigned To */}
                <div className="col-md-6 form-floating">
                  <Field as="select" name="assignedTo" className="form-select" id="assignedTo">
                    <option value="">Select Assignee</option>
                    {ASSIGNEE_OPTIONS.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </Field>
                  <label htmlFor="assignedTo">Assigned To</label>
                  <ErrorMessage name="assignedTo" component="div" className="text-danger mt-1" />
                </div>

                {/* Assigned By */}
                <div className="col-md-6 form-floating">
                  <Field as="select" name="assignedBy" className="form-select" id="assignedBy">
                    <option value="">Select Assigned By</option>
                    {ASSIGNED_BY_OPTIONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </Field>
                  <label htmlFor="assignedBy">Assigned By</label>
                  <ErrorMessage name="assignedBy" component="div" className="text-danger mt-1" />
                </div>

                {/* Assigned Date */}
                <div className="col-md-6 form-floating">
                  <Field
                    name="assignedDate"
                    type="date"
                    className="form-control"
                    id="assignedDate"
                  />
                  <label htmlFor="assignedDate">Assigned Date</label>
                  <ErrorMessage name="assignedDate" component="div" className="text-danger mt-1" />
                </div>

                {/* Due Date */}
                <div className="col-md-6 form-floating">
                  <Field
                    name="dueDate"
                    type="text"
                    className="form-control"
                    id="dueDate"
                    placeholder="Due Date"
                  />
                  <label htmlFor="dueDate">Due Date</label>
                  <ErrorMessage name="dueDate" component="div" className="text-danger mt-1" />
                </div>

                {/* Status */}
                <div className="col-md-6 form-floating">
                  <Field as="select" name="status" className="form-select" id="status">
                    <option value="">Select Status</option>
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </Field>
                  <label htmlFor="status">Status</label>
                  <ErrorMessage name="status" component="div" className="text-danger mt-1" />
                </div>

                {/* Priority */}
                <div className="col-md-6 form-floating">
                  <Field as="select" name="priority" className="form-select" id="priority">
                    <option value="">Select Priority</option>
                    {PRIORITY_OPTIONS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </Field>
                  <label htmlFor="priority">Priority</label>
                  <ErrorMessage name="priority" component="div" className="text-danger mt-1" />
                </div>
              </div>
            </Modal.Body>

            <Modal.Footer>
              <Button type="button" variant="secondary" onClick={handleClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                Update & Save
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default UpdateTask;
