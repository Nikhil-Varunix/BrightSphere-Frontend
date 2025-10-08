// UpdateDepartmentModal.jsx
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Modal } from "react-bootstrap";
import { toast } from "react-hot-toast";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const ORG_ID = import.meta.env.VITE_ORG_ID;

const UpdateDepartmentModal = ({ show, handleClose, department, fetchDepartments }) => {
  if (!department) return null;

  const validationSchema = Yup.object({
    departmentName: Yup.string().required("Department Name is required"),
    status: Yup.string().required("Status is required"),
  });

  const initialValues = {
    departmentName: department.deptName || "",
    status: department.status ? "true" : "false",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const token = localStorage.getItem("authToken");

      await axios.put(
        `${API_URL}/admin/department/update/${department._id}`,
        {
          deptName: values.departmentName,
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

      toast.success("Department updated successfully ✨");
      fetchDepartments();
      handleClose();
    } catch (err) {
      console.error("Error updating department:", err.response?.data || err.message);
      toast.error("Error updating department");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Update Department</Modal.Title>
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
              {/* Department Name */}
              <div className="form-floating mb-3">
                <Field
                  type="text"
                  name="departmentName"
                  id="departmentName"
                  className="form-control"
                  placeholder="Department Name"
                />
                <label htmlFor="departmentName">Department Name</label>
                <ErrorMessage
                  name="departmentName"
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

export default UpdateDepartmentModal;