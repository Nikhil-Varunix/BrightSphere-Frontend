
import BreadCrumb from '../../components/BreadCrumb'

import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast';
import { useState } from 'react';


const dummyInvoices = [
  {
    id: 1,
    number: '1',
    date: '2025-09-08T10:40:30.767Z',
    party: 'John Doe',
    partyType: 'Client', // Client or Vendor
    amount: 12500,
    currency: '₹',
    status: 'Paid', // Paid, Pending, Overdue
    type: 'Installation Services', // Issued, Received
    dueDate: '2025-09-14T10:40:30.767Z',
    paymentTerms: 'Net 15',
    description: 'Web development services for July',
    createdBy: 'Alice Johnson',
    generatedDate:'09/08/2025',
    createdAt: '09/08/2025',
    attachments: 2,
  },
  // More entries can be added as needed
];


const Invoices = () => {
  const [filterDate, setFilterDate] = useState("");

  const [sortConfig, setSortConfig] = useState({ key: "sno", direction: "asc" });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');

  // Filter invoices based on search and filters
  const filteredInvoices = dummyInvoices.filter(inv => {
    const matchesSearch = inv.number.toLowerCase().includes(searchTerm.toLowerCase()) || inv.party.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus ? inv.status === filterStatus : true;
    const matchesType = filterType ? inv.type === filterType : true;
    return matchesSearch && matchesStatus && matchesType;
  });


  const handleDelete = () => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (confirmed) {
      // delete logic
      toast.success("User deleted successfully");
    }
  };
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
        <BreadCrumb pageTitle="Invoices" subLabel="Accounts" />
       <Link to="/accounts/invoice-Create" className="btn d-flex align-content-center btn-primary mt-3 mb-4"> 
       <i className="ti ti-plus f-24"></i> Create Invoice</Link>
      </div>

      <div className="row">

        {/* [ Row 1 ] start */}
        <div className="col-12 col-md-4">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="avtar bg-light-primary">
                    <i className="ti ti-file-invoice f-24"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <p className="mb-1">Total Invoices</p>
                  <div className="d-flex align-items-center justify-content-between">
                    <h4 className="mb-0">1,250</h4>
                    {/* <span className="text-primary fw-medium">+12.4%</span> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="avtar bg-light-success">
                    <i className="ti ti-file-check f-24"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <p className="mb-1">Paid Invoices</p>
                  <div className="d-flex align-items-center justify-content-between">
                    <h4 className="mb-0">890</h4>
                    <span className="text-success fw-medium">+8.7%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="avtar bg-light-warning">
                    <i className="ti ti-file f-24"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <p className="mb-1">Pending Invoices</p>
                  <div className="d-flex align-items-center justify-content-between">
                    <h4 className="mb-0">360</h4>
                    <span className="text-warning fw-medium">-4.3%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* [ Row 1 ] end */}

        {/* [ Row 2 ] start */}


        <div className="col-12">
          <div className="card">

            <div className="card-body">
              {/* Filters */}
              <div className="row mb-3 g-3">
  <div className="col-md-3">
    <input
      type="text"
      className="form-control"
      style={{ maxWidth: "400px", margin: "0 auto" }} // medium width
      placeholder="Search by customer or service"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </div>
  <div className="col-md-2">
    <input
      type="date"
      className="form-control"
      value={filterDate}
      onChange={(e) => setFilterDate(e.target.value)}
    />
  </div>
</div>


              {/* Table */}
              <div className="table-responsive">
                <table className="table  table-hover align-middle">
                  <thead>
                    <tr>
  <th>S.No {renderSortIcons("sno")}</th>
  <th>Customer {renderSortIcons("customer")}</th>
  <th>Category {renderSortIcons("category")}</th>
  <th>Service {renderSortIcons("service")}</th>
  <th>Due Date {renderSortIcons("dueDate")}</th>
  <th>Generated Date {renderSortIcons("generatedDate")}</th>
  <th>Amount {renderSortIcons("amount")}</th>
  <th>Status {renderSortIcons("status")}</th>
  {/* <th>Payment Terms {renderSortIcons("paymentTerms")}</th> */}
  {/* <th>Attachments {renderSortIcons("attachments")}</th> */}
  <th>Actions</th>
</tr>

                  </thead>
                  <tbody>
                    {filteredInvoices.length ? (
                      filteredInvoices.map(inv => (
                        <tr key={inv.id}>
                          <td>{inv.number}</td>
                          
                          <td className='fw-bold'>{inv.party}</td>
                          <td>{inv.partyType}</td>
                          
                          <td>{inv.type}</td>
                          <td>{new Date(inv.dueDate).toLocaleDateString()}</td>
                          <td>{new Date(inv.date).toLocaleDateString()}</td>
                          
                          <td> {inv.amount.toLocaleString("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 })}
                          </td>
                          <td>
                            <span
                              className={`btn btn-sm btn-light-${inv.status === 'Paid' ? 'success' :
                                inv.status === 'Pending' ? 'warning' :
                                  'danger'
                                }`}
                            >
                              {inv.status}
                            </span>
                          </td>
                          {/* <td>{inv.paymentTerms}</td> */}
                          {/* <td>
              <span className="badge bg-info">{inv.attachments}</span>
            </td> */}
                          <td>
  <ul className="list-inline mb-0 align-items-center d-flex gap-2">
    <li className="list-inline-item m-0">
      <Link
        to="/accounts/invoice-view"
        className="avtar avtar-s btn-light-primary"
      >
        <i className="ti ti-eye f-18" />
      </Link>
    </li>
    <li className="list-inline-item m-0">
      <Link
        to="/accounts/invoice-Edit"
        className="avtar avtar-s btn-light-warning"
      >
        <i className="ti ti-pencil f-18" />
      </Link>
    </li>
    <li className="list-inline-item cursor-pointer m-0">
      <span
        className="avtar avtar-s btn-light-danger"
        onClick={handleDelete}
      >
        <i className="ti ti-trash f-18" />
      </span>
    </li>
  </ul>
</td>

                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="11" className="text-center">
                          No invoices found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="datatable-bottom">
                <div className="datatable-info">Showing 1 to 5 of 6 entries</div>
                <nav className="datatable-pagination">
                  <ul className="datatable-pagination-list">
                    <li className="datatable-pagination-list-item datatable-hidden datatable-disabled">
                      <button
                        data-page={1}
                        className="datatable-pagination-list-item-link"
                        aria-label="Page 1"
                      >
                        ‹
                      </button>
                    </li>
                    <li className="datatable-pagination-list-item datatable-active">
                      <button
                        data-page={1}
                        className="datatable-pagination-list-item-link"
                        aria-label="Page 1"
                      >
                        1
                      </button>
                    </li>
                    <li className="datatable-pagination-list-item">
                      <button
                        data-page={2}
                        className="datatable-pagination-list-item-link"
                        aria-label="Page 2"
                      >
                        2
                      </button>
                    </li>
                    <li className="datatable-pagination-list-item">
                      <button
                        data-page={2}
                        className="datatable-pagination-list-item-link"
                        aria-label="Page 2"
                      >
                        ›
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
        {/* [ Row 2 ] end */}



      </div>

    </>
  )
}

export default Invoices