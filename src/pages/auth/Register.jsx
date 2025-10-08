import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";

const Register = () => {
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    mobile: Yup.string()
      .matches(/^[0-9]{10}$/, "Must be 10 digits")
      .required("Mobile number is required"),
    password: Yup.string().min(8, "Minimum 8 characters").required("Password is required"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      await axios.post("/api/register", values); // replace with your endpoint
      toast.success("Registration successful!");
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-main v1">
      <div className="auth-wrapper">
        <div className="auth-form">
          <div className="card my-5 ">
            <div className="card-body">
              <div className="text-center mb-4 bg-secondary-subtle rounded py-2">
                <img
                  src="/assets/images/logo-dark.png"
                  alt="Register"
                  className="img-fluid mb-3 w-50  p-3 rounded"
                />
                <h4 className="f-w-500 mb-1">Employee Registration</h4>
                <p className="mb-3">
                  Already have an account?{" "}
                  <a href="/login" className="link-primary ms-1">
                    Login
                  </a>
                </p>
              </div>

              <Formik
                initialValues={{
                  username: "",
                  email: "",
                  mobile: "",
                  password: "",
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <div className="form-floating mb-3">
                      <Field
                        type="text"
                        name="username"
                        id="floatingUsername"
                        className="form-control"
                        placeholder="Username"
                      />
                      <label htmlFor="floatingUsername">Username</label>
                      <ErrorMessage
                        name="username"
                        component="div"
                        className="text-danger small mt-1"
                      />
                    </div>

                    <div className="form-floating mb-3">
                      <Field
                        type="email"
                        name="email"
                        id="floatingEmail"
                        className="form-control"
                        placeholder="Email Address"
                      />
                      <label htmlFor="floatingEmail">Email</label>
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-danger small mt-1"
                      />
                    </div>

                    <div className="form-floating mb-3">
                      <Field
                        type="tel"
                        name="mobile"
                        id="floatingMobile"
                        className="form-control"
                        placeholder="Mobile Number"
                      />
                      <label htmlFor="floatingMobile">Mobile Number</label>
                      <ErrorMessage
                        name="mobile"
                        component="div"
                        className="text-danger small mt-1"
                      />
                    </div>

                    <div className="form-floating mb-3">
                      <Field
                        type="password"
                        name="password"
                        id="floatingPassword"
                        className="form-control"
                        placeholder="Password"
                      />
                      <label htmlFor="floatingPassword">Password</label>
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-danger small mt-1"
                      />
                    </div>

                    <div className="d-grid mt-4">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting || loading}
                      >
                        {loading ? "Registering..." : "Register"}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
