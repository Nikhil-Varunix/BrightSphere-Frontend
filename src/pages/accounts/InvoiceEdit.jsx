// src/pages/admin/SubCategories.jsx
import BreadCrumb from "../../components/BreadCrumb";
import toast from "react-hot-toast";
import { useState } from "react";

const InvoiceEdit = ({ invoiceData }) => {
  const [invoice, setInvoice] = useState(
    invoiceData || {
      id: "INV-2025-001",
      status: "Paid",
      startDate: "2025-09-08T09:00:00",
      dueDate: "2025-09-15T18:00:00",
      from: {
        name: "Service Nxt",
        address: "2nd Floor, IT Park Road, Gachibowli, Hyderabad, Telangana, India - 500032",
        phone: "+91 98765 43211",
        email: "servicenxt@gmail.com.com",
      },
      to: {
        name: "John Doe",
        address: "456 Corporate Ave, Hyderabad, India",
        phone: "+91 98765 43210",
        email: "john@gmail.com",
      },
      items: [
        {
          id: 1,
          service: "Installation Services",
          description: "Installation of 2 AC units including testing and setup",
          amount: 2400,
          gst: 432,
        },
        {
          id: 2,
          service: "AC Maintenance & Repair",
          description: "Full maintenance of 2 AC units including filter replacement",
          amount: 1500,
          gst: 270,
        },
      ],
      discount: 5,
      taxes: 18,
      note: "Payment due within 7 days. Late payment may incur additional charges.",
      currency: "INR",
    }
  );

  // Handle Download
  const handleDownload = (id) => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(invoice, null, 2)], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = `Invoice_${id}.txt`;
    document.body.appendChild(element);
    element.click();
  };

  // Handle Print
  const handlePrint = () => window.print();

  // Handle Share
  const handleShareInvoice = async (e, invoice) => {
    e.stopPropagation();
    const invoiceLink = `${window.location.origin}/invoices/${invoice.id}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: invoice.to.name || "Invoice",
          text: `Invoice for ${invoice.items.map((i) => i.service).join(", ")}`,
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

  const handleItemChange = (index, key, value) => {
    const newItems = [...invoice.items];
    newItems[index][key] = value;
    setInvoice({ ...invoice, items: newItems });
  };

  const handleInvoiceChange = (key, value) => {
    setInvoice({ ...invoice, [key]: value });
  };

  // Compute totals
  const subTotal = invoice.items.reduce((acc, item) => acc + Number(item.amount) + Number(item.gst), 0);
  const discountAmount = (subTotal * parseFloat(invoice.discount || 0)) / 100;
  const taxesAmount = (subTotal * parseFloat(invoice.taxes || 0)) / 100;
  const grandTotal = subTotal - discountAmount + taxesAmount;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <BreadCrumb subLabel="Accounts" pageTitle="Edit Invoice" />
      </div>

      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-body">
              <div className="row g-3">
                {/* Invoice ID */}
                <div className="col-sm-6 col-xl-3">
                  <div className="mb-0">
                    <label className="form-label">Invoice id</label>
                    <input type="text" className="form-control" value={invoice.id} readOnly />
                  </div>
                </div>

                {/* Status */}
                <div className="col-sm-6 col-xl-3">
                  <div className="mb-0">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      value={invoice.status}
                      onChange={(e) => handleInvoiceChange("status", e.target.value)}
                    >
                      <option>Please Select</option>
                      <option>Paid</option>
                      <option>Unpaid</option>
                      <option>Partial Paid</option>
                    </select>
                  </div>
                </div>

                {/* Start Date */}
                <div className="col-sm-6 col-xl-3">
                  <div className="mb-0">
                    <label className="form-label">Start Date</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={invoice.startDate}
                      onChange={(e) => handleInvoiceChange("startDate", e.target.value)}
                    />
                  </div>
                </div>

                {/* Due Date */}
                <div className="col-sm-6 col-xl-3">
                  <div className="mb-0">
                    <label className="form-label">Due Date</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={invoice.dueDate}
                      onChange={(e) => handleInvoiceChange("dueDate", e.target.value)}
                    />
                  </div>
                </div>

                {/* From Address */}
                <div className="col-xl-6">
                  <div className="border rounded p-3 h-100">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <h6 className="mb-0">From:</h6>
                      <button className="btn btn-sm btn-light-secondary d-flex align-items-center gap-2">
                        <i className="ph-duotone ph-pencil-simple-line" /> Change
                      </button>
                    </div>
                    <h5>{invoice.from.name}</h5>
                    <p className="mb-0">{invoice.from.address}</p>
                    <p className="mb-0">{invoice.from.phone}</p>
                    <p className="mb-0">{invoice.from.email}</p>
                  </div>
                </div>

                {/* To Address */}
                <div className="col-xl-6">
                  <div className="border rounded p-3 h-100">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <h6 className="mb-0">To:</h6>
                      <button className="btn btn-sm btn-light-secondary d-flex align-items-center gap-2">
                        <i className="ph-duotone ph-pencil-simple-line" /> Change
                      </button>
                    </div>
                    <h5>{invoice.to.name}</h5>
                    <p className="mb-0">{invoice.to.address}</p>
                    <p className="mb-0">{invoice.to.phone}</p>
                    <p className="mb-0">{invoice.to.email}</p>
                  </div>
                </div>

                {/* Items Table */}
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
                          <th>Amount</th>
                          <th>
                            <span className="text-danger">*</span>GST
                          </th>
                          <th>Total Amount</th>
                          <th className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoice.items.map((item, index) => (
                          <tr key={item.id}>
                            <td>{index + 1}</td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                value={item.service}
                                onChange={(e) => handleItemChange(index, "service", e.target.value)}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                value={item.amount}
                                onChange={(e) => handleItemChange(index, "amount", e.target.value)}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                value={item.gst}
                                onChange={(e) => handleItemChange(index, "gst", e.target.value)}
                              />
                            </td>
                            <td>₹{(Number(item.amount) + Number(item.gst)).toFixed(2)}</td>
                            <td className="text-center">
                              <a
                                href="#"
                                className="avtar avtar-s btn-link-danger btn-pc-default"
                                onClick={() => {
                                  const newItems = invoice.items.filter((i) => i.id !== item.id);
                                  setInvoice({ ...invoice, items: newItems });
                                }}
                              >
                                <i className="ti ti-trash f-20" />
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="text-start">
                    <hr className="mb-4 mt-0 border-secondary border-opacity-50" />
                    <button
                      className="btn btn-light-primary d-flex align-items-center gap-2"
                      onClick={() => {
                        const newItem = {
                          id: Date.now(),
                          service: "",
                          amount: 1,
                          gst: 0,
                        };
                        setInvoice({ ...invoice, items: [...invoice.items, newItem] });
                      }}
                    >
                      <i className="ti ti-plus" /> Add new item
                    </button>
                  </div>
                </div>

                {/* Totals */}
                <div className="col-12">
                  <div className="invoice-total ms-auto">
                    <div className="row">
                      <div className="col-6">
                        <div className="mb-3">
                          <label className="form-label">Discount(%)</label>
                          <input
                            type="text"
                            className="form-control"
                            value={invoice.discount}
                            onChange={(e) => handleInvoiceChange("discount", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="mb-3">
                          <label className="form-label">Taxes(%)</label>
                          <input
                            type="text"
                            className="form-control"
                            value={invoice.taxes}
                            onChange={(e) => handleInvoiceChange("taxes", e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Compute subtotal, discount, taxes, grand total */}
                      <div className="col-6">
                        <p className="text-muted mb-1 text-start">Sub Total :</p>
                      </div>
                      <div className="col-6">
                        <p className="f-w-600 mb-1 text-end">₹{subTotal.toFixed(2)}</p>
                      </div>
                      <div className="col-6">
                        <p className="text-muted mb-1 text-start">Discount :</p>
                      </div>
                      <div className="col-6">
                        <p className="f-w-600 mb-1 text-end text-success">₹{discountAmount.toFixed(2)}</p>
                      </div>
                      <div className="col-6">
                        <p className="text-muted mb-1 text-start">Taxes :</p>
                      </div>
                      <div className="col-6">
                        <p className="f-w-600 mb-1 text-end">₹{taxesAmount.toFixed(2)}</p>
                      </div>
                      <div className="col-6">
                        <p className="f-w-600 mb-1 text-start">Grand Total :</p>
                      </div>
                      <div className="col-6">
                        <p className="f-w-600 mb-1 text-end">₹{grandTotal.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Note */}
                <div className="col-12">
                  <div className="mb-0">
                    <label className="form-label">Note</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      placeholder="Note"
                      value={invoice.note}
                      onChange={(e) => handleInvoiceChange("note", e.target.value)}
                    />
                  </div>
                </div>

                {/* Currency and Buttons */}
                <div className="col-12">
                  <div className="row align-items-end justify-content-between g-3">
                    <div className="col-sm-auto">
                      <label className="form-label">Set Currency*</label>
                      <select
                        className="form-select w-auto"
                        value={invoice.currency}
                        onChange={(e) => handleInvoiceChange("currency", e.target.value)}
                      >
                        <option>INR (Rupees)</option>
                        <option>USD (US Dollar)</option>
                      </select>
                    </div>
                    <div className="col-sm-auto btn-page">
                      <button className="btn btn-outline-secondary" onClick={() => console.log("Preview invoice")}>
                        Preview
                      </button>
                      <button className="btn btn-primary" onClick={() => console.log("Update & Send", invoice)}>
                        Update &amp; Send
                      </button>
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

export default InvoiceEdit;
