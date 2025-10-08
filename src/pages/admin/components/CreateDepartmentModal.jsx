// CreateDepartmentModal.jsx
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Modal } from "react-bootstrap";
import { toast } from "react-hot-toast";

const CreateDepartmentModal = ({ show, handleClose, onSave }) => {
  // Fields for Department
  const fieldConfig = [
    { name: "departmentName", label: "Department Name", type: "text", required: true },
    {
      name: "headOfDepartment",
      label: "Head of Department",
      type: "select",
      required: true,
      options: ["Airi Sato", "Bradley Greer", "Ashton Cox"], // TODO: fetch from Employees API
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      required: true,
      options: ["Active", "Inactive"],
    },
  ];

  // Validation schema
  const validationSchema = Yup.object(
    fieldConfig.reduce((schema, field) => {
      if (field.required) schema[field.name] = Yup.string().required(`${field.label} is required`);
      return schema;
    }, {})
  );

  // Initial values
  const initialValues = fieldConfig.reduce((vals, field) => {
    vals[field.name] = "";
    return vals;
  }, {});

  // Submit handler
  const handleSubmit = (values) => {
    const newDepartment = {
      id: "D" + Date.now(), // temporary ID
      name: values.departmentName,
      head: values.headOfDepartment,
      employees: 0,
      createdBy: "Admin",
      createdAt: new Date().toISOString().split("T")[0],
      status: values.status,
    };
    onSave(newDepartment); // send to parent
    toast.success("Department created successfully ✅");
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create Department</Modal.Title>
      </Modal.Header>

      <Formik
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
                    <label className="form-label">{field.label}</label>
                    {field.type === "select" ? (
                      <Field as="select" name={field.name} className="form-control">
                        <option value="">Select</option>
                        {field.options.map((opt, idx) => (
                          <option value={opt} key={idx}>
                            {opt}
                          </option>
                        ))}
                      </Field>
                    ) : field.type === "textarea" ? (
                      <Field as="textarea" name={field.name} className="form-control" rows="3" />
                    ) : (
                      <Field type={field.type} name={field.name} className="form-control" />
                    )}
                    <ErrorMessage name={field.name} component="div" className="text-danger" />
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
                Create & Save
              </button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default CreateDepartmentModal;
