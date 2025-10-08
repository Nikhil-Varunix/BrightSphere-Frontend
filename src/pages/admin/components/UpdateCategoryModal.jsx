// UpdateCategoryModal.jsx
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Modal } from "react-bootstrap";
import { toast } from "react-hot-toast";

const UpdateCategoryModal = ({ show, handleClose, category, onUpdate }) => {
  if (!category) return null;

  // Default/fallback values
  const defaultCategory = {
    name: "Electronics",
    status: "Active",
    image: "https://via.placeholder.com/120?text=Category",
  };

  const [previewImage, setPreviewImage] = useState(category.image || defaultCategory.image);

  // Validation schema
  const validationSchema = Yup.object({
    categoryName: Yup.string().required("Category Name is required"),
    status: Yup.string().required("Status is required"),
  });

  // Prefill with existing category values + defaults
  const initialValues = {
    categoryName: category.name || defaultCategory.name,
    status: category.status || defaultCategory.status,
    image: null,
  };

  // Handle image preview
  const handleImageChange = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
      setFieldValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit handler
  const handleSubmit = (values, { setSubmitting }) => {
    const updatedCategory = {
      ...category,
      name: values.categoryName,
      status: values.status,
      image: values.image || category.image || defaultCategory.image,
    };
    onUpdate(updatedCategory);
    toast.success("Category updated successfully ✨");
    handleClose();
    setSubmitting(false);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Update Category</Modal.Title>
      </Modal.Header>

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, isSubmitting }) => (
          <Form>
            <Modal.Body>
              {/* Category Name */}
              <div className="form-floating mb-3">
                <Field
                  type="text"
                  name="categoryName"
                  id="categoryName"
                  className="form-control"
                  placeholder="Category Name"
                />
                <label htmlFor="categoryName">Category Name</label>
                <ErrorMessage
                  name="categoryName"
                  component="div"
                  className="text-danger mt-1"
                />
              </div>

              {/* Status */}
              <div className="form-floating mb-3">
                <Field
                  as="select"
                  name="status"
                  id="status"
                  className="form-select"
                  placeholder="Status"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </Field>
                <label htmlFor="status">Status</label>
                <ErrorMessage
                  name="status"
                  component="div"
                  className="text-danger mt-1"
                />
              </div>

              {/* Image Upload */}
              <div className="mb-3">
                <label className="form-label fw-bold">Category Image</label>
                <input
                  type="file"
                  name="image"
                  className="form-control"
                  onChange={(e) => handleImageChange(e, setFieldValue)}
                  accept="image/*"
                />
                {previewImage && (
                  <div className="mt-2">
                    <img
                      src={previewImage}
                      alt="Preview"
                      style={{
                        width: "120px",
                        height: "120px",
                        objectFit: "cover",
                        borderRadius: "6px",
                      }}
                    />
                  </div>
                )}
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
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                Save Changes
              </button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default UpdateCategoryModal;
