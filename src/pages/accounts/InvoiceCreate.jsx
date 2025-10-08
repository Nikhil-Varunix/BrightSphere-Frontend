// src/pages/admin/SubCategories.jsx
import BreadCrumb from "../../components/BreadCrumb";
import toast from "react-hot-toast";
import { useState } from "react";
import Select from "react-select";

const InvoiceView = () => {
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // Replace invoiceId with the actual id from your data
  const invoiceId = 123;

  const handleDownload = (id) => {
    console.log("Download invoice:", id);
    // Example: simulate download
    const element = document.createElement("a");
    const file = new Blob(["Invoice content for ID: " + id], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = `Invoice_₹{id}.txt`;
    document.body.appendChild(element);
    element.click();
  };

  const handlePrint = (id) => {
    console.log("Print invoice:", id);
    window.print(); // prints the page
  };

  // Share Invoice
  const handleShareInvoice = async (e, invoice) => {
    e.stopPropagation();
    const invoiceLink = `₹{window.location.origin}/invoices/₹{invoice.id}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: invoice.customer || "Invoice",
          text: `Invoice for ₹{invoice.service || "service"}\n\nView it here:`,
          url: invoiceLink,
        });
      } else {
        await navigator.clipboard.writeText(invoiceLink);
        toast.success("Invoice link copied to clipboard!");
      }
    } catch (err) {
      toast.error("Failed to share invoice");
      console.error("Share failed:", err);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <BreadCrumb
          subLabel="Accounts"
          pageTitle="Create Invoice"
          subUrl="/subcategories"
        />
      </div>

      <div className="row">
    <div className="col-sm-12">
      <div className="card">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-sm-6 col-xl-3">
              <div className="mb-0">
                <label className="form-label">Invoice id</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="#xxxx"
                />
              </div>
            </div>
            <div className="col-sm-6 col-xl-3">
              <div className="mb-0">
                <label className="form-label">Status</label>
                <select className="form-select" id="exampleFormControlSelect1">
                  <option>Please Select</option>
                  <option>Paid</option>
                  <option>Unpaid</option>
                  <option>Partial Paid</option>
                </select>
              </div>
            </div>
            <div className="col-sm-6 col-xl-3">
              <div className="mb-0">
                <label className="form-label">Start Date</label>
                <input type="datetime-local" className="form-control" />
              </div>
            </div>
            <div className="col-sm-6 col-xl-3">
              <div className="mb-0">
                <label className="form-label">Due Date</label>
                <input type="datetime-local" className="form-control" />
              </div>
            </div>
            <div className="col-xl-6">
              <div className="border rounded p-3 h-100">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <h6 className="mb-0">From:</h6>
                  <button
                    className="btn btn-sm btn-light-secondary d-flex align-items-center gap-2"
                    data-bs-toggle="modal"
                    data-bs-target="#address-edit_add-modal"
                  >
                    <i className="ph-duotone ph-pencil-simple-line" /> Change
                  </button>
                </div>
                <h5>Service Nxt</h5>
                <p className="mb-0">2nd Floor, IT Park Road, Gachibowli, Hyderabad, Telangana, India - 500032</p>
                <p className="mb-0">98765 43211</p>
                <p className="mb-0">
                  <a
                    href="/cdn-cgi/l/email-protection"
                    className="__cf_email__"
                    data-cfemail="395b4b58575d5657090e7949505c4b5a5c175a5654"
                  >
                   servicenxt@gmail.com.com
                  </a>
                </p>
              </div>
            </div>
            <div className="col-xl-6">
              <div className="border rounded p-3 h-100">
                <div className="d-flex align-items-center justify-content-between">
                  <h6 className="mb-0">To:</h6>
                  <button
                    className="btn btn-sm btn-light-secondary d-flex align-items-center gap-2"
                    data-bs-toggle="modal"
                    data-bs-target="#address-edit_add-modal"
                  >
                    <i className="ph-duotone ph-plus-circle" /> Add
                  </button>
                </div>
              </div>
            </div>
            <div className="col-12">
              <h5>Detail</h5>
              <div className="table-responsive">
  <table className="table table-hover mb-0">
    <thead>
      <tr>
        <th>S.No</th>
        <th>
          <span className="text-danger">*</span>Service
        </th>
        {/* <th>
          <span className="text-danger">*</span>Description
        </th> */}
        {/* <th>
          <span className="text-danger">*</span>Qty
        </th> */}
        <th>
          <span className="text-danger">*</span>Amount
        </th>
        <th>
          <span className="text-danger">*</span>GST %
        </th>
        {/* <th>Tax Amount</th> */}
        <th>Total Amount</th>
        <th className="text-center">Action</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>
          <input
            type="text"
            className="form-control"
            placeholder="Name"
          />
        </td>
        {/* <td>
          <input
            type="text"
            className="form-control"
            placeholder="Description"
          />
        </td> */}
        {/* <td>
          <input
            type="number"
            className="form-control"
            placeholder="Qty"
          />
        </td> */}
        <td>
          <input
            type="number"
            className="form-control"
            placeholder="Price"
          />
        </td>
        <td>
          <input
            type="number"
            className="form-control"
            placeholder="GST %"
          />
        </td>
        {/* <td>
          <input
            type="number"
            className="form-control"
            placeholder="TAX"
          />
        </td> */}
        {/* <td>₹0.00</td> */}
        <td>₹0.00</td>
        <td className="text-center">
          <a
            href="#"
            className="avtar avtar-s btn-link-danger btn-pc-default"
          >
            <i className="ti ti-trash f-20" />
          </a>
        </td>
      </tr>
    </tbody>
  </table>
</div>

              <div className="text-start">
                <hr className="mb-4 mt-0 border-secondary border-opacity-50" />
                <button className="btn btn-light-primary d-flex align-items-center gap-2">
                  <i className="ti ti-plus" /> Add new item
                </button>
              </div>
            </div>
            <div className="col-12">
                  <div className="invoice-total ms-auto">
                    <div className="row">
                      <div className="col-6">
                        <div className="mb-3">
                          <label className="form-label">Discount(%)</label>
                          <input type="text" className="form-control" defaultValue={5} />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="mb-3">
                          <label className="form-label">Taxes (GST 18%)</label>
                          <input type="text" className="form-control" defaultValue={4000} />
                        </div>
                      </div>
                      <div className="col-6">
                        <p className="text-muted mb-1 text-start">Sub Total :</p>
                      </div>
                      <div className="col-6">
                        <p className="f-w-600 mb-1 text-end">₹22,700.00</p>
                      </div>
                      <div className="col-6">
                        <p className="text-muted mb-1 text-start">Discount :</p>
                      </div>
                      <div className="col-6">
                        <p className="f-w-600 mb-1 text-end text-success">₹1,135.00</p>
                      </div>
                      <div className="col-6">
                        <p className="text-muted mb-1 text-start">Taxes :</p>
                      </div>
                      <div className="col-6">
                        <p className="f-w-600 mb-1 text-end">₹4,000.00</p>
                      </div>
                      <div className="col-6">
                        <p className="f-w-600 mb-1 text-start">Grand Total :</p>
                      </div>
                      <div className="col-6">
                        <p className="f-w-600 mb-1 text-end">₹25,565.00</p>
                      </div>
                    </div>
                  </div>
                </div>
            <div className="col-12">
              <div className="mb-0">
                <label className="form-label">Note</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Note"
                  defaultValue={""}
                />
              </div>
            </div>
            <div className="col-12">
              <div className="row align-items-end justify-content-between g-3">
                <div className="col-sm-auto">
                  <label className="form-label">Set Currency*</label>
                  <select className="form-select w-auto">
                    <option>USD (US Dollar)</option>
                    <option>INR (Rupes)</option>
                  </select>
                </div>
                <div className="col-sm-auto btn-page">
                  <a
                    href="../application/invoice-view.html"
                    className="btn btn-outline-secondary"
                  >
                    Preview
                  </a>
                  <button className="btn btn-outline-secondary">Save</button>
                  <button className="btn btn-primary">Create &amp; Send</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
    </>
  );
};

export default InvoiceView;

