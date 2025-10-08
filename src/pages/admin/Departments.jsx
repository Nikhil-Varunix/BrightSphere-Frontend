// src/pages/admin/Departments.jsx
import BreadCrumb from "../../components/BreadCrumb";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import UpdateDepartmentModal from "./components/UpdateDepartmentModal";
import { formatTime, formatDate } from "../../utils/time";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

const Departments = () => {
  
  const [sortConfig, setSortConfig] = useState({ key: "sno", direction: "asc" });
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // Filters
  const [filters, setFilters] = useState({ search: "" });

  // Sorting state

  const API_URL = import.meta.env.VITE_API_URL;
  const ORG_ID = import.meta.env.VITE_ORG_ID;
  const token = localStorage.getItem("authToken");


  const fetchDepartments = async () => {
    try {

      const res = await axios.get(`${API_URL}/admin/department/get/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      setDepartments(res.data.data);
      console.log(res.data.data);

    } catch (err) {
      console.error("Failed to fetch departments:", err);
      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        // Optional: redirect to login
        window.location.href = "/login";
      } else {
        toast.error("Failed to fetch departments");
      }
    }
  };


  useEffect(() => {

    fetchDepartments();
  }, []);

  // Add Department handler
  const handleAddDepartment = async (values, { resetForm }) => {
    try {
      const token = localStorage.getItem("authToken");

      const res = await axios.post(
        `${API_URL}/admin/department/create`,
        {
          deptName: values.name,
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

      fetchDepartments();
      toast.success("Department added successfully");
      resetForm();
    } catch (err) {
      console.error("Error adding department:", err.response?.data || err.message);
      toast.error("Error adding department");
    }
  };


  // Update handler
  const handleUpdate = async (updatedDept) => {
    try {
      const now = new Date().toISOString().slice(0, 10);
      const res = await axios.put(`/api/departments/${updatedDept.id}`, {
        ...updatedDept,
        updatedBy: "Admin",
        updatedAt: now,
      });
      setDepartments((prev) =>
        prev.map((d) => (d.id === updatedDept.id ? res.data : d))
      );
      toast.success("Department updated successfully");
    } catch {
      toast.error("Failed to update department");
    }
  };

  // Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?")) return;

    try {
      const token = localStorage.getItem("authToken");

      await axios.delete(`${API_URL}/admin/department/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      setDepartments((prev) => prev.filter((d) => d._id !== id)); // use _id if MongoDB
      toast.success("Department deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete department");
    }
  };


  // Filtering logic
  const filteredDepartments = Array.isArray(departments)
    ? departments.filter((dept) => {
      const q = filters.search.trim().toLowerCase();
      if (!q) return true;
      return (
        (dept.name || "").toLowerCase().includes(q) ||
        (dept.id || "").toLowerCase().includes(q) ||
        (dept.createdBy || "").toLowerCase().includes(q) ||
        (dept.updatedBy || "").toLowerCase().includes(q) ||
        (dept.status || "").toLowerCase().includes(q)
      );
    })
    : [];

  // Sorting logic
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };


  const sortedDepartments = [...filteredDepartments].sort((a, b) => {
    let valA, valB;

    if (sortConfig.key === "sno") {
      // Use department id OR fallback to index
      valA = a.id;
      valB = b.id;
    } else {
      valA = a[sortConfig.key];
      valB = b[sortConfig.key];
    }

    if (valA === undefined || valB === undefined) return 0;

    if (typeof valA === "string") {
      return sortConfig.direction === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    } else {
      return sortConfig.direction === "asc" ? valA - valB : valB - valA;
    }
  });

 const renderSortIcons = (key) => (
    <span
      style={{
        display: "inline-flex",
        flexDirection: "column",
        marginLeft: "5px",
        verticalAlign: "middle",
      }}
    >
      <span
        style={{
          cursor: "pointer",
          fontSize: "10px",
          lineHeight: "12px",
          color:
            sortConfig.key === key && sortConfig.direction === "asc"
              ? "#000"
              : "#ccc",
        }}
        onClick={() => setSortConfig({ key, direction: "asc" })}
      >
        ▲
      </span>
      <span
        style={{
          cursor: "pointer",
          fontSize: "10px",
          lineHeight: "10px",
          color:
            sortConfig.key === key && sortConfig.direction === "desc"
              ? "#000"
              : "#ccc",
        }}
        onClick={() => setSortConfig({ key, direction: "desc" })}
      >
        ▼
      </span>
    </span>
  );
  // Validation Schema
  const DepartmentSchema = Yup.object().shape({
    name: Yup.string()
      .required("Department name is required")
      .min(3, "Must be at least 3 characters"),
  });

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <BreadCrumb subLabel="Admin" pageTitle="Department" subUrl="/departments" />
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card table-card">
            <div className="card-body pt-3">
              {/* Add Department Form */}
              <Formik
                initialValues={{ name: "" }}
                validationSchema={DepartmentSchema}
                onSubmit={handleAddDepartment}
              >
                {({ isSubmitting }) => (
                  <Form className="d-flex align-items-start mb-3 px-3 justify-content-start gap-2">
                    <div style={{ maxWidth: "220px" }}>
                      <Field
                        type="text"
                        name="name"
                        className="form-control py-2"
                        placeholder="New Department Name"
                      />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="text-danger small mt-1"
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary py-2"
                      disabled={isSubmitting}
                    >
                      <i className="ti ti-plus me-1"></i>
                      {isSubmitting ? "Adding..." : "Add"}
                    </button>
                  </Form>
                )}
              </Formik>

              {/* Departments Table */}
              <div className="table-responsive">
                <table className="table table-hover">
                 <thead>
  <tr>
    <th>S.No {renderSortIcons("sno")}</th>
    <th>Department {renderSortIcons("name")}</th>
    <th>Created By {renderSortIcons("createdBy")}</th>
    <th>Created Date {renderSortIcons("createdAt")}</th>
    <th>Updated By {renderSortIcons("updatedBy")}</th>
    <th>Updated Date {renderSortIcons("updatedAt")}</th>
    <th>Status {renderSortIcons("status")}</th>
    <th>Action</th>
  </tr>
</thead>
                  <tbody>
                    {sortedDepartments.map((dept, index) => (
                      <tr key={index + 1}>
                        <td>{index + 1}</td>
                        <td>{dept.deptName || "--"}</td>
                        <td>
                          {dept.createdBy
                            ? `${dept.createdBy.firstName} ${dept.createdBy.lastName}`
                            : "--"}
                        </td>
                        <td>
                          {formatDate(dept.createdAt)}
                          <br />
                          <small>{formatTime(dept.createdAt)} </small>

                        </td>
                        <td>
                          {dept.updatedBy
                            ? `${dept.updatedBy.firstName} ${dept.updatedBy.lastName}`
                            : "--"}
                        </td>
                        <td>
                          {formatDate(dept.updatedAt)}
                          <br />
                          <small>{formatTime(dept.updatedAt)} </small>

                        </td>
                        <td>
                          <span
                            className={`badge bg-light-${dept.status ? "success" : "danger"}`}
                          >
                            {dept.status ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td>
                          <ul className="list-inline m-0">
                            <li className="list-inline-item">
                              <span
                                title="Edit"
                                onClick={() => {
                                  setSelectedDept(dept);
                                  setShowUpdateModal(true);
                                }}
                                className="avtar avtar-s btn-light-warning mx-1"
                              >
                                <i className="ti ti-pencil f-18" />
                              </span>
                            </li>
                            <li className="list-inline-item cursor-pointer">
                              <span
                                className="avtar avtar-s btn-light-danger mx-1"
                                title="Delete"
                                onClick={() => handleDelete(dept._id)}
                              >
                                <i className="ti ti-trash f-18" />
                              </span>
                            </li>
                          </ul>
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>

                   {/* Pagination */}
              <div className="datatable-bottom">
                <div className="datatable-info">Showing 1 to 5 of 6 entries</div>
                <nav className="datatable-pagination">
                  <ul className="datatable-pagination-list">
                    <li className="datatable-pagination-list-item datatable-hidden datatable-disabled">
                      <button
                        data-page={1}
                        className="datatable-pagination-list-item-link"
                        aria-label="Page 1"
                      >
                        ‹
                      </button>
                    </li>
                    <li className="datatable-pagination-list-item datatable-active">
                      <button
                        data-page={1}
                        className="datatable-pagination-list-item-link"
                        aria-label="Page 1"
                      >
                        1
                      </button>
                    </li>
                    <li className="datatable-pagination-list-item">
                      <button
                        data-page={2}
                        className="datatable-pagination-list-item-link"
                        aria-label="Page 2"
                      >
                        2
                      </button>
                    </li>
                    <li className="datatable-pagination-list-item">
                      <button
                        data-page={2}
                        className="datatable-pagination-list-item-link"
                        aria-label="Page 2"
                      >
                        ›
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>

                {/* Update Modal */}
                <UpdateDepartmentModal
                  show={showUpdateModal}
                  fetchDepartments={fetchDepartments}
                  handleClose={() => setShowUpdateModal(false)}
                  department={selectedDept}
                  onUpdate={handleUpdate}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Departments;