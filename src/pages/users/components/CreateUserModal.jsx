import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Modal } from 'react-bootstrap';

const userSchema = Yup.object().shape({
    fullName: Yup.string().required('Full name is required'),
    employeeId: Yup.string().required('Employee ID is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().matches(/^\d{10}$/, 'Enter a valid 10-digit number'),
    role: Yup.string().required('Role is required'),
    location: Yup.string().required('Location is required'),
    username: Yup.string().required('Username is required'),
    password: Yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
    status: Yup.string().required('Status is required'),
    pan: Yup.string()
        .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format')
        .required('PAN is required'),
    aadhaar: Yup.string()
        .matches(/^\d{12}$/, 'Aadhaar must be 12 digits')
        .required('Aadhaar is required'),
    drivingLicense: Yup.string()
        .matches(/^[A-Z0-9-]{5,20}$/, 'Invalid Driving License Number')
        .required('Driving License is required'),
});

const CreateUserModal = ({ show, handleClose }) => {
    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Create New User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    initialValues={{
                        fullName: '',
                        employeeId: '',
                        email: '',
                        phone: '',
                        role: '',
                        department: '',
                        location: '',
                        username: '',
                        password: '',
                        status: '',
                        photo: null,
                        pan: '',
                        aadhaar: '',
                        drivingLicense: '',
                    }}
                    validationSchema={userSchema}
                    onSubmit={(values) => {
                        console.log(values);
                        handleClose(); // close modal after submit
                    }}
                >
                    {({ setFieldValue }) => (
                        <Form>
                            <div className="row">
                                {/* Full Name */}
                                <div className="col-md-6 mb-3">
                                    <div className="form-floating">
                                        <Field
                                            type="text"
                                            name="fullName"
                                            className="form-control"
                                            placeholder="Full Name"
                                        />
                                        <label htmlFor="fullName">User Name</label>
                                    </div>
                                    <ErrorMessage name="fullName" component="div" className="text-danger" />
                                </div>

                                {/* Email */}
                                <div className="col-md-6 mb-3">
                                    <div className="form-floating">
                                        <Field
                                            type="email"
                                            name="email"
                                            className="form-control"
                                            placeholder="Email"
                                        />
                                        <label htmlFor="email">Email</label>
                                    </div>
                                    <ErrorMessage name="email" component="div" className="text-danger" />
                                </div>

                                {/* Phone Number */}
                                <div className="col-md-6 mb-3">
                                    <div className="form-floating">
                                        <Field
                                            type="tel"
                                            name="phone"
                                            className="form-control"
                                            placeholder="Phone Number"
                                        />
                                        <label htmlFor="phone">Mobile</label>
                                    </div>
                                    <ErrorMessage name="phone" component="div" className="text-danger" />
                                </div>

                                {/* Department */}
                                <div className="col-md-6 mb-3">
                                    <div className="form-floating">
                                        <Field
                                            type="text"
                                            name="department"
                                            className="form-control"
                                            placeholder="Department"
                                        />
                                        <label htmlFor="department">Department</label>
                                    </div>
                                    <ErrorMessage name="department" component="div" className="text-danger" />
                                </div>

                                {/* Role */}
                                <div className="col-md-6 mb-3">
                                    <div className="form-floating">
                                        <Field
                                            type="text"
                                            name="role"
                                            className="form-control"
                                            placeholder="Role/Designation"
                                        />
                                        <label htmlFor="role">Role/Designation</label>
                                    </div>
                                    <ErrorMessage name="role" component="div" className="text-danger" />
                                </div>

                                {/* PAN Number */}
                                <div className="col-md-6 mb-3">
                                    <div className="form-floating">
                                        <Field
                                            type="text"
                                            name="pan"
                                            className="form-control"
                                            placeholder="PAN Number"
                                        />
                                        <label htmlFor="pan">PAN Number</label>
                                    </div>
                                    <ErrorMessage name="pan" component="div" className="text-danger" />
                                </div>

                                {/* Aadhaar Number */}
                                <div className="col-md-6 mb-3">
                                    <div className="form-floating">
                                        <Field
                                            type="text"
                                            name="aadhaar"
                                            className="form-control"
                                            placeholder="Aadhaar Number"
                                        />
                                        <label htmlFor="aadhaar">Aadhaar Number</label>
                                    </div>
                                    <ErrorMessage name="aadhaar" component="div" className="text-danger" />
                                </div>

                                {/* Driving License */}
                                <div className="col-md-6 mb-3">
                                    <div className="form-floating">
                                        <Field
                                            type="text"
                                            name="drivingLicense"
                                            className="form-control"
                                            placeholder="Driving License Number"
                                        />
                                        <label htmlFor="drivingLicense">Driving License Number</label>
                                    </div>
                                    <ErrorMessage name="drivingLicense" component="div" className="text-danger" />
                                </div>

                                {/* Location */}
                                <div className="col-md-6 mb-3">
                                    <div className="form-floating">
                                        <Field
                                            type="text"
                                            name="location"
                                            className="form-control"
                                            placeholder="Location"
                                        />
                                        <label htmlFor="location">Address</label>
                                    </div>
                                    <ErrorMessage name="location" component="div" className="text-danger" />
                                </div>

                                {/* Status */}
                                <div className="col-md-6 mb-3">
                                    <div className="form-floating">
                                        <Field
                                            as="select"
                                            name="status"
                                            className="form-select"
                                            placeholder="Status"
                                        >
                                            <option value="">Select status</option>
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </Field>
                                        <label htmlFor="status">Status</label>
                                    </div>
                                    <ErrorMessage name="status" component="div" className="text-danger" />
                                </div>

                                {/* Upload Photo */}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Upload Photo </label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        onChange={(e) => setFieldValue('photo', e.currentTarget.files[0])}
                                    />
                                </div>

                                {/* Submit */}
                                <div className="col-12 text-end">
                                    <button type="submit" className="btn btn-primary mt-3">
                                        Create User
                                    </button>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Modal.Body>
        </Modal>
    );
};

export default CreateUserModal;
