// UpdateProductModal.jsx
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Modal } from "react-bootstrap";
import { toast } from "react-hot-toast";

const UpdateProductModal = ({ show, handleClose, product, onUpdate }) => {
  if (!product) return null;

  const [previewImage, setPreviewImage] = useState(product.image || "");

  const fieldConfig = [
    { name: "productName", label: "Product Name", type: "text", required: true },
    { name: "image", label: "Image", type: "file", required: true },
    { name: "description", label: "Description", type: "text", required: true },
    { name: "category", label: "Category", type: "select", required: true, options: ["Tool", "Spare Part", "Equipment"] },
    { name: "status", label: "Status", type: "select", required: false, options: ["Active", "Inactive"] },
    { name: "price", label: "price", type: "number", required: true },
    { name: "sku", label: "SKU", type: "text", required: true },
    { name: "stock", label: "Stock", type: "number", required: true },
  ];

  const validationSchema = Yup.object(
    fieldConfig.reduce((schema, field) => {
      if (field.required) schema[field.name] = Yup.string().required(`${field.label} is required`);
      return schema;
    }, {})
  );

  const initialValues = {
    productName: product.name || "",
    image: product.image || "",
    description: product.description || "",
    category: product.category || "",
    status: product.status || "Active",
    price: product.price || "",
    sku: product.sku || "",
    stock: product.stock || "",
  };

  const handleSubmit = (values) => {
    const updatedProduct = {
      ...product,
      name: values.productName,
      image: previewImage,
      description: values.description,
      category: values.category,
      status: values.status,
      price: values.price,
      sku: values.sku,
      stock: values.stock,
    };
    onUpdate(updatedProduct);
    toast.success("Product updated successfully ✨");
    handleClose();
  };

  const handleImageChange = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
      setFieldValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Update Product</Modal.Title>
      </Modal.Header>

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form>
            <Modal.Body>
              <div className="row g-3">
                {fieldConfig.map((field) => (
                  <div className={`col-12 col-md-6`} key={field.name}>
                    <label className="form-label">{field.label}</label>

                    {field.type === "select" ? (
                      <Field as="select" name={field.name} className="form-control">
                        <option value="">Select</option>
                        {field.options.map((opt, i) => (
                          <option value={opt} key={i}>{opt}</option>
                        ))}
                      </Field>
                    ) : field.type === "file" ? (
                      <>
                        <input
                          type="file"
                          className="form-control"
                          onChange={(e) => handleImageChange(e, setFieldValue)}
                        />
                        <img
                          src={previewImage || "/assets/images/default-product.png"}
                          alt="Preview"
                          className="mt-2"
                          style={{ width: "100px", height: "100px", objectFit: "cover", border: "1px solid #ccc" }}
                        />
                      </>
                    ) : (
                      <Field type={field.type} name={field.name} className="form-control" />
                    )}

                    <ErrorMessage name={field.name} component="div" className="text-danger" />
                  </div>
                ))}
              </div>
            </Modal.Body>

            <Modal.Footer>
              <button type="button" className="btn btn-secondary" onClick={handleClose} disabled={isSubmitting}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                Save Changes
              </button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default UpdateProductModal;
