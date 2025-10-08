// UpdateOfficeTimingModal.jsx
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Modal } from "react-bootstrap";
import { toast } from "react-hot-toast";

const UpdateOfficeTimingModal = ({ show, handleClose, timing, onUpdate }) => {
  if (!timing) return null;

  // Fields for Office Timing
  const fieldConfig = [
    { name: "startTime", label: "Start Time", type: "time", required: true },
    { name: "endTime", label: "End Time", type: "time", required: true },
    { name: "lunchStart", label: "Lunch Start", type: "time", required: false },
    { name: "lunchEnd", label: "Lunch End", type: "time", required: false },
    { name: "firstBreak", label: "First Break", type: "text", required: false },
    { name: "secondBreak", label: "Second Break", type: "text", required: false },
    { name: "totalHours", label: "Total Hours", type: "text", required: false },
  ];

  // Validation schema
  const validationSchema = Yup.object(
    fieldConfig.reduce((schema, field) => {
      if (field.required) schema[field.name] = Yup.string().required(`${field.label} is required`);
      return schema;
    }, {})
  );

  // Prefill with existing timing values
  const initialValues = fieldConfig.reduce((vals, field) => {
    vals[field.name] = timing[field.name] || "";
    return vals;
  }, {});

  // Submit handler
  const handleSubmit = (values) => {
    const updatedTiming = {
      ...timing,
      ...values,
    };
    onUpdate(updatedTiming);
    toast.success("Office timing updated successfully ✨");
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Office Timing</Modal.Title>
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
                {fieldConfig.map((field) => (
                  <div className="col-12" key={field.name}>
                    <div className="form-floating">
                      <Field
                        type={field.type}
                        name={field.name}
                        className="form-control"
                        id={field.name}
                        placeholder={field.label}
                      />
                      <label htmlFor={field.name}>
                        {field.label}
                      </label>
                    </div>
                    <ErrorMessage name={field.name} component="div" className="text-danger mt-1" />
                  </div>
                ))}
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

export default UpdateOfficeTimingModal;
