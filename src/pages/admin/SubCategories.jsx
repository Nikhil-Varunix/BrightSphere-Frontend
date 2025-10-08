// src/pages/admin/SubCategories.jsx
import BreadCrumb from "../../components/BreadCrumb";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import UpdateSubCategoryModal from "./components/UpdateSubCategoryModal";
import axios from "axios";
import { formatDate, formatTime } from "../../utils/time";

const SubCategories = () => {
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [filters, setFilters] = useState({ search: "" });
  const [newSubCategory, setNewSubCategory] = useState({
    name: "",
    categoryId: "",
  });

  const [sortConfig, setSortConfig] = useState({ key: "subCategoryName", direction: "asc" });

  const API_URL = import.meta.env.VITE_API_URL;
  const ORG_ID = import.meta.env.VITE_ORG_ID;
  const token = localStorage.getItem("authToken");

  // 🔹 Fetch Categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/category/get/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      toast.error("Failed to fetch categories");
    }
  };

  // 🔹 Fetch SubCategories
  const fetchSubCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/subcategory/get/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubCategories(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch subcategories:", err);
      toast.error("Failed to fetch subcategories");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  // 🔹 Add SubCategory
  const handleAddSubCategory = async () => {
    const { name, categoryId } = newSubCategory;

    if (!name.trim() || !categoryId) {
      toast.error("Please enter subcategory and select category");
      return;
    }

    try {
      await axios.post(
        `${API_URL}/admin/subcategory/create`,
        {
          subCategoryName: name.trim(),
          categoryId,
          orgId: ORG_ID,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("SubCategory added successfully");
      setNewSubCategory({ name: "", categoryId: "" });
      fetchSubCategories(); // refresh list
    } catch (err) {
      console.error("Error adding subcategory:", err.response?.data || err.message);
      toast.error("Failed to add subcategory");
    }
  };

  // 🔹 Edit
  const handleEditClick = (e, subCategory) => {
    e.preventDefault();
    setSelectedSubCategory(subCategory);
    setShowUpdateModal(true);
  };

  const handleUpdate = async (updatedSubCategory) => {
    try {
      await axios.put(
        `${API_URL}/admin/subcategory/update/${updatedSubCategory._id}`,
        updatedSubCategory,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("SubCategory updated successfully");
      fetchSubCategories();
    } catch (err) {
      console.error("Error updating subcategory:", err);
      toast.error("Failed to update subcategory");
    }
  };

  // 🔹 Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subcategory?")) return;
    try {
      await axios.delete(`${API_URL}/admin/subcategory/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubCategories((prev) => prev.filter((s) => s._id !== id));
      toast.success("SubCategory deleted successfully");
    } catch (err) {
      console.error("Error deleting subcategory:", err);
      toast.error("Failed to delete subcategory");
    }
  };

  // 🔍 Filtering
  const filteredSubCategories = subCategories.filter((sub) => {
    const q = filters.search.trim().toLowerCase();
    if (!q) return true;
    return (
      sub.subCategoryName?.toLowerCase().includes(q) ||
      sub._id?.toLowerCase().includes(q) ||
      sub.categoryId?.categoryName?.toLowerCase().includes(q)
    );
  });

  // 🔽 Sorting
  const sortedSubCategories = [...filteredSubCategories].sort((a, b) => {
    let valA = a[sortConfig.key];
    let valB = b[sortConfig.key];
    if (typeof valA === "string") {
      return sortConfig.direction === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }
    return sortConfig.direction === "asc" ? valA - valB : valB - valA;
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

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <BreadCrumb subLabel="Admin" pageTitle="SubCategories" subUrl="/subcategories" />
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card table-card">
            <div className="card-body pt-3">
              {/* Add Form */}
              <div className="d-flex align-items-center gap-2 mb-3 px-3">
                <div style={{ width: "200px" }}>
                  <select
                    className="form-select py-2"
                    value={newSubCategory.categoryId}
                    onChange={(e) =>
                      setNewSubCategory((prev) => ({ ...prev, categoryId: e.target.value }))
                    }
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat, index) => (
                      <option key={index + 1} value={cat._id}>
                        {cat.categoryName}
                      </option>
                    ))}
                  </select>
                </div>

                <input
                  type="text"
                  className="form-control py-2"
                  style={{ width: "180px", fontSize: "14px" }}
                  placeholder="SubCategory Name"
                  value={newSubCategory.name}
                  onChange={(e) =>
                    setNewSubCategory((prev) => ({ ...prev, name: e.target.value }))
                  }
                />

                <button className="btn btn-primary py-2 px-3" onClick={handleAddSubCategory}>
                  <i className="ti ti-plus me-1"></i> Add
                </button>
              </div>

              {/* Table */}
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
  <th>S.No {renderSortIcons("sno")}</th>
  <th>SubCategory {renderSortIcons("subCategoryName")}</th>
  <th>Category {renderSortIcons("categoryName")}</th>
  <th>Created By {renderSortIcons("createdBy")}</th>
  <th>Created At {renderSortIcons("createdAt")}</th>
  <th>Updated By {renderSortIcons("updatedBy")}</th>
  <th>Updated At {renderSortIcons("updatedAt")}</th>
  <th>Status {renderSortIcons("status")}</th>
  <th>Action</th>
</tr>

                  </thead>
                  <tbody>
                    {sortedSubCategories.map((sub, index) => (
                      <tr key={sub._id}>
                        <td>{index + 1}</td>
                        <td>{sub.subCategoryName || "--"}</td>
                        <td>{sub.categoryId?.categoryName || "--"}</td>
                        <td>{sub.createdBy?.firstName || "--"}</td>
                        <td>
                          {formatDate(sub.createdAt) || "--"}
                           <br />
                          <small>{formatTime(sub.createdAt) + " "}</small>
                        </td>
                        <td>{sub.updatedBy?.firstName || "--"}</td>
                        <td>
                          {formatDate(sub.updatedAt) || "--"}
                          <br />
                          <small>{formatTime(sub.updatedAt) + " "} </small>
                        </td>
                        <td>
                          <span
                            className={`badge ${sub.status ? "bg-light-success" : "bg-light-danger"}`}
                          >
                            {sub.status ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td>
                          <ul className="list-inline m-0">
                            <li className="list-inline-item">
                              <span
                                title="Edit"
                                onClick={(e) => handleEditClick(e, sub)}
                                className="avtar avtar-s btn-light-warning mx-1"
                              >
                                <i className="ti ti-pencil f-18" />
                              </span>
                            </li>
                            <li className="list-inline-item cursor-pointer">
                              <span
                                className="avtar avtar-s btn-light-danger mx-1"
                                title="Delete"
                                onClick={() => handleDelete(sub._id)}
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

                <UpdateSubCategoryModal
  show={showUpdateModal}
  handleClose={() => setShowUpdateModal(false)}
  subCategory={selectedSubCategory}
  categories={categories}
  onUpdate={handleUpdate}
/>

              </div>

              {/* Pagination Placeholder */}
              <div className="datatable-bottom">
                <div className="datatable-info">Showing 1 to 5 of 6 entries</div>
                <nav className="datatable-pagination">
                  <ul className="datatable-pagination-list">
                    <li className="datatable-pagination-list-item datatable-hidden datatable-disabled">
                      <button data-page={1} className="datatable-pagination-list-item-link">
                        ‹
                      </button>
                    </li>
                    <li className="datatable-pagination-list-item datatable-active">
                      <button data-page={1} className="datatable-pagination-list-item-link">
                        1
                      </button>
                    </li>
                    <li className="datatable-pagination-list-item">
                      <button data-page={2} className="datatable-pagination-list-item-link">
                        2
                      </button>
                    </li>
                    <li className="datatable-pagination-list-item">
                      <button data-page={2} className="datatable-pagination-list-item-link">
                        ›
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubCategories;