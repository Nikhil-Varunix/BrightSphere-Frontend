// TaxCompliance.jsx

import BreadCrumb from '../../components/BreadCrumb'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import CreateTaxModal from "./components/CreateTaxModal";
import UpdateTaxModal from "./components/UpdateTaxModal";


const dummyTaxRecords = [
  {
    id: 1,
    taxId: '1',
    filingDate: '2025-07-31',
    entityName: 'ABC Corporation',
    taxType: 'Income Tax', // Income Tax, GST, VAT, etc.
    amount: 1500,
    currency: '₹',
    status: 'Filed', // Filed, Pending, Overdue
    paymentMethod: 'Bank Transfer', // Bank Transfer, Cash, Cheque
    dueDate: '2025-08-15',
  },
  // {
  //   id: 2,
  //   taxId: '2',
  //   filingDate: '2025-07-28',
  //   entityName: 'XYZ Limited',
  //   taxType: 'GST',
  //   amount: 780,
  //   currency: '₹',
  //   status: 'Pending',
  //   paymentMethod: 'Cash',
  //   dueDate: '2025-08-10',
  // },
];

const TaxCompliance = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
const [showUpdateModal, setShowUpdateModal] = useState(false);
const [selectedTax, setSelectedTax] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: "sno", direction: "asc" });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterMethod, setFilterMethod] = useState('');

  const filteredTaxRecords = dummyTaxRecords.filter(record => {
    const matchesSearch =
      record.taxId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.entityName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus ? record.status === filterStatus : true;
    const matchesMethod = filterMethod ? record.paymentMethod === filterMethod : true;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this tax/compliance record?")) {
      toast.success("Record deleted successfully");
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <BreadCrumb pageTitle="Tax & Compliance" subLabel="Accounts" />
        <button
  className="btn d-flex align-content-center btn-primary mt-3"
  onClick={() => setShowCreateModal(true)}
>
  <i className="ti ti-plus f-24"></i> Add Tax Record
</button>

      </div>

      <div className="row">

        {/* Table */}
        <div className="col-12">
          <div className="card">
            <div className="card-body">

              {/* Filters */}
              <div className="row mb-3 g-3 align-items-center">
  <div className="col-md-3">
    <input
      type="text"
      className="form-control "
      placeholder="Search by TAX type, or status"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </div>
</div>


              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
  <th>S.No {renderSortIcons("sno")}</th>
  {/* <th>Entity {renderSortIcons("entity")}</th> */}
  <th>Tax Type {renderSortIcons("taxType")}</th>
  <th>Amount {renderSortIcons("amount")}</th>
  <th>Payment Method {renderSortIcons("paymentMethod")}</th>
  <th>Filing Date {renderSortIcons("filingDate")}</th>
  <th>Due Date {renderSortIcons("dueDate")}</th>
  <th>Status {renderSortIcons("status")}</th>
  <th>Actions</th>
</tr>

                  </thead>
                  <tbody>
                    {filteredTaxRecords.length ? (
                      filteredTaxRecords.map(record => (
                        <tr key={record.id}>
                          <td>{record.taxId}</td>
                          {/* <td className="fw-bold">{record.entityName}</td> */}
                          <td>{record.taxType}</td>
                          <td>{record.amount.toLocaleString("en-IN", { style: "currency",  currency: "INR", minimumFractionDigits: 0 })}</td>  
                          <td>{record.paymentMethod}</td>
                          <td>{new Date(record.filingDate).toLocaleDateString()}</td>
                          <td>{new Date(record.dueDate).toLocaleDateString()}</td>
                          <td>
                            <span className={`p-1 rounded-1 bg-light-${
                              record.status === 'Filed' ? 'success' :
                              record.status === 'Pending' ? 'warning' : 'danger'
                            }`}>
                              {record.status}
                            </span>
                          </td>
                          <td>
                            <ul className="list-inline mb-0 align-items-center">
                              {/* <li className="list-inline-item m-0">
                                <Link to={`/tax/${record.id}`} className="avtar avtar-s btn-link-info btn-pc-default" title="View">
                                  <i className="ti ti-eye f-18" />
                                </Link>
                              </li> */}
                              <li className="list-inline-item m-0">
  <span
    className="avtar avtar-s btn-light-warning cursor-pointer mx-1"
    onClick={() => {
      setSelectedTax(record);
      setShowUpdateModal(true);
    }}
    title="Edit"
  >
    <i className="ti ti-pencil f-18" />
  </span>
</li>

                              <li className="list-inline-item cursor-pointer m-0">
                                <span className="avtar avtar-s btn-light-danger mx-1" onClick={() => handleDelete(record.id)} title="Delete">
                                  <i className="ti ti-trash f-18" />
                                </span>
                              </li>
                            </ul>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="text-center">No tax/compliance records found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <CreateTaxModal
  show={showCreateModal}
  handleClose={() => setShowCreateModal(false)}
  fetchTaxes={() => {}} // Replace with real fetch when API ready
/>

<UpdateTaxModal
  show={showUpdateModal}
  handleClose={() => setShowUpdateModal(false)}
  tax={selectedTax}
  fetchTaxes={() => {}} // Replace with real fetch when API ready
/>

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

      </div>
    </>
  );
}

export default TaxCompliance;
