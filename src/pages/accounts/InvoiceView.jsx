// src/pages/admin/SubCategories.jsx
import BreadCrumb from "../../components/BreadCrumb";
import toast from "react-hot-toast";
import { useState } from "react";
import Select from "react-select";

const InvoiceView = () => {
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // Dynamic Invoice Data
  const invoice = {
    id: 123,
    number: "INV - 000457",
    date: "09/08/2025",
    dueDate: "15/08/2025",
    from: {
      name: "Service Nxt",
      address: "2nd Floor, IT Park Road, Gachibowli, Hyderabad, Telangana, India - 500032",
      phone: "+91 98765 43211",
      email: "servicenxt@gmail.com.com",
    },
    to: {
      name: "John Doe",
      address: "Ameerpet, Hyderabad, India",
      phone: "+91 98765 43210",
      email: "john@gmail.com",
    },
    services: [
      { id: 1, name: "Installation Service", amount: 2400, gst: 432 },
      { id: 2, name: "AC Maintenance & Repaire", amount: 1500, gst: 270 },
    ],
    discount: 500,
    taxesPercent: 18,
    note: "It was a pleasure working with you and your team. We hope you will keep us in mind for future freelance projects. Thank You!",
  };

  // Calculations
  const subTotal = invoice.services.reduce((acc, s) => acc + s.amount, 0);
  const taxesAmount = invoice.services.reduce((acc, s) => acc + s.gst, 0);
  const grandTotal = subTotal - invoice.discount + taxesAmount;

  const handleDownload = (id) => {
    console.log("Download invoice:", id);
    const element = document.createElement("a");
    const file = new Blob([`Invoice content for ID: ${id}`], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `Invoice_${id}.txt`;
    document.body.appendChild(element);
    element.click();
  };

  const handlePrint = (id) => {
    console.log("Print invoice:", id);
    window.print();
  };

  const handleShareInvoice = async (e, invoice) => {
    e.stopPropagation();
    const invoiceLink = `${window.location.origin}/invoices/${invoice.id}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: invoice.to.name || "Invoice",
          text: `Invoice for services\n\nView it here:`,
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
        <BreadCrumb subLabel="Accounts" pageTitle="View Invoice" />
      </div>

      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-body">
              <div className="mb-3 d-print-none">
                <ul className="list-inline ms-auto mb-0 d-flex justify-content-end flex-wrap">
                  <li className="list-inline-item align-bottom me-2">
                    <button onClick={() => handleDownload(invoice.id)} className="avtar avtar-s btn-link-secondary">
                      <i className="ph-duotone ph-download-simple f-22" />
                    </button>
                  </li>
                  <li className="list-inline-item align-bottom me-2">
                    <button onClick={() => handlePrint(invoice.id)} className="avtar avtar-s btn-link-secondary">
                      <i className="ph-duotone ph-printer f-22" />
                    </button>
                  </li>
                  <li className="list-inline-item align-bottom me-2">
                    <button onClick={(e) => handleShareInvoice(e, invoice)} className="avtar avtar-s btn-link-secondary">
                      <i className="ph-duotone ph-share-network f-22" />
                    </button>
                  </li>
                </ul>
              </div>

              <div className="card shadow-none bg-body mb-0">
                <div className="card-body">
                  <div className="card">
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-12">
                          <div className="row align-items-center g-3">
                            <div className="col-sm-6">
                              <div className="d-flex align-items-center mb-2 navbar-brand">
                                <img src="../assets/images/logo-dark.png" className="img-fluid logo-lg" alt="images" style={{ width: "100px", height: "auto" }} />
                              </div>
                              <p className="mb-0">{invoice.number}</p>
                            </div>
                            <div className="col-sm-6 text-sm-end">
                              <h6>Date <span className="text-muted f-w-400">{invoice.date}</span></h6>
                              <h6>Due Date <span className="text-muted f-w-400">{invoice.dueDate}</span></h6>
                            </div>
                          </div>
                        </div>

                        <div className="col-sm-6">
                          <div className="border rounded p-3">
                            <h6 className="mb-0">From:</h6>
                            <h5>{invoice.from.name}</h5>
                            <p className="mb-0">{invoice.from.address}</p>
                            <p className="mb-0">{invoice.from.phone}</p>
                            <p className="mb-0">
                              <a href={`mailto:${invoice.from.email}`}>{invoice.from.email}</a>
                            </p>
                          </div>
                        </div>

                        <div className="col-sm-6">
                          <div className="border rounded p-3">
                            <h6 className="mb-0">To:</h6>
                            <h5>{invoice.to.name}</h5>
                            <p className="mb-0">{invoice.to.address}</p>
                            <p className="mb-0">{invoice.to.phone}</p>
                            <p className="mb-0">
                              <a href={`mailto:${invoice.to.email}`}>{invoice.to.email}</a>
                            </p>
                          </div>
                        </div>

                        <div className="col-12">
                          <div className="table-responsive">
                            <table className="table table-hover mb-0">
                              <thead>
                                <tr>
                                  <th>S.No</th>
                                  <th>Service</th>
                                  <th>Amount</th>
                                  <th>GST</th>
                                  <th>Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {invoice.services.map((s, idx) => (
                                  <tr key={s.id}>
                                    <td>{idx + 1}</td>
                                    <td>{s.name}</td>
                                    <td>₹{s.amount.toFixed(2)}</td>
                                    <td>{s.gst ? `₹${s.gst.toFixed(2)}` : "-"}</td>
                                    <td>₹{(s.amount + s.gst).toFixed(2)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <div className="text-start">
                            <hr className="mb-2 mt-1" />
                          </div>
                        </div>

                        <div className="col-12">
                          <div className="invoice-total ms-auto">
                            <div className="row">
                              <div className="col-6">
                                <div className="mb-3">
                                  <label className="form-label">Discount</label>
                                  <h5>₹{invoice.discount.toFixed(2)}</h5>
                                </div>
                              </div>
                              <div className="col-6 text-end">
                                <div className="mb-3">
                                  <label className="form-label">Taxes (GST {invoice.taxesPercent}%)</label>
                                  <h5>₹{taxesAmount.toFixed(2)}</h5>
                                </div>
                              </div>

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
                                <p className="f-w-600 mb-1 text-end text-success">₹{invoice.discount.toFixed(2)}</p>
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

                        <div className="col-12">
                          <label className="form-label">Note</label>
                          <p className="mb-0">{invoice.note}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row d-print-none align-items-center justify-content-end">
                    <div className="col-auto btn-page">
                      <button className="btn btn-primary btn-print-invoice">Print</button>
                      <button className="btn btn-outline-secondary btn-print-invoice">Download</button>
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
