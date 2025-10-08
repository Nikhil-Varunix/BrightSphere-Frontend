// UpdateSubCategoryModal.jsx
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Modal } from "react-bootstrap";
import { toast } from "react-hot-toast";

const UpdateSubCategoryModal = ({
  show = true,
  handleClose = () => console.log("Modal closed"),
  subCategory = {
    id: 1,
    name: "Default Subcategory",
    categoryId: 101,
    status: "Active",
  }, // default edit data
  categories = [
    { id: 101, name: "Category 1" },
    { id: 102, name: "Category 2" },
    { id: 103, name: "Category 3" },
  ],
  onUpdate = (updated) => console.log("Updated subcategory:", updated),
}) => {
  if (!subCategory) return null;

  // Validation schema
  const validationSchema = Yup.object({
    subCategoryName: Yup.string().required("Subcategory Name is required"),
    categoryId: Yup.string().required("Category is required"),
    status: Yup.string().required("Status is required"),
  });

  // Prefill form with existing subcategory values
  const initialValues = {
    subCategoryName: subCategory.name || "",
    categoryId: String(subCategory.categoryId) || "",
    status: subCategory.status || "Active",
  };

  const handleSubmit = (values) => {
    const updatedSubCategory = {
      ...subCategory,
      name: values.subCategoryName,
      categoryId: Number(values.categoryId),
      status: values.status,
    };
    onUpdate(updatedSubCategory);
    toast.success("Subcategory updated successfully ✨");
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Update Subcategory</Modal.Title>
      </Modal.Header>

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <Modal.Body>
              {/* Subcategory Name */}
              <div className="form-floating mb-3">
                <Field
                  type="text"
                  name="subCategoryName"
                  id="subCategoryName"
                  className="form-control"
                  placeholder="Subcategory Name"
                />
                <label htmlFor="subCategoryName">Subcategory Name</label>
                <ErrorMessage
                  name="subCategoryName"
                  component="div"
                  className="text-danger mt-1"
                />
              </div>

              {/* Category Dropdown */}
              <div className="form-floating mb-3">
                <Field
                  as="select"
                  name="categoryId"
                  id="categoryId"
                  className="form-select"
                  placeholder="Category"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option value={String(cat.id)} key={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </Field>
                <label htmlFor="categoryId">Category</label>
                <ErrorMessage
                  name="categoryId"
                  component="div"
                  className="text-danger mt-1"
                />
              </div>

              {/* Status Dropdown */}
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

export default UpdateSubCategoryModal;
