import BreadCrumb from "../../components/BreadCrumb";
import toast from "react-hot-toast";
import { useState } from "react";

const Variants = () => {
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // ✅ Products list with optional weight & dimensions
  const [products] = useState([
    { id: 2, name: "LG 7kg Front Load", weight: 55, dimensions: "60×60×85" },
    { id: 3, name: "Honda EU2200i Portable Inverter Generator" }, // No weight/dim
    { id: 1, name: "Dell Inspiron 15", weight: 2, dimensions: "35×25×2" },
  ]);

  // ✅ Variants linked to products
  const [variants, setVariants] = useState([
    {
      id: "V101",
      productId: 2,
      attributes: "Capacity: 7kg, Color: White, Type: Front Load",
      status: "Active",
    },
    {
      id: "V102",
      productId: 3,
      attributes: "Blue, 2200W Output",
      status: "Inactive",
    },
    {
      id: "V103",
      productId: 1,
      attributes: "RAM: 16GB, Storage: 512GB, Color: Silver",
      status: "Active",
    },
  ]);

  // 🔹 Edit
  const handleEditClick = (e, variant) => {
    e.preventDefault();
    setSelectedVariant(variant);
    setShowUpdateModal(true);
    toast("Edit variant clicked (modal to be implemented)");
  };

  // 🔹 Delete
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this variant?")) {
      setVariants((prev) => prev.filter((v) => v.id !== id));
      toast.success("Variant deleted successfully");
    }
  };

  // 🔹 Get product info by productId
  const getProductInfo = (productId) => {
    return products.find((p) => p.id === productId) || {};
  };

  // 🔹 Render triangle sort icons
  const renderSortIcons = (key) => (
    <span style={{ display: "inline-flex", flexDirection: "column", marginLeft: "5px", verticalAlign: "middle" }}>
      <span
        style={{
          cursor: "pointer",
          fontSize: "10px",
          lineHeight: "12px",
          color: sortConfig.key === key && sortConfig.direction === "asc" ? "#000" : "#ccc",
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
          color: sortConfig.key === key && sortConfig.direction === "desc" ? "#000" : "#ccc",
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
        <BreadCrumb subLabel="Admin" pageTitle="Variants" subUrl="/variants" />
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card table-card">
            <div className="card-body pt-3">
              {/* Variants Table */}
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>S.No {renderSortIcons("sno")}</th>
                      <th>Variant {renderSortIcons("product")}</th>
                      <th>Attributes {renderSortIcons("attributes")}</th>
                      <th>Weight (kg)</th>
                      <th>Dimensions (L×W×H cm)</th>
                      <th>Status {renderSortIcons("status")}</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {variants.map((v, idx) => {
                      const product = getProductInfo(v.productId);
                      return (
                        <tr key={v.id}>
                          <td>{idx + 1}</td>
                          <td>{product.name || "Unknown Product"}</td>
                          <td>{v.attributes}</td>
                          <td>{product.weight ?? "--"}</td>
                          <td>{product.dimensions ?? "--"}</td>
                          <td>
                            <span
                              className={`badge ${v.status === "Active" ? "bg-success" : "bg-secondary"}`}
                            >
                              {v.status}
                            </span>
                          </td>
                          <td>
                            <ul className="list-inline m-0">
                              <li className="list-inline-item">
                                <span
                                  title="Edit"
                                  onClick={(e) => handleEditClick(e, v)}
                                  className="avtar avtar-s btn-link-success btn-pc-default"
                                >
                                  <i className="ti ti-pencil f-18" />
                                </span>
                              </li>
                              <li className="list-inline-item cursor-pointer">
                                <span
                                  className="avtar avtar-s btn-link-secondary btn-pc-default"
                                  title="Delete"
                                  onClick={() => handleDelete(v.id)}
                                >
                                  <i className="ti ti-trash f-18" />
                                </span>
                              </li>
                            </ul>
                          </td>
                        </tr>
                      );
                    })}
                    {variants.length === 0 && (
                      <tr>
                        <td colSpan="7" className="text-center text-muted">
                          No variants found
                        </td>
                      </tr>
                    )}
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

export default Variants;
