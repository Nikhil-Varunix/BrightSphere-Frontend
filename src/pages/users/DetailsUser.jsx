import BreadCrumb from "../../components/BreadCrumb"
import UpdateUser from "./components/UpdateUser";
import PasswordForm from "./components/PasswordForm";
import { Link } from "react-router-dom";
import AssetTable from "./components/AssetTable";

const DetailsUser = () => {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <BreadCrumb subLabel="Users" pageTitle="User Details" subUrl="/users" />
        <Link
          className="btn d-flex align-content-center btn-primary mt-3 mb-4"
          to="/users">
          <i className="ti ti-chevron-left f-24"></i> Back to Users
        </Link>

      </div>

      <div className="row">
        <div className="col-sm-12">

          <div className="row">
            <div className="col-lg-5 col-xxl-3">
              <div className="card overflow-hidden">
                <div className="card-body position-relative">
                  <div className="text-center mt-3">
                    <div className="chat-avtar d-inline-flex mx-auto">
                      <img
                        className="rounded-circle img-fluid wid-90 img-thumbnail"
                        src="../assets/images/user/avatar-1.jpg"
                        alt="User image"
                      />
                      <span className="chat-badge bg-light-primary me-2 mb-2">
                        <i className="ph-duotone ph-pencil-simple text-white small"></i>
                      </span>

                    </div>
                    <h5 className="mb-3">Satish Netha</h5>

                    <div className="row g-3">
                      <div className="col-4">
                        <h5 className="mb-0">12</h5>
                        <small className="text-muted">Assigned</small>
                      </div>
                      <div className="col-4 ">
                        <h5 className="mb-0">8</h5>
                        <small className="text-muted">Closed</small>
                      </div>
                      <div className="col-4">
                        <h5 className="mb-0">4.5</h5>
                        <small className="text-muted">Rating</small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="nav flex-column nav-pills list-group list-group-flush account-pills mb-0" id="user-set-tab" role="tablist" aria-orientation="vertical"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                  {/* Core Info */}
                  <a className="nav-link list-group-item list-group-item-action active" id="user-set-profile-tab" data-bs-toggle="pill" href="#user-set-profile" role="tab" aria-controls="user-set-profile" aria-selected="true">
                    <span className="f-w-500"><i className="ph-duotone ph-user-circle m-r-10" />Profile</span>
                  </a>

                  <a className="nav-link list-group-item list-group-item-action" id="user-set-information-tab" data-bs-toggle="pill" href="#user-set-information" role="tab" aria-controls="user-set-information" aria-selected="false">
                    <span className="f-w-500"><i className="ph-duotone ph-clipboard-text m-r-10" />Update User</span>
                  </a>

                  <a className="nav-link list-group-item list-group-item-action" id="user-set-leaves-tab" data-bs-toggle="pill" href="#user-set-leaves" role="tab" aria-controls="user-set-leaves" aria-selected="false">
                    <span className="f-w-500"><i className="ph-duotone ph-calendar-check m-r-10" />Leaves / Attendance</span>
                  </a>

                  {/* Employment & Roles */}
                  <a className="nav-link list-group-item list-group-item-action" id="user-set-employment-tab" data-bs-toggle="pill" href="#user-set-employment" role="tab" aria-controls="user-set-employment" aria-selected="false">
                    <span className="f-w-500"><i className="ph-duotone ph-briefcase m-r-10" />Employment Info</span>
                  </a>

                  {/* Skills */}
                  <a
                    className="nav-link list-group-item list-group-item-action"
                    id="user-set-skills-tab"
                    data-bs-toggle="pill"
                    href="#user-set-skills"
                    role="tab"
                    aria-controls="user-set-skills"
                    aria-selected="false"
                  >
                    <span className="f-w-500"><i className="ph-duotone ph-star m-r-10" />Skills</span>
                  </a>


                  {/* Work Logistics */}
                  <a className="nav-link list-group-item list-group-item-action" id="user-set-assets-tab" data-bs-toggle="pill" href="#user-set-assets" role="tab" aria-controls="user-set-assets" aria-selected="false">
                    <span className="f-w-500"><i className="ph-duotone ph-device-mobile m-r-10" />Assets Assigned</span>
                  </a>

                  <a className="nav-link list-group-item list-group-item-action" id="user-set-shift-tab" data-bs-toggle="pill" href="#user-set-shift" role="tab" aria-controls="user-set-shift" aria-selected="false">
                    <span className="f-w-500"><i className="ph-duotone ph-clock m-r-10" />Shift & Schedule</span>
                  </a>

                  {/* Training & Compliance */}
                  <a className="nav-link list-group-item list-group-item-action" id="user-set-training-tab" data-bs-toggle="pill" href="#user-set-training" role="tab" aria-controls="user-set-training" aria-selected="false">
                    <span className="f-w-500"><i className="ph-duotone ph-graduation-cap m-r-10" />Training / Certifications</span>
                  </a>

                  {/*Tasks & Ratings */}
                  <a className="nav-link list-group-item list-group-item-action" id="task-review-activity-tab" data-bs-toggle="pill" href="#task-review-activity" role="tab" aria-controls="task-review-activity" aria-selected="false">
                    <span className="f-w-500">
                    <i className="bi bi-bar-chart-line me-2"></i> Tasks / Ratings
                    </span>
                  </a>

                  {/* Activity & Issues */}
                  <a className="nav-link list-group-item list-group-item-action" id="user-set-activity-tab" data-bs-toggle="pill" href="#user-set-activity" role="tab" aria-controls="user-set-activity" aria-selected="false">
                    <span className="f-w-500"><i className="ph-duotone ph-clock-clockwise m-r-10" />Activity Logs</span>
                  </a>

                  <a className="nav-link list-group-item list-group-item-action" id="user-set-incidents-tab" data-bs-toggle="pill" href="#user-set-incidents" role="tab" aria-controls="user-set-incidents" aria-selected="false">
                    <span className="f-w-500"><i className="ph-duotone ph-warning m-r-10" />Incidents / Complaints</span>
                  </a>

                  {/* Documents */}
                  <a className="nav-link list-group-item list-group-item-action" id="user-set-documents-tab" data-bs-toggle="pill" href="#user-set-documents" role="tab" aria-controls="user-set-documents" aria-selected="false">
                    <span className="f-w-500"><i className="ph-duotone ph-folder m-r-10" />Documents</span>
                  </a>
                </div>


              </div>



            </div>
            <div className="col-lg-7 col-xxl-9">
              <div className="tab-content" id="user-set-tabContent">

                {/* Start Personal Information  */}
                <div
                  className="tab-pane fade show active"
                  id="user-set-profile"
                  role="tabpanel"
                  aria-labelledby="user-set-profile-tab"
                >
                  <div className="card">
                    <div className="card-header">
                      <h5>Personal Information</h5>
                    </div>
                    <div className="card-body">
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item px-0 pt-0">
                          <div className="row">
                            <div className="col-md-6">
                              <p className="mb-1 text-muted">Full Name</p>
                              <p className="mb-0">Satish Netha</p>
                            </div>
                            <div className="col-md-6">
                              <p className="mb-1 text-muted">Father's Name</p>
                              <p className="mb-0">Mr. Deepak</p>
                            </div>
                          </div>
                        </li>

                        <li className="list-group-item px-0">
                          <div className="row">
                            <div className="col-md-6">
                              <p className="mb-1 text-muted">Date of Birth</p>
                              <p className="mb-0">12 March 1994</p>
                            </div>
                            <div className="col-md-6">
                              <p className="mb-1 text-muted">Gender</p>
                              <p className="mb-0">Male</p>
                            </div>
                          </div>
                        </li>

                        <li className="list-group-item px-0">
                          <div className="row">
                            <div className="col-md-6">
                              <p className="mb-1 text-muted">Mobile</p>
                              <p className="mb-0">+91-9997773988</p>
                            </div>
                            <div className="col-md-6">
                              <p className="mb-1 text-muted">Email</p>
                              <p className="mb-0">satish@example.com</p>
                            </div>
                          </div>
                        </li>

                        <li className="list-group-item px-0">
                          <div className="row">
                            <div className="col-md-6">
                              <p className="mb-1 text-muted">Aadhar Number</p>
                              <p className="mb-0">1234 5678 9012</p>
                            </div>
                            <div className="col-md-6">
                              <p className="mb-1 text-muted">PAN Number</p>
                              <p className="mb-0">ABCDE1234F</p>
                            </div>
                          </div>
                        </li>

                        <li className="list-group-item px-0">
                          <div className="row">
                            <div className="col-md-6">
                              <p className="mb-1 text-muted">Marital Status</p>
                              <p className="mb-0">Single</p>
                            </div>
                            <div className="col-md-6">
                              <p className="mb-1 text-muted">Blood Group</p>
                              <p className="mb-0">B+</p>
                            </div>
                          </div>
                        </li>

                        <li className="list-group-item px-0">
                          <div className="row">
                            <div className="col-md-6">
                              <p className="mb-1 text-muted">Emergency Contact</p>
                              <p className="mb-0">Rahul - +91 9876543211</p>
                            </div>
                            <div className="col-md-6">
                              <p className="mb-1 text-muted">ID Proof Type</p>
                              <p className="mb-0">Aadhar Card</p>
                            </div>
                          </div>
                        </li>

                        <li className="list-group-item px-0">
                          <div className="row">
                            <div className="col-md-6">
                              <p className="mb-1 text-muted">Joined Date</p>
                              <p className="mb-0">01 Jan 2024</p>
                            </div>
                            <div className="col-md-6">
                              <p className="mb-1 text-muted">Relieved Date</p>
                              <p className="mb-0">N/A</p>
                            </div>
                          </div>
                        </li>

                        <li className="list-group-item px-0">
                          <div className="row">
                            <div className="col-md-6">
                              <p className="mb-1 text-muted">City</p>
                              <p className="mb-0">Hyderabad</p>
                            </div>
                            <div className="col-md-6">
                              <p className="mb-1 text-muted">State</p>
                              <p className="mb-0">Telangana</p>
                            </div>
                          </div>
                        </li>

                        <li className="list-group-item px-0">
                          <div className="row">
                            <div className="col-md-6">
                              <p className="mb-1 text-muted">Pin Code</p>
                              <p className="mb-0">500032</p>
                            </div>
                            <div className="col-md-6">
                              <p className="mb-1 text-muted">Country</p>
                              <p className="mb-0">India</p>
                            </div>
                          </div>
                        </li>

                        <li className="list-group-item px-0 pb-0">
                          <p className="mb-1 text-muted">Address</p>
                          <p className="mb-0">
                            Flat No. 204, Sunshine Residency, Gachibowli, Hyderabad, Telangana
                          </p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                {/* End Personal Information  */}

                <div
                  className="tab-pane fade"
                  id="user-set-information"
                  role="tabpanel"
                  aria-labelledby="user-set-information-tab"
                >
                  <UpdateUser />
                </div>

                {/* START: Leaves / Attendance Tab */}

                <div
                  className="tab-pane fade"
                  id="user-set-leaves"
                  role="tabpanel"
                  aria-labelledby="login-info-tab"
                >
                  <div className="card">
                    <div className="card-header">
                      <h5>Leaves / Attendance</h5>
                    </div>

                    <div className="card-body pb-1">
                      <ul className="list-group list-group-flush">


                        <li className="list-group-item px-0">
                          <div className="row">
                            <div className="col-md-6">
                              <p className="mb-1 text-muted">Last Login</p>
                              <p className="mb-0">07/08/2025, 09:45 AM</p>
                            </div>
                            <div className="col-md-6">
                              <p className="mb-1 text-muted">Last Login IP</p>
                              <p className="mb-0">192.168.1.23</p>
                            </div>
                          </div>
                        </li>
                      </ul>


                      {/* --- Login History Table --- */}
                      <hr className="mb-4" />
                      <h6 className="mb-3">Recent Login History</h6>
                      <div className="table-responsive ">
                        <table className="table table-bordered ">
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Login Time</th>
                              <th>Logout Time</th>
                              <th>IP Address</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>07/08/2025</td>
                              <td>8:45 AM</td>
                              <td>—</td>
                              <td>192.168.1.15</td>
                              <td><span className="badge bg-light-success">Present</span></td>
                            </tr>
                            <tr>
                              <td>06/08/2025</td>
                              <td>6:32 PM</td>
                              <td>7:45 PM</td>
                              <td>192.168.1.10</td>
                              <td><span className="badge bg-light-success">Present</span></td>
                            </tr>
                            <tr>
                              <td>05-Aug-2025</td>
                              <td>—</td>
                              <td>—</td>
                              <td>—</td>
                              <td><span className="badge bg-light-danger">Absent</span></td>
                            </tr>
                            <tr>
                              <td>04/08/2025</td>
                              <td>9:22 AM</td>
                              <td>5:10 PM</td>
                              <td>192.168.1.20</td>
                              <td><span className="badge bg-light-success">Present</span></td>
                            </tr>
                            <tr>
                              <td>03/08/2025</td>
                              <td>—</td>
                              <td>—</td>
                              <td>—</td>
                              <td><span className="badge bg-light-danger">Absent</span></td>
                            </tr>
                            <tr>
                              <td>02/08/2025</td>
                              <td>10:00 AM</td>
                              <td>6:00 PM</td>
                              <td>192.168.1.18</td>
                              <td><span className="badge bg-light-success">Present</span></td>
                            </tr>
                            <tr>
                              <td>01/08/2025</td>
                              <td>—</td>
                              <td>—</td>
                              <td>—</td>
                              <td><span className="badge bg-light-danger">Absent</span></td>
                            </tr>
                            {/* <tr>
                              <td></td>
                              <td>9:05 AM</td>
                              <td>4:50 PM</td>
                              <td>192.168.1.25</td>
                              <td><span className="badge bg-light-success">Present</span></td>
                            </tr> */}
                          </tbody>
                        </table>
                      </div>

                    </div>
                  </div>
                </div>

                {/* END: Leaves / Attendance Tab */}

                {/* Start: Employement Information Tab */}
                <div
                  className="tab-pane fade"
                  id="user-set-employment"
                  role="tabpanel"
                  aria-labelledby="user-set-employment-tab"
                >
                  <div className="card">
                    <div className="card-header">
                      <h5>Employment Information</h5>
                    </div>
                    <div className="card-body">
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item px-0 pt-0">
                          <div className="row">
                            <div className="col-md-6">
                              <p className="mb-1 text-muted">Employee ID</p>
                              <p className="mb-0">EMP123456</p>
                            </div>
                            <div className="col-md-6">
                              <p className="mb-1 text-muted">Job Title</p>
                              <p className="mb-0">Manager</p>
                            </div>
                          </div>
                        </li>

                        <li className="list-group-item px-0">
                          <div className="row">
                            <div className="col-md-6">
                              <p className="mb-1 text-muted">Department</p>
                              <p className="mb-0">	Field Operations	</p>
                            </div>
                            <div className="col-md-6">
                              <p className="mb-1 text-muted">Reporting Manager</p>
                              <p className="mb-0">Ms. Priya Rao</p>
                            </div>
                          </div>
                        </li>

                        <li className="list-group-item px-0">
                          <div className="row">
                            <div className="col-md-6">
                              <p className="mb-1 text-muted">Employment Type</p>
                              <p className="mb-0">Full-Time</p>
                            </div>
                            <div className="col-md-6">
                              <p className="mb-1 text-muted">Work Location</p>
                              <p className="mb-0">Gachibowli, Hyderabad</p>
                            </div>
                          </div>
                        </li>

                        <li className="list-group-item px-0">
                          <div className="row">
                            <div className="col-md-6">
                              <p className="mb-1 text-muted">Joining Date</p>
                              <p className="mb-0">08/09/2025</p>
                            </div>
                            <div className="col-md-6">
                              <p className="mb-1 text-muted">Relieving Date</p>
                              <p className="mb-0">N/A</p>
                            </div>
                          </div>
                        </li>

                        <li className="list-group-item px-0 pb-0">
                          <div className="row">
                            <div className="col-md-6">
                              <p className="mb-1 text-muted">Current Status</p>
                              <p className="mb-0">Present</p>
                            </div>
                            <div className="col-md-6">
                              <p className="mb-1 text-muted">Role Description</p>
                              <p className="mb-0">Responsible for building and maintaining UI components</p>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* END: Employement Information Tab */}
                {/* Start: Assets Tab */}
                <div
                  className="tab-pane fade"
                  id="user-set-assets"
                  role="tabpanel"
                  aria-labelledby="user-set-assets-tab"
                >
                  <div className="card">
                    <div className="card-header">
                      <h5>Assets Assigned</h5>
                    </div>
                    <div className="card-body">
                      <div className="table-responsive">
                        <AssetTable />
                      </div>
                    </div>
                  </div>
                </div>

                {/* END: Assets Tab */}
                {/* START: Skills Tab */}
                <div className="tab-pane fade" id="user-set-skills" role="tabpanel" aria-labelledby="user-set-skills-tab">
                  <div className="card mt-3">
                    <div className="card-header">
                      <h5>Skills</h5>
                    </div>
                    <div className="card-body">

                      {[
  { name: 'Equipment Maintenance', level: '85%' },
  { name: 'Troubleshooting', level: '90%' },
  { name: 'Customer Communication', level: '80%' },
  { name: 'Safety Compliance', level: '75%' },
  { name: 'Inventory Management', level: '70%' },
  { name: 'Preventive Maintenance', level: '80%' }
]
.map((skill, index) => (
                        <div className="row align-items-center mb-3" key={index}>
                          <div className="col-sm-6 mb-2 mb-sm-0">
                            <p className="mb-0">{skill.name}</p>
                          </div>
                          <div className="col-sm-6">
                            <div className="d-flex align-items-center">
                              <div className="flex-grow-1 me-3">
                                {/* You can add a progress bar here if needed */}
                              </div>
                              <div className="flex-shrink-0">
                                <p className="mb-0 text-muted">{skill.level}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                    </div>
                  </div>
                </div>

                {/* END: Skills Tab */}
                {/* START: Schedule Tab */}
                <div
                  className="tab-pane fade"
                  id="user-set-shift"
                  role="tabpanel"
                  aria-labelledby="user-set-shift-tab"
                >
                  <div className="card">
                    <div className="card-header">
                      <h5>Shift & Schedule Information</h5>
                    </div>
                    <div className="card-body">
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item px-0 pt-0">
                          <div className="row">
                            <div className="col-md-6">
                              <p className="mb-1 text-muted">Shift Type</p>
                              <p className="mb-0">Day Shift</p>
                            </div>
                            <div className="col-md-6">
                              <p className="mb-1 text-muted">Working Days</p>
                              <p className="mb-0">Monday to Saturday</p>
                            </div>
                          </div>
                        </li>

                        <li className="list-group-item px-0">
                          <div className="row">
                            <div className="col-md-6">
                              <p className="mb-1 text-muted">Shift Start Time</p>
                              <p className="mb-0">09:30 AM</p>
                            </div>
                            <div className="col-md-6">
                              <p className="mb-1 text-muted">Shift End Time</p>
                              <p className="mb-0">06:30 PM</p>
                            </div>
                          </div>
                        </li>

                        <li className="list-group-item px-0">
                          <div className="row">
                            <div className="col-md-6">
                              <p className="mb-1 text-muted">Break Duration</p>
                              <p className="mb-0">1 Hour</p>
                            </div>
                            <div className="col-md-6">
                              <p className="mb-1 text-muted">Total Working Hours</p>
                              <p className="mb-0">8 Hours</p>
                            </div>
                          </div>
                        </li>

                        <li className="list-group-item px-0">
                          <div className="row">
                            <div className="col-md-6">
                              <p className="mb-1 text-muted">Shift Assigned Date</p>
                              <p className="mb-0">01/08/2025</p>
                            </div>
                            <div className="col-md-6">
                              <p className="mb-1 text-muted">Effective Till</p>
                              <p className="mb-0">31/12/2025</p>
                            </div>
                          </div>
                        </li>

                        <li className="list-group-item px-0">
                          <div className="row">
                            <div className="col-md-6">
                              <p className="mb-1 text-muted">Working Location</p>
                              <p className="mb-0">Madhapur, Hyderabad</p>
                            </div>
                            <div className="col-md-6">
                              <p className="mb-1 text-muted">Supervisor Name</p>
                              <p className="mb-0">Mr. Rajesh Kumar</p>
                            </div>
                          </div>
                        </li>

                        <li className="list-group-item px-0 pb-0">
                          <div className="row">
                            <div className="col-md-6">
                              <p className="mb-1 text-muted">Remarks</p>
                              <p className="mb-0">Available for night shift upon request</p>
                            </div>
                            <div className="col-md-6">
                              <p className="mb-1 text-muted">Shift Rotation</p>
                              <p className="mb-0">No</p>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* END: Schedule Tab */}
                {/* Start: Traning Tab */}
                <div
                  className="tab-pane fade"
                  id="user-set-training"
                  role="tabpanel"
                  aria-labelledby="user-set-training-tab"
                >
                  <div className="card">
                    <div className="card-header">
                      <h5>
                        <i className="ti ti-user-exclamation f-24 me-2"></i>
                        Training & Certifications
                      </h5>
                    </div>
                    <div className="card-body table-responsive">
                      <table className="table table-bordered table-striped align-middle">
                        <thead className="table-light">
                          <tr>
                            <th>s.no</th>
                            <th>Training Program</th>
                            <th>Certification Title</th>
                            <th>Conducted By</th>
                            <th>Issued By</th>
                            <th>Date of Completion</th>
                            <th>Valid Till</th>
                            <th>Mode</th>
                            <th>Status</th>
                            <th>Remarks</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Example Row */}
                          <tr>
                            <td>1</td>
                            <td>Technical Training</td>
                            <td>Advanced PLC Programming</td>
                            <td>Engineering Team</td>
                            <td>Automation Academy</td>
                            <td>15/09/2025</td>
                            <td>15/09/2027</td>
                            <td>Offline</td>
                            <td><span className="badge bg-light-success">Completed</span></td>
                            <td>Cleared with distinction</td>
                            <td>
                              <div className="d-flex gap-2">
                                <Link to="/training/1" className="btn btn-sm btn-light-info">
                                  <i className="ti ti-eye" />
                                </Link>
                                <button className="btn btn-sm btn-light-primary">
                                  <i className="ti ti-pencil" />
                                </button>
                                <button className="btn btn-sm btn-light-danger" onClick={() => handleDelete(1)}>
                                  <i className="ti ti-trash" />
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* Add more rows dynamically */}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* 🔹 Tab content */}
<div
  className="tab-pane fade"
  id="task-review-activity"
  role="tabpanel"
  aria-labelledby="task-review-activity-tab"
>
  <div className="card">
    <div className="card-header">
      <h5>
        <i className="ti ti-clipboard-check f-24 me-2"></i>
        Tasks & Ratings
      </h5>
    </div>
    <div className="card-body table-responsive">
  <table className="table table-bordered table-hover align-middle">
    <thead className="table-light">
      <tr>
        <th>S.No</th>
        {/* <th>User</th> */}
        <th>Total Tasks</th>
        <th>Completed</th>
        <th>Pending</th>
        <th>Incompleted</th>
        <th>Rating</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {/* ✅ Example User Row */}
      <tr>
        <td>1</td>
        {/* <td>Satish Netha</td> */}
        <td><span className="badge bg-primary">12</span></td>
        <td><span className="badge bg-light-success">8</span></td>
        <td><span className="badge bg-light-warning">2</span></td>
        <td><span className="badge bg-light-danger">2</span></td>
        <td>
          {/* ⭐ Render stars with Bootstrap */}
          <span>
            <i className="bi bi-star-fill text-warning"></i>
            <i className="bi bi-star-fill text-warning"></i>
            <i className="bi bi-star-fill text-warning"></i>
            <i className="bi bi-star-half text-warning"></i>
            <i className="bi bi-star text-warning"></i>
          </span>
        </td>
        <td>
          <div className="d-flex gap-2">
            {/* <button className="btn btn-sm btn-light-info">
              <i className="ti ti-eye" />
            </button> */}
            <button
              className="btn btn-sm btn-light-danger"
              onClick={() => handleDeleteTask(1)}
            >
              <i className="ti ti-trash" />
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>

  </div>
</div>
                {/* Start: Activity Tab */}
                <div
                  className="tab-pane fade"
                  id="user-set-activity"
                  role="tabpanel"
                  aria-labelledby="user-set-activity-tab"
                >
                  <div className="card">
                    <div className="card-header">
                      <h5>
                        <i className="ti ti-activity f-24 me-2"></i>
                        Activity & Issues Logs
                      </h5>
                    </div>
                    <div className="card-body table-responsive">
                      <table className="table table-bordered table-hover align-middle">
                        <thead className="table-light">
                          <tr>
                            <th>s.no</th>
                            <th>Date & Time</th>
                            <th>User</th>
                            <th>Role</th>
                            <th>Activity</th>
                            <th>Status</th>
                            <th>Remarks</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Sample Log Row */}
                          <tr>
                            <td>1</td>
                            <td>07/08/2025, 09:42 AM</td>
                            <td>Satish Netha</td>
                            <td>Manager</td>
                            <td>Checked-in at client site</td>
                            <td><span className="badge bg-light-success">Successful</span></td>
                            <td>Arrived 15 mins early</td>
                            <td>
                              <div className="d-flex gap-2">
                                <button className="btn btn-sm btn-light-info">
                                  <i className="ti ti-eye" />
                                </button>
                                <button className="btn btn-sm btn-light-danger" onClick={() => handleDeleteLog(1)}>
                                  <i className="ti ti-trash" />
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* More rows with .map() */}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* END: Activity Tab */}
                {/* Start: Complaints Tab */}
                <div
                  className="tab-pane fade"
                  id="user-set-incidents"
                  role="tabpanel"
                  aria-labelledby="user-set-incidents-tab"
                >
                  <div className="card">
                    <div className="card-header">
                      <h5>
                        <i className="ti ti-alert-triangle f-24 me-2"></i>
                        Logged Incidents & Complaints
                      </h5>
                    </div>
                    <div className="card-body table-responsive">
                      <table className="table table-bordered table-hover align-middle">
                        <thead className="table-light">
                          <tr>
                            <th>s.no</th>
                            <th>Title</th>
                            <th>Reported By</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Assigned To</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Example row */}
                          <tr>
                            <td>1</td>
                            <td>Water Leakage in Basement</td>
                            <td>Anjali Verma</td>
                            <td>07 Aug 2025</td>
                            <td><span className="badge bg-light-warning">In Review</span></td>
                            <td>Satish Netha</td>
                            <td>
                              <div className="d-flex gap-2">
                                <button className="btn btn-sm btn-light-info">
                                  <i className="ti ti-eye" />
                                </button>
                                <button className="btn btn-sm btn-light-danger">
                                  <i className="ti ti-trash" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                {/* END: Complaints Tab */}
                {/* Start: Documents Tab */}
                <div
                  className="tab-pane fade"
                  id="user-set-documents"
                  role="tabpanel"
                  aria-labelledby="user-set-documents-tab"
                >
                  <div className="card">
                    <div className="card-header">
                      <h5>
                        <i className="ti ti-folder f-24 me-2"></i>
                        Uploaded Documents
                      </h5>
                    </div>
                    <div className="card-body table-responsive">
                      <table className="table table-hover align-middle">
                        <thead className="table-light">
                          <tr>
                            <th>s.no</th>
                            <th>Document Name</th>
                            <th>Type</th>
                            <th>Uploaded By</th>
                            <th>Uploaded On</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            {
                              id: 1,
                              name: "Facility License",
                              type: "PDF",
                              by: "Admin",
                              date: "2025-08-01",
                            },
                            {
                              id: 2,
                              name: "Safety Audit Report",
                              type: "DOCX",
                              by: "John Doe",
                              date: "2025-07-28",
                            },
                            {
                              id: 3,
                              name: "Compliance Certificate",
                              type: "PDF",
                              by: "Jane Smith",
                              date: "2025-07-15",
                            },
                            {
                              id: 4,
                              name: "AMC Agreement",
                              type: "PDF",
                              by: "Maintenance Head",
                              date: "2025-07-05",
                            },
                            {
                              id: 5,
                              name: "Fire Drill Log",
                              type: "XLSX",
                              by: "Safety Officer",
                              date: "2025-06-30",
                            },
                          ].map((doc) => (
                            <tr key={doc.id}>
                              <td>{doc.id}</td>
                              <td>{doc.name}</td>
                              <td>{doc.type}</td>
                              <td>{doc.by}</td>
                              <td>{doc.date}</td>
                              <td>
                                <div className="d-flex gap-2">
                                  <a href="#" className="btn btn-sm btn-light-info" title="View">
                                    <i className="ti ti-eye" />
                                  </a>
                                  <a href="#" className="btn btn-sm btn-light-primary" title="Download">
                                    <i className="ti ti-download" />
                                  </a>
                                  <button className="btn btn-sm btn-light-danger" title="Delete">
                                    <i className="ti ti-trash" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* END: Documents Tab */}


              </div>
            </div>
          </div>
        </div>
      </div>
    </>

  )
}

export default DetailsUser