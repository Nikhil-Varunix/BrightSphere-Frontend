import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup"; // for validation
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Validation schema
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    try {
      await login(values.email, values.password); 
      // navigate("/"); 
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-main v2">
      <div className="bg-overlay bg-dark" />
      <div className="auth-wrapper">
        {/* --- Left Side Content --- */}
        <div className="auth-sidecontent">
          <div className="auth-sidefooter">
            <img
              src="../assets/images/logo.png"
              className="img-brand img-fluid w-25"
              alt="logo"
            />
            <hr className="mb-3 mt-4" />
            <div className="row">
              <div className="col my-1">
                <p className="m-0">
                  Developed by {" "}
                  <a  className="text-primary text-decoration-underline"
                    href="https://varunix.in/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    varunix
                  </a>
                </p>
              </div>
              <div className="col-auto my-1">
                <ul className="list-inline footer-link mb-0">
                  <li className="list-inline-item">
                    <a href="../index.html">Home</a>
                  </li>
                  {/* <li className="list-inline-item">
                    <a
                      href="https://pcoded.gitbook.io/light-able/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Documentation
                    </a>
                  </li> */}
                  <li className="list-inline-item">
                    <a
                      href="https://phoenixcoded.support-hub.io/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Support
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* --- Login Form --- */}
        <div className="auth-form">
          <div className="card my-5 mx-3">
            <div className="card-body">
              <h4 className="f-w-500 mb-1">Login with your email</h4>
              <p className="mb-3">
                Don’t have an Account?{" "}
                <a href="../pages/register-v2.html" className="link-primary ms-1">
                  Create Account
                </a>
              </p>

              <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form>
                    {/* Email */}
                    <div className="mb-3">
                      <Field
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="Email Address"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-danger small"
                      />
                    </div>

                    {/* Password */}
                    <div className="mb-3">
                      <Field
                        type="password"
                        name="password"
                        className="form-control"
                        placeholder="Password"
                      />
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-danger small"
                      />
                    </div>

                    <div className="d-flex mt-1 justify-content-between align-items-center">
                      <div className="form-check">
                        <input
                          className="form-check-input input-primary"
                          type="checkbox"
                          id="customCheckc1"
                        />
                        <label
                          className="form-check-label text-muted"
                          htmlFor="customCheckc1"
                        >
                          Remember me?
                        </label>
                      </div>
                      <a href="../pages/forgot-password-v2.html">
                        <h6 className="text-secondary f-w-400 mb-0">
                          Forgot Password?
                        </h6>
                      </a>
                    </div>

                    <div className="d-grid mt-4">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting || loading}
                      >
                        {loading ? "Logging in..." : "Login"}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>

              {/* <div className="saprator my-3">
                <span>Or continue with</span>
              </div>

              <div className="text-center">
                <ul className="list-inline mx-auto mt-3 mb-0">
                  <li className="list-inline-item">
                    <a
                      href="https://www.facebook.com/"
                      className="avtar avtar-s rounded-circle bg-facebook"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <i className="fab fa-facebook-f text-white" />
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a
                      href="https://twitter.com/"
                      className="avtar avtar-s rounded-circle bg-twitter"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <i className="fab fa-twitter text-white" />
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a
                      href="https://myaccount.google.com/"
                      className="avtar avtar-s rounded-circle bg-googleplus"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <i className="fab fa-google text-white" />
                    </a>
                  </li>
                </ul>
              </div> */}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
