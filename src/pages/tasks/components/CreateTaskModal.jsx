import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Modal } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-hot-toast";

const CreateTaskModal = ({ show, handleClose, fetchTasks }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const orgId = import.meta.env.VITE_ORG_ID;
  const token = localStorage.getItem("authToken");

  const [services, setServices] = useState([]);
  const [users, setUsers] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch services
  const fetchServices = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/service/get/all`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      setServices(res.data.data);
    } catch (err) {
      console.error("Failed to fetch services:", err);
      toast.error("Failed to fetch services");
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userOptions = res.data.data.map((user) => ({
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
      }));

      setUsers(userOptions);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchServices();
    fetchUsers();
  }, []);

  // Validation schema
  const validationSchema = Yup.object({
    taskName: Yup.string().required("Task Name is required"),
    customerName: Yup.string().required("Customer Name is required"),
    customerNumber: Yup.string()
      .required("Customer Number is required")
      .matches(/^\d{10}$/, "Must be exactly 10 digits"),
    customerEmail: Yup.string()
      .email("Invalid email format")
      .required("Customer Email is required"),
    aadhaar: Yup.string()
      .matches(/^\d{12}$/, "Aadhaar must be 12 digits")
      .nullable(),
    pan: Yup.string()
      .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format")
      .nullable(),
    drivingLicense: Yup.string().nullable(),
    service: Yup.string().required("Service is required"),
    priority: Yup.string().required("Priority is required"),
    sla: Yup.string().required("SLA is required"),
    assignedTo: Yup.string().required("Assign To is required"),
    assignedBy: Yup.string().required("Assign By is required"),
    description: Yup.string(),
    attachments: Yup.mixed(),
  });

  // Initial values
  const initialValues = {
    taskName: "",
    customerName: "",
    customerNumber: "",
    customerEmail: "",
    aadhaar: "",
    pan: "",
    drivingLicense: "",
    service: "",
    priority: "",
    orgId: orgId,
    sla: "3 hrs",
    assignedTo: "",
    assignedBy: user ? user._id : "",
    description: "",
    attachments: [],
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      // Required fields
      formData.append("taskName", values.taskName);
      formData.append("service", values.service);
      formData.append("customerName", values.customerName);
      formData.append("customerNumber", values.customerNumber);
      formData.append("customerEmail", values.customerEmail);
      formData.append("priority", values.priority);
      formData.append("sla", values.sla);
      formData.append("assignedTo", values.assignedTo);
      formData.append("assignedBy", values.assignedBy);
      formData.append("orgId", values.orgId);

      // Optional fields
      if (values.aadhaar) formData.append("aadhaar", values.aadhaar);
      if (values.pan) formData.append("pan", values.pan);
      if (values.drivingLicense) formData.append("drivingLicense", values.drivingLicense);
      if (values.description) formData.append("description", values.description);
      if (values.attachments && values.attachments.length > 0) {
        values.attachments.forEach((file) => formData.append("attachments", file));
      }

      await axios.post(`${API_URL}/tasks/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      handleClose();
      toast.success("Task created successfully");
      fetchTasks();
    } catch (err) {
      console.error("Failed to create task:", err);
      toast.error("Failed to create task");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Create Task</Modal.Title>
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
                {/* Task Name */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field type="text" name="taskName" className="form-control" placeholder="Task Name" />
                    <label>
                      Task Name <span className="text-danger">*</span>
                    </label>
                  </div>
                  <ErrorMessage name="taskName" component="div" className="text-danger" />
                </div>

                {/* Service */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field as="select" name="service" className="form-select">
                      <option value="">Select Service</option>
                      {services.map((service) => (
                        <option key={service._id} value={service._id}>{service.serviceName}</option>
                      ))}
                    </Field>
                    <label>
                      Service <span className="text-danger">*</span>
                    </label>
                  </div>
                  <ErrorMessage name="service" component="div" className="text-danger" />
                </div>

                {/* Customer Name */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field type="text" name="customerName" className="form-control" placeholder="Customer Name" />
                    <label>
                      Customer Name <span className="text-danger">*</span>
                    </label>
                  </div>
                  <ErrorMessage name="customerName" component="div" className="text-danger" />
                </div>

                {/* Customer Number */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field type="text" name="customerNumber" className="form-control" placeholder="Customer Number" />
                    <label>
                      Customer Mobile <span className="text-danger">*</span>
                    </label>
                  </div>
                  <ErrorMessage name="customerNumber" component="div" className="text-danger" />
                </div>

                {/* Customer Email */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field type="email" name="customerEmail" className="form-control" placeholder="Customer Email" />
                    <label>
                      Customer Email <span className="text-danger">*</span>
                    </label>
                  </div>
                  <ErrorMessage name="customerEmail" component="div" className="text-danger" />
                </div>

                {/* Aadhaar */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field type="text" name="aadhaar" className="form-control" placeholder="Aadhaar Number" />
                    <label>Aadhaar Number</label>
                  </div>
                  <ErrorMessage name="aadhaar" component="div" className="text-danger" />
                </div>

                {/* PAN */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field type="text" name="pan" className="form-control" placeholder="PAN Number" />
                    <label>PAN Number</label>
                  </div>
                  <ErrorMessage name="pan" component="div" className="text-danger" />
                </div>

                {/* Driving License */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field type="text" name="drivingLicense" className="form-control" placeholder="Driving License" />
                    <label>Driving License</label>
                  </div>
                  <ErrorMessage name="drivingLicense" component="div" className="text-danger" />
                </div>

                {/* Assign To */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field as="select" name="assignedTo" className="form-select">
                      <option value="">Assign To</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                      ))}
                    </Field>
                    <label>
                      Assign To <span className="text-danger">*</span>
                    </label>
                  </div>
                  <ErrorMessage name="assignedTo" component="div" className="text-danger" />
                </div>

                {/* Assign By */}
                {/* <div className="col-md-6">
                  <div className="form-floating">
                    <Field as="select" name="assignedBy" className="form-select">
                      <option value="">Assign By</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                      ))}
                    </Field>
                    <label>
                      Assign By <span className="text-danger">*</span>
                    </label>
                  </div>
                  <ErrorMessage name="assignedBy" component="div" className="text-danger" />
                </div> */}

                {/* Priority */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field as="select" name="priority" className="form-select">
                      <option value="">Select Priority</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </Field>
                    <label>
                      Priority <span className="trt-danger">*</span>
                    </label>
                  </div>
                  <ErrorMessage name="priority" component="div" className="text-danger" />
                </div>

                {/* SLA */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field type="text" name="sla" className="form-control" placeholder="SLA" />
                    <label>
                      SLA <span className="text-danger">*</span>
                    </label>
                  </div>
                  <ErrorMessage name="sla" component="div" className="text-danger" />
                </div>

                {/* Description */}
                <div className="col-12">
                  <div className="form-floating">
                    <Field as="textarea" name="description" className="form-control" placeholder="Description" style={{ height: "100px" }} />
                    <label>Description</label>
                  </div>
                  <ErrorMessage name="description" component="div" className="text-danger" />
                </div>

                {/* Attachments */}
                <div className="col-12">
                  <div className="form-floating">
                    <Field
                      name="attachments"
                      render={({ form }) => (
                        <input
                          type="file"
                          className="form-control"
                          multiple
                          onChange={(event) => {
                            const files = Array.from(event.currentTarget.files);
                            form.setFieldValue("attachments", files);
                          }}
                        />
                      )}
                    />
                    <label className="form-label">Attachments</label>
                  </div>
                  <ErrorMessage name="attachments" component="div" className="text-danger" />
                </div>
              </div>
            </Modal.Body>

            <Modal.Footer>
              <button type="button" className="btn btn-secondary" onClick={handleClose} disabled={isSubmitting}>
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

export default CreateTaskModal;
