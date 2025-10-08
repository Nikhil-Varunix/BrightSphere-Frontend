// UpdateServiceModal.jsx
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Modal } from "react-bootstrap";
import { toast } from "react-hot-toast";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const ORG_ID = import.meta.env.VITE_ORG_ID;

const UpdateServiceModal = ({ show, handleClose, service, fetchServices }) => {
  if (!service) return null;

  const validationSchema = Yup.object({
    serviceName: Yup.string().required("Service Name is required"),
    status: Yup.string().required("Status is required"),
  });

  const initialValues = {
    serviceName: service.serviceName || "",
    status: service.status ? "true" : "false",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const token = localStorage.getItem("authToken");

      await axios.put(
        `${API_URL}/admin/service/update/${service._id}`,
        {
          serviceName: values.serviceName,
          status: values.status === "true",
          orgId: ORG_ID,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Service updated successfully ✨");
      fetchServices();
      handleClose();
    } catch (err) {
      console.error("Error updating service:", err.response?.data || err.message);
      toast.error("Error updating service");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Update Service</Modal.Title>
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
              {/* Service Name */}
              <div className="form-floating mb-3">
                <Field
                  type="text"
                  name="serviceName"
                  id="serviceName"
                  className="form-control"
                  placeholder="Service Name"
                />
                <label htmlFor="serviceName">Service Name</label>
                <ErrorMessage
                  name="serviceName"
                  component="div"
                  className="text-danger mt-1"
                />
              </div>

              {/* Status */}
              <div className="form-floating mb-3">
                <Field
                  as="select"
                  name="status"
                  id="status"
                  className="form-select"
                  placeholder="Status"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </Field>
                <label htmlFor="status">Status</label>
                <ErrorMessage
                  name="status"
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
                disabled={isSubmitting}
              >
                Save Changes
              </button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default UpdateServiceModal;