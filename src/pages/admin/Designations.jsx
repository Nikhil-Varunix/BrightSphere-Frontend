// src/pages/admin/Designations.jsx
import BreadCrumb from "../../components/BreadCrumb";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { formatTime, formatDate } from "../../utils/time";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const mockDesignations = [
 
  {
    _id: "4",
    name: "Reviewer",
    createdBy: { firstName: "Dr. Grace", lastName: "Nair" },
    createdAt: new Date("2025-02-12T08:45:00"),
    updatedBy: { firstName: "Dr. Henry", lastName: "Verma" },
    updatedAt: new Date("2025-07-10T12:30:00"),
    status: true,
  },
  {
    _id: "5",
    name: "Research Author",
    createdBy: { firstName: "Dr. Ian", lastName: "Chopra" },
    createdAt: new Date("2025-03-05T10:00:00"),
    updatedBy: { firstName: "Dr. Julia", lastName: "Gupta" },
    updatedAt: new Date("2025-08-15T09:20:00"),
    status: true,
  },
];


const Designations = () => {
  const [designations, setDesignations] = useState([]);
  const [filters, setFilters] = useState({ search: "" });
  const [sortConfig, setSortConfig] = useState({ key: "sno", direction: "asc" });

  useEffect(() => {
    // Simulate API fetch
    setDesignations(mockDesignations);
  }, []);

  const filteredDesignations = designations.filter((d) => {
    const q = filters.search.toLowerCase().trim();
    if (!q) return true;
    return (d.name || "").toLowerCase().includes(q);
  });

  const sortedDesignations = [...filteredDesignations].sort((a, b) => {
    const valA = a[sortConfig.key] || "";
    const valB = b[sortConfig.key] || "";
    if (typeof valA === "string") {
      return sortConfig.direction === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
    } else {
      return sortConfig.direction === "asc" ? valA - valB : valB - valA;
    }
  });

  const renderSortIcons = (key) => (
    <span className="ms-1 d-inline-flex flex-column">
      <span
        style={{ cursor: "pointer", fontSize: "10px", color: sortConfig.key === key && sortConfig.direction === "asc" ? "#000" : "#ccc" }}
        onClick={() => setSortConfig({ key, direction: "asc" })}
      >
        ▲
      </span>
      <span
        style={{ cursor: "pointer", fontSize: "10px", color: sortConfig.key === key && sortConfig.direction === "desc" ? "#000" : "#ccc" }}
        onClick={() => setSortConfig({ key, direction: "desc" })}
      >
        ▼
      </span>
    </span>
  );

  const DesignationSchema = Yup.object().shape({
    name: Yup.string().required("Designation name is required").min(3, "Minimum 3 characters"),
  });

  const handleAddDesignation = (values, { resetForm }) => {
    const newDesignation = {
      _id: Date.now().toString(),
      name: values.name,
      createdBy: { firstName: "Admin", lastName: "" },
      createdAt: new Date(),
      updatedBy: { firstName: "Admin", lastName: "" },
      updatedAt: new Date(),
      status: true,
    };
    setDesignations((prev) => [newDesignation, ...prev]);
    toast.success("Designation added successfully");
    resetForm();
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <BreadCrumb subLabel="Admin" pageTitle="Designations" subUrl="/designations" />
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card table-card">
            <div className="card-body pt-3">
              {/* Add Designation */}
              <Formik initialValues={{ name: "" }} validationSchema={DesignationSchema} onSubmit={handleAddDesignation}>
                {({ isSubmitting }) => (
                  <Form className="d-flex align-items-start mb-3 px-3 justify-content-start gap-2">
                    <div style={{ maxWidth: "220px" }}>
                      <Field type="text" name="name" className="form-control py-2" placeholder="New Designation Name" />
                      <ErrorMessage name="name" component="div" className="text-danger small mt-1" />
                    </div>
                    <button type="submit" className="btn btn-primary py-2" disabled={isSubmitting}>
                      <i className="ti ti-plus me-1"></i> {isSubmitting ? "Adding..." : "Add"}
                    </button>
                  </Form>
                )}
              </Formik>

              {/* Designations Table */}
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>S.No {renderSortIcons("sno")}</th>
                      <th>Designation {renderSortIcons("name")}</th>
                      <th>Created By {renderSortIcons("createdBy")}</th>
                      <th>Created Date {renderSortIcons("createdAt")}</th>
                      <th>Updated By {renderSortIcons("updatedBy")}</th>
                      <th>Updated Date {renderSortIcons("updatedAt")}</th>
                      <th>Status {renderSortIcons("status")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedDesignations.map((d, index) => (
                      <tr key={d._id}>
                        <td>{index + 1}</td>
                        <td>{d.name}</td>
                        <td>{`${d.createdBy.firstName} ${d.createdBy.lastName}`}</td>
                        <td>
                          {formatDate(d.createdAt)} <br />
                          <small>{formatTime(d.createdAt)}</small>
                        </td>
                        <td>{`${d.updatedBy.firstName} ${d.updatedBy.lastName}`}</td>
                        <td>
                          {formatDate(d.updatedAt)} <br />
                          <small>{formatTime(d.updatedAt)}</small>
                        </td>
                        <td>
                          <span className={`badge bg-light-${d.status ? "success" : "danger"}`}>
                            {d.status ? "Active" : "Inactive"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Designations;
