import React from "react";
import BreadCrumb from "../../components/BreadCrumb";

const AddProduct = () => {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <BreadCrumb subLabel="Admin" pageTitle="Products" subUrl="/Addproduct" />
      </div>

      <div className="row">
        {/* [ Left Column ] */}
        <div className="col-xl-6">
          {/* Product Details */}
          <div className="card mb-3">
            <div className="card-header">
              <h5>Product Details</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Product Name"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Category</label>
                <select className="form-select">
                  <option>Sneakers</option>
                  <option>Category 1</option>
                  <option>Category 2</option>
                  <option>Category 3</option>
                  <option>Category 4</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Sub Category</label>
                <select className="form-select">
                  <option>Generator</option>
                  <option>Laptop</option>
                  <option>Washing Machine</option>
                  <option>Category 1</option>
                  <option>Category 2</option>
                </select>
              </div>
              <div className="mb-0">
                <label className="form-label">Product Description</label>
                <textarea
                  className="form-control"
                  placeholder="Enter Product Description"
                />
              </div>
            </div>
          </div>

          {/* Product Image */}
          <div className="card mb-3">
            <div className="card-header">
              <h5>Product Image</h5>
            </div>
            <div className="card-body">
              <p>
                <span className="text-danger">*</span> Recommended resolution is
                640×640 with file size limit
              </p>
              <label className="btn btn-outline-secondary" htmlFor="flupld">
                <i className="ti ti-upload me-2" /> Click to Upload
              </label>
              <input type="file" id="flupld" className="d-none" />
            </div>
          </div>

          {/* Variant */}
          <div className="card mb-3">
            <div className="card-header">
              <h5>Variant</h5>
            </div>
            <div className="card-body">
              <input
                className="form-control"
                type="text"
                defaultValue="Product variants, Variant 2"
                placeholder="Enter Variants"
              />
            </div>
          </div>
        </div>

        {/* [ Right Column ] */}
        <div className="col-xl-6">

           {/* Inventory */}
          <div className="card">
            <div className="card-header">
              <h5>Inventory</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Stock Quantity</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter Stock Quantity"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">
                  SKU <span className="text-sm text-muted">(optional)</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter SKU"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Manufacture</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Manufacturer Name"
                />
              </div>
              <div className="mb-0">
                <label className="form-label">Warranty</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Warranty (e.g. 1 Year)"
                />
              </div>
            </div>
          </div>
         

          {/* Size Selection */}
          <div className="card mb-3">
            <div className="card-header">
              <h5>Select Size</h5>
            </div>
            <div className="card-body">
              <div className="row g-2">
                {["34", "36", "38", "40", "42"].map((size, i) => (
                  <div className="col-auto" key={i}>
                    <input
                      type="radio"
                      className="btn-check"
                      id={`btnrdolite${i}`}
                      name="btn_radio2"
                    />
                    <label
                      className="btn btn-sm btn-light-primary"
                      htmlFor={`btnrdolite${i}`}
                    >
                      {size}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="card">
            <div className="card-header">
              <h5>Pricing</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label d-flex align-items-center">
                  Price
                  <i
                    className="ph-duotone ph-info ms-1"
                    data-bs-toggle="tooltip"
                    data-bs-title="Price"
                  />
                </label>
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter Price"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="col-sm-12 mt-3">
          <div className="card">
            <div className="card-body text-end btn-page">
              <button className="btn btn-primary mb-0">Save Product</button>
              <button className="btn btn-outline-secondary mb-0 ms-2">
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProduct;
