import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

const initialValues = {
  fullName: "Satish Netha",
  fatherName: "Mr. Deepak",
  dob: "1994-03-12",
  gender: "Male",
  phone: "9876543210",
  email: "satish@gmail.com",
  aadhar: "1234 5678 9012",
  pan: "ABCDE1234F",
  maritalStatus: "Single",
  bloodGroup: "B+",
  emergencyPerson: "Rahul",
  emergencyContact: "9876543211",
  idProof: "Aadhar",
  city: "Hyderabad",
  state: "Telangana",
  pincode: "500032",
  country: "India",
  address: "Flat No. 204, Sunshine Residency, Gachibowli, Hyderabad, Telangana123, Gachibowli Road, Hyderabad"
};

const validationSchema = Yup.object({
  fullName: Yup.string()
    .required("Full Name is required")
    .min(3, "Must be at least 3 characters"),
  fatherName: Yup.string().required("Father's Name is required"),
  dob: Yup.date().required("Date of Birth is required").max(new Date(), "DOB cannot be in the future"),
  gender: Yup.string().required("Gender is required"),
  phone: Yup.string().required("Phone number is required").matches(/^[6-9]\d{9}$/, "Invalid phone number"),
  email: Yup.string().required("Email is required").email("Invalid email address"),
  aadhar: Yup.string().required("Aadhar number is required").matches(/^\d{12}$/, "Aadhar must be 12 digits"),
  pan: Yup.string().required("PAN number is required").matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format"),
  maritalStatus: Yup.string().required("Marital status is required"),
  bloodGroup: Yup.string().required("Blood group is required"),
  emergencyPerson: Yup.string().required("Emergency contact person is required"),
  emergencyContact: Yup.string().required("Emergency contact number is required").matches(/^[6-9]\d{9}$/, "Invalid contact number"),
  idProof: Yup.string().required("ID proof is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  pincode: Yup.string().required("Pin code is required").matches(/^\d{6}$/, "Pin code must be 6 digits"),
  country: Yup.string().required("Country is required"),
  address: Yup.string().required("Address is required").min(10, "Address must be at least 10 characters"),
});

const UpdateUser = () => {
  const handleSubmit = (values) => {
    console.log(values);
    //emoji in toast
  toast.success("User updated successfully");
  };

  return (
    <div className="row">
      <div className="col-sm-12">
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {() => (
            <Form>
              <div className="card mb-0">
                <div className="card-header">
                      <h5>Update User Information</h5>
                    </div>
                <div className="card-body">
                  <div className="row">

                    {/** Helper Field Component Generator */}
                    {[
                      { name: "fullName", label: "Full Name", type: "text" },
                      { name: "fatherName", label: "Father's Name", type: "text" },
                      { name: "dob", label: "Date of Birth", type: "date" },
                      { name: "phone", label: "Phone Number", type: "tel" },
                      { name: "email", label: "Email", type: "email" },
                      { name: "aadhar", label: "Aadhar Number", type: "text" },
                      { name: "pan", label: "PAN Number", type: "text" },
                      { name: "emergencyPerson", label: "Emergency Contact Person", type: "text" },
                      { name: "emergencyContact", label: "Emergency Contact Number", type: "tel" },
                      { name: "city", label: "City", type: "text" },
                      { name: "state", label: "State", type: "text" },
                      { name: "pincode", label: "Pin Code", type: "text" },
                      { name: "country", label: "Country", type: "text" },
                    ].map((field, i) => (
                      <div className="col-sm-6 col-xl-4" key={i}>
                        <div className="form-floating mb-3">
                          <Field
                            type={field.type}
                            name={field.name}
                            className="form-control"
                            id={field.name}
                            placeholder={field.label}
                          />
                          <label htmlFor={field.name}>{field.label}</label>
                          <ErrorMessage name={field.name} component="div" className="text-danger small mt-1" />
                        </div>
                      </div>
                    ))}

                    {/** Select Fields */}
                    {[
                      {
                        name: "gender",
                        label: "Gender",
                        options: ["", "Male", "Female", "Other"]
                      },
                      {
                        name: "maritalStatus",
                        label: "Marital Status",
                        options: ["", "Single", "Married"]
                      },
                      {
                        name: "bloodGroup",
                        label: "Blood Group",
                        options: ["", "A+", "A−", "B+", "B−", "O+", "O−", "AB+", "AB−"]
                      },
                      {
                        name: "idProof",
                        label: "ID Proof Type",
                        options: ["", "Voter ID", "Passport", "Driving License", "Aadhar"]
                      }
                    ].map((select, i) => (
                      <div className="col-sm-6 col-xl-4" key={`select-${i}`}>
                        <div className="form-floating mb-3">
                          <Field
                            as="select"
                            name={select.name}
                            id={select.name}
                            className="form-select"
                          >
                            {select.options.map((opt, idx) => (
                              <option key={idx} value={opt}>
                                {opt || `Select ${select.label}`}
                              </option>
                            ))}
                          </Field>
                          <label htmlFor={select.name}>{select.label}</label>
                          <ErrorMessage name={select.name} component="div" className="text-danger small mt-1" />
                        </div>
                      </div>
                    ))}

                    {/** Address (Textarea) */}
                    <div className="col-12">
                      <div className="form-floating mb-3">
                        <Field
                          as="textarea"
                          name="address"
                          id="address"
                          className="form-control"
                          placeholder="Full Address"
                          style={{ height: "100px" }}
                        />
                        <label htmlFor="address">Full Address</label>
                        <ErrorMessage name="address" component="div" className="text-danger small mt-1" />
                      </div>
                    </div>

                    {/** Submit Button */}
                    <div className="col-12 text-end">
                      <button type="submit" className="btn btn-primary px-4">
                        Update
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UpdateUser;
