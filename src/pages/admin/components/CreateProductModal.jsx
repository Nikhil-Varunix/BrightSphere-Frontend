import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Modal } from "react-bootstrap";
import { toast } from "react-hot-toast";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const ORG_ID = import.meta.env.VITE_ORG_ID;
const token = localStorage.getItem("authToken");

const CreateProductModal = ({ show, handleClose, onSave }) => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  // Fetch categories
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

  // Fetch subcategories by category
  const fetchSubCategories = async (categoryId) => {
    if (!categoryId) {
      setSubCategories([]);
      return;
    }
    try {
      const res = await axios.get(`${API_URL}/admin/subcategory/category/${categoryId}`, {
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
  }, []);

  // Validation schema
  const validationSchema = Yup.object({
    productName: Yup.string().required("Product Name is required"),
    category: Yup.string().required("Category is required"),
    subcategory: Yup.string().required("Subcategory is required"),
    stock: Yup.number().required("Stock is required"),
    price: Yup.number().required("Price is required"),
    brand: Yup.string().required("Brand is required"),
  });

  // Initial form values
  const initialValues = {
    productName: "",
    category: "",
    subcategory: "",
    stock: "",
    price: "",
    description: "",
    variants: "",
    variantValues: "",
    brand: "",
    manufacturer: "",
    modelNumber: "",
    warranty: "",
    images: [],
  };

  // Submit handler
  const handleSubmit = async (values) => {
    const formData = new FormData();

    formData.append("name", values.productName);
    formData.append("category", values.category);
    formData.append("subcategory", values.subcategory);
    formData.append("stock", values.stock);
    formData.append("price", values.price);
    formData.append("description", values.description);
    formData.append("brand", values.brand);
    formData.append("manufacturer", values.manufacturer);
    formData.append("modelNumber", values.modelNumber);
    formData.append("warranty", values.warranty);
    formData.append("variants", values.variants.split(",").map(v => v.trim()));
    formData.append("variantValues", values.variantValues.split(",").map(v => v.trim()));

    values.images.forEach((file) => {
      formData.append("images", file); // "images" key should match your backend
    });

    try {
      const res = await axios.post(`${API_URL}/admin/product/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("✅ Product created successfully");
      handleClose();
      onSave(res.data.product); // assuming backend returns created product
    } catch (err) {
      console.error(err);
      toast.error("Failed to create product");
    }
  };


  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Create Product</Modal.Title>
      </Modal.Header>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form>
            <Modal.Body>
              <div className="row g-3">

                {/* Product Name */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field
                      type="text"
                      name="productName"
                      className="form-control"
                      placeholder="Product Name"
                    />
                    <label>Product Name</label>
                  </div>
                  <ErrorMessage name="productName" component="div" className="text-danger" />
                </div>

                {/* Brand */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field
                      type="text"
                      name="brand"
                      className="form-control"
                      placeholder="Brand"
                    />
                    <label>Brand</label>
                  </div>
                  <ErrorMessage name="brand" component="div" className="text-danger" />
                </div>

                {/* Category */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field
                      as="select"
                      name="category"
                      className="form-select"
                      placeholder="Category"
                      onChange={(e) => {
                        const value = e.target.value;
                        setFieldValue("category", value);
                        setFieldValue("subcategory", "");
                        fetchSubCategories(value);
                      }}
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option value={cat._id} key={cat._id}>
                          {cat.categoryName}
                        </option>
                      ))}
                    </Field>
                    <label>Category</label>
                  </div>
                  <ErrorMessage name="category" component="div" className="text-danger" />
                </div>

                {/* Subcategory */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field as="select" name="subcategory" className="form-select" placeholder="Subcategory">
                      <option value="">Select Subcategory</option>
                      {subCategories.map((sub) => (
                        <option value={sub._id} key={sub._id}>
                          {sub.subCategoryName}
                        </option>
                      ))}
                    </Field>
                    <label>Subcategory</label>
                  </div>
                  <ErrorMessage name="subcategory" component="div" className="text-danger" />
                </div>

                {/* Stock */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field type="number" name="stock" className="form-control" placeholder="Stock" />
                    <label>Stock</label>
                  </div>
                  <ErrorMessage name="stock" component="div" className="text-danger" />
                </div>

                {/* Price */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field type="number" name="price" className="form-control" placeholder="Price" />
                    <label>Price</label>
                  </div>
                  <ErrorMessage name="price" component="div" className="text-danger" />
                </div>

                {/* Description */}
                <div className="col-md-12">
                  <div className="form-floating">
                    <Field as="textarea" name="description" className="form-control" placeholder="Description" style={{ height: "100px" }} />
                    <label>Description</label>
                  </div>
                </div>

                {/* Variants */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field type="text" name="variants" className="form-control" placeholder="Variants" />
                    <label>Variant Name</label>
                  </div>
                </div>

                {/* Variant Values */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field type="text" name="variantValues" className="form-control" placeholder="Variant Values" />
                    <label>Variant Values (comma-separated, e.g., Red,Blue)</label>
                  </div>
                </div>

                {/* Manufacturer */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field type="text" name="manufacturer" className="form-control" placeholder="Manufacturer" />
                    <label>Manufacturer</label>
                  </div>
                </div>

                {/* Model Number */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field type="text" name="modelNumber" className="form-control" placeholder="Model Number" />
                    <label>Model Number / SKU</label>
                  </div>
                </div>

                {/* Warranty */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <Field type="text" name="warranty" className="form-control" placeholder="Warranty" />
                    <label>Warranty</label>
                  </div>
                </div>

                {/* Product Images */}
                <div className="col-md-6">
                  <div className="form-floating">

                    <input
                      type="file"
                      name="images"
                      className="form-control"
                      multiple
                      accept="image/*"
                      onChange={(event) => {
                        const files = Array.from(event.currentTarget.files);
                        setFieldValue("images", files);
                      }}
                    />
                    <label className="form-label">Product Images</label>
                  </div>
                  <ErrorMessage name="images" component="div" className="text-danger" />
                </div>


              </div>
            </Modal.Body>

            <Modal.Footer>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                Create & Save
              </button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default CreateProductModal;