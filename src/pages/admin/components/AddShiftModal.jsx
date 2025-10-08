import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Modal } from "react-bootstrap";
import { toast } from "react-hot-toast";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("authToken");

const AddShiftModal = ({ show, handleClose, onSave }) => {
  // Validation schema
  const validationSchema = Yup.object({
    shiftName: Yup.string().required("Shift Name is required"),
    startTime: Yup.string().required("Start Time is required"),
    endTime: Yup.string().required("End Time is required"),
    lunchStart: Yup.string().required("Lunch Start is required"),
    lunchEnd: Yup.string().required("Lunch End is required"),
    firstBreak: Yup.string().required("First Break is required"),
    secondBreak: Yup.string().required("Second Break is required"),
    totalHours: Yup.number().required("Total Hours is required"),
  });

  // Initial form values
  const initialValues = {
    shiftName: "",
    startTime: "",
    endTime: "",
    lunchStart: "",
    lunchEnd: "",
    firstBreak: "",
    secondBreak: "",
    totalHours: "",
  };

  // Submit handler
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const res = await axios.post(`${API_URL}/admin/shifts/create`, values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("✅ Shift added successfully");
      handleClose();
      onSave(res.data.shift); // assuming backend returns created shift
    } catch (err) {
      console.error(err);
      toast.error("Failed to add shift");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add Shift</Modal.Title>
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
                {/* Shift Name */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field
                      type="text"
                      name="shiftName"
                      className="form-control"
                      placeholder="Shift Name"
                    />
                    <label>Shift Name</label>
                  </div>
                  <ErrorMessage
                    name="shiftName"
                    component="div"
                    className="text-danger"
                  />
                </div>

                {/* Start Time */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field
                      type="time"
                      name="startTime"
                      className="form-control"
                      placeholder="Start Time"
                    />
                    <label>Start Time</label>
                  </div>
                  <ErrorMessage
                    name="startTime"
                    component="div"
                    className="text-danger"
                  />
                </div>

                {/* End Time */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field
                      type="time"
                      name="endTime"
                      className="form-control"
                      placeholder="End Time"
                    />
                    <label>End Time</label>
                  </div>
                  <ErrorMessage
                    name="endTime"
                    component="div"
                    className="text-danger"
                  />
                </div>

                {/* Lunch Start */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field
                      type="time"
                      name="lunchStart"
                      className="form-control"
                      placeholder="Lunch Start"
                    />
                    <label>Lunch Start</label>
                  </div>
                  <ErrorMessage
                    name="lunchStart"
                    component="div"
                    className="text-danger"
                  />
                </div>

                {/* Lunch End */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field
                      type="time"
                      name="lunchEnd"
                      className="form-control"
                      placeholder="Lunch End"
                    />
                    <label>Lunch End</label>
                  </div>
                  <ErrorMessage
                    name="lunchEnd"
                    component="div"
                    className="text-danger"
                  />
                </div>

                {/* First Break */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field
                      type="time"
                      name="firstBreak"
                      className="form-control"
                      placeholder="First Break"
                    />
                    <label>First Break</label>
                  </div>
                  <ErrorMessage
                    name="firstBreak"
                    component="div"
                    className="text-danger"
                  />
                </div>

                {/* Second Break */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field
                      type="time"
                      name="secondBreak"
                      className="form-control"
                      placeholder="Second Break"
                    />
                    <label>Second Break</label>
                  </div>
                  <ErrorMessage
                    name="secondBreak"
                    component="div"
                    className="text-danger"
                  />
                </div>

                {/* Total Hours */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field
                      type="number"
                      name="totalHours"
                      className="form-control"
                      placeholder="Total Hours"
                    />
                    <label>Total Hours</label>
                  </div>
                  <ErrorMessage
                    name="totalHours"
                    component="div"
                    className="text-danger"
                  />
                </div>
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
                Save Shift
              </button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default AddShiftModal;
