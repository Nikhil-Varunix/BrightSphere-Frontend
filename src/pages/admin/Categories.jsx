// src/pages/admin/Categories.jsx
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import BreadCrumb from "../../components/BreadCrumb";
import UpdateCategoryModal from "./components/UpdateCategoryModal";
import { formatTime, formatDate } from "../../utils/time";

const CategorySchema = Yup.object().shape({
  categoryName: Yup.string().required("Category name is required"),
  image: Yup.mixed().test(
    "fileRequired",
    "Image is required",
    (value) => value instanceof File || value === null
  ),
});

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [filters, setFilters] = useState({ search: "" });
  const [sortConfig, setSortConfig] = useState({ key: "categoryName", direction: "asc" });

  const API_URL = import.meta.env.VITE_API_URL;
  const orgId = import.meta.env.VITE_ORG_ID;
  const token = localStorage.getItem("authToken");
  const baseUrl = import.meta.env.VITE_BASE_URL;

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/category/get/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      toast.error("Failed to fetch categories");
      if (err.response?.status === 401) window.location.href = "/login";
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add Category
  const handleAddCategory = async (values, actions) => {
    try {
      const formData = new FormData();
      formData.append("categoryName", values.categoryName);
      formData.append("orgId", orgId);
      if (values.image) formData.append("image", values.image);

      const res = await axios.post(`${API_URL}/admin/category/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      });

      setCategories((prev) => [...prev, res.data.data]);
      toast.success("Category added successfully");
      actions.resetForm();
    } catch (err) {
      console.error("Error adding category:", err);
      toast.error("Failed to add category");
    }
  };

  // Edit Category
  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setShowUpdateModal(true);
  };

  const handleUpdateCategory = async (updatedCategory) => {
    try {
      const formData = new FormData();
      formData.append("categoryName", updatedCategory.categoryName);
      if (updatedCategory.image instanceof File) {
        formData.append("image", updatedCategory.image);
      }

      const res = await axios.put(
        `${API_URL}/admin/category/update/${updatedCategory._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setCategories((prev) =>
        prev.map((c) => (c._id === updatedCategory._id ? res.data.data : c))
      );
      toast.success("Category updated successfully");
    } catch (err) {
      console.error("Failed to update category:", err);
      toast.error("Failed to update category");
    }
  };

  // Delete Category
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await axios.delete(`${API_URL}/admin/category/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      setCategories((prev) => prev.filter((c) => c._id !== id));
      toast.success("Category deleted successfully");
    } catch (err) {
      console.error("Failed to delete category:", err);
      toast.error("Failed to delete category");
    }
  };

  // Sorting
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  // Filtered + sorted categories
  const sortedCategories = useMemo(() => {
    let filtered = categories.filter((c) => {
      const q = filters.search.toLowerCase();
      return (
        !q ||
        c.categoryName?.toLowerCase().includes(q) ||
        c._id?.toLowerCase().includes(q) ||
        c.createdBy?.firstName?.toLowerCase().includes(q) ||
        c.updatedBy?.firstName?.toLowerCase().includes(q)
      );
    });

    filtered.sort((a, b) => {
      let valA, valB;

      switch (sortConfig.key) {
        case "categoryName":
          valA = a.categoryName?.toLowerCase() || "";
          valB = b.categoryName?.toLowerCase() || "";
          break;
        case "createdBy":
          valA = a.createdBy?.firstName?.toLowerCase() || "";
          valB = b.createdBy?.firstName?.toLowerCase() || "";
          break;
        case "updatedBy":
          valA = a.updatedBy?.firstName?.toLowerCase() || "";
          valB = b.updatedBy?.firstName?.toLowerCase() || "";
          break;
        case "createdAt":
        case "updatedAt":
          valA = new Date(a[sortConfig.key]);
          valB = new Date(b[sortConfig.key]);
          break;
        case "status":
          valA = a.status ? 1 : 0;
          valB = b.status ? 1 : 0;
          break;
        default:
          valA = a[sortConfig.key] || "";
          valB = b[sortConfig.key] || "";
      }

      if (typeof valA === "string") {
        return sortConfig.direction === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      } else {
        return sortConfig.direction === "asc" ? valA - valB : valB - valA;
      }
    });

    return filtered;
  }, [categories, filters, sortConfig]);

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

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <BreadCrumb subLabel="Admin" pageTitle="Category" subUrl="/categories" />
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card table-card">
            <div className="card-body pt-3">
              {/* Filter + Add */}
             <div className="row">
  {/* Search box */}
  <div className="col-7 col-md-3">
    <div className="mb-3 px-3">
      <input
        type="text"
        className="form-control py-2"
        placeholder="Search categories..."
        value={filters.search}
        onChange={(e) => setFilters({ search: e.target.value })}
      />
    </div>
  </div>

  {/* Form */}
  <div className="col-12 col-md-9">
  <div className="mb-3 px-3">
    <Formik
      initialValues={{ categoryName: "", image: null }}
      validationSchema={CategorySchema}
      onSubmit={handleAddCategory}
    >
      {({ setFieldValue }) => (
        <Form className="d-flex flex-wrap flex-md-nowrap align-items-center gap-2 justify-content-md-end justify-content-start">
          {/* Category Name */}
          <div className="flex-grow-1" style={{ minWidth: "200px" }}>
            <Field
              type="text"
              name="categoryName"
              className="form-control py-2"
              placeholder="Category Name"
            />
            <ErrorMessage
              name="categoryName"
              component="div"
              className="text-danger small"
            />
          </div>

          {/* Image Upload */}
          <div className="flex-grow-1" style={{ minWidth: "200px" }}>
            <input
              type="file"
              name="image"
              accept="image/*"
              className="form-control py-2"
              onChange={(e) =>
                setFieldValue("image", e.currentTarget.files[0])
              }
            />
            <ErrorMessage
              name="image"
              component="div"
              className="text-danger small"
            />
          </div>

          {/* Button */}
          <div className="flex-grow-1" style={{ minWidth: "200px" }}>
            <button
              type="submit"
              className="btn btn-primary w-100 py-2"
            >
              <i className="ti ti-plus me-1"></i> Add
            </button>
          </div>
        </Form>
      )}
    </Formik>
  </div>
</div>

</div>


              {/* Categories Table */}
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
  <th>S.No {renderSortIcons("sno")}</th>
  <th>Image</th>
  <th>Category {renderSortIcons("categoryName")}</th>
  <th>Created By {renderSortIcons("createdBy")}</th>
  <th>Created Date {renderSortIcons("createdAt")}</th>
  <th>Updated By {renderSortIcons("updatedBy")}</th>
  <th>Updated Date {renderSortIcons("updatedAt")}</th>
  <th>Status {renderSortIcons("status")}</th>
  <th>Actions</th>
</tr>

                  </thead>
                  <tbody>
                    {sortedCategories.map((category, index) => (
                      <tr key={category._id}>
                        <td className="text-primary">{index + 1}</td>
                        <td>
                          {category.image ? (
                            <img
                              className="rounded"
                              src={`${baseUrl}${category.image}`}
                              alt={category.categoryName}
                              style={{
                                width: "40px",
                                height: "40px",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            "--"
                          )}
                        </td>
                        <td>{category.categoryName}</td>
                        <td>{category.createdBy?.firstName || "--"}</td>
                        <td>
                          {formatDate(category.createdAt)}
                          <br />
                          <small>{formatTime(category.createdAt)}</small>
                        </td>
                        <td>{category.updatedBy?.firstName || "--"}</td>
                        <td>
                          {formatDate(category.updatedAt)}
                          <br />
                          <small>{formatTime(category.updatedAt)}</small>
                        </td>
                        <td>
                          <span
                            className={`badge bg-light-${
                              category.status ? "success" : "danger"
                            }`}
                          >
                            {category.status ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td>
                          <ul className="list-inline m-0">
                            <li className="list-inline-item">
                              <span
                                title="Edit"
                                onClick={() => handleEditClick(category)}
                                className="avtar avtar-s btn-light-warning mx-1"
                              >
                                <i className="ti ti-pencil f-18" />
                              </span>
                            </li>
                            <li className="list-inline-item cursor-pointer">
                              <span
                                className="avtar avtar-s btn-lights-danger mx-1"
                                title="Delete"
                                onClick={() => handleDelete(category._id)}
                              >
                                <i className="ti ti-trash f-18" />
                              </span>
                            </li>
                          </ul>
                        </td>
                      </tr>
                    ))}
                    {sortedCategories.length === 0 && (
                      <tr>
                        <td colSpan="9" className="text-center text-muted">
                          No categories found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
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
              <UpdateCategoryModal
                show={showUpdateModal}
                handleClose={() => setShowUpdateModal(false)}
                category={selectedCategory}
                onUpdate={handleUpdateCategory}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Categories;