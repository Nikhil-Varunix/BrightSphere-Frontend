// src/pages/Articles.jsx
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import BreadCrumb from "../components/BreadCrumb";
import { useNavigate } from "react-router-dom";

const Articles = () => {
  const [logs, setLogs] = useState([
    {
      id: "1",
      title: "Journal of Earth And Environmental Science",
      tagline: "Exploring Nature, Sustaining the Future",
      description:
        "The Journal of Earth and Environmental Sciences aims to publish high-quality, peer-reviewed research that advances understanding of the earth's systems and their interaction with the environment. The journal provides a platform for scientists, researchers, and practitioners to share original findings, critical reviews, and innovative practices that contribute to sustainable development and environmental stewardship.",
      noofaeditorials: 980,
      noofarticles: 200,
      image: "/assets/images/pages/journal-1.png",
      status: "Active",
    },
  ]);
    const navigate = useNavigate();
  const [filters, setFilters] = useState({ search: "" });
  const [selectedLog, setSelectedLog] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [showInteractionDetails, setShowInteractionDetails] = useState(false);

  // Filtered articles based on search input
  const filteredLogs = logs.filter(
    (l) =>
      l.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      l.author.toLowerCase().includes(filters.search.toLowerCase())
  );

  const handleDelete = (id) => {
    setLogs(logs.filter((l) => l.id !== id));
    toast.success("Article deleted");
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
      {/* Breadcrumb + Create Button */}
     <div className="d-flex justify-content-between align-items-center mb-4">
      <BreadCrumb subLabel="Journals"/>
       <div className="d-flex align-items-start gap-2 flex-wrap">
              <Link to="/journals/create-journal" className="btn btn-primary d-flex align-items-center">
        <i className="ti ti-plus f-24"></i> Create Journal
        </Link>
             </div>
      </div>

      {/* Table */}
      <div className="row">
        <div className="col-12">
          <div className="card table-card">
            <div className="card-body pt-3">
              <div className="d-flex align-items-start mb-3 px-3 justify-content-between flex-wrap gap-2">
        <div className="col-12 col-md-3">
          <input
            type="text"
            className="form-control py-2"
            placeholder="Search by title or Article..."
            value={filters.search}
            onChange={(e) =>
              setFilters({ ...filters, search: e.target.value })
            }
          />
        </div>
      </div>
              <div className="table-responsive">
                <table className="table table-hover">
            <thead>
              <tr>
                <th>S.No {renderSortIcons("serialNumber")}</th>
                <th>Image</th>
                <th>Title {renderSortIcons("title")}</th>
                <th>Description {renderSortIcons("description")}</th>
                <th>No. of Editorials {renderSortIcons("numArticles")}</th>
                <th>No. of Articles {renderSortIcons("numArticles")}</th>
                {/* <th>Submission Date {renderSortIcons("submission")}</th> */}
                {/* <th>Views {renderSortIcons("views")}</th> */}
                {/* <th>Downloads {renderSortIcons("downloads")}</th> */}
                {/* <th>Links {renderSortIcons("links")}</th> */}
                <th>Status {renderSortIcons("status")}</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((l, i) => (
                <tr key={l.id}>
                  <td>{i + 1}</td>
                  <td>
                    <a href={l.links} target="_blank" rel="noopener noreferrer">
                      <img
                        src={l.image}
                        alt={l.title}
                        style={{
                          width: "60px",
                          height: "40px",
                          objectFit: "cover",
                        }}
                      />
                    </a>
                  </td>
                  {/* Title truncated with tooltip */}
                 <td>{l.title}
                  <br /><small className="text-muted">{l.tagline}</small>
                  </td>

                  {/* <td>{l.author}</td> */}
                  {/* Description truncated with tooltip */}
                  <td title={l.description} className="text-truncate" style={{ maxWidth: "180px" }}>
                    {l.description}
                  </td>
                  
                  <td>{l.noofaeditorials}</td>
                  <td>{l.noofarticles}</td>
                  <td>
                    <span
                      className={`badge ${
                        l.status === "Active" ? "bg-light-success" : "bg-light-danger"
                      }`}
                    >
                      {l.status}
                    </span>
                  </td>
                  <td>
                    <button className="avtar avtar-s btn-light-primary mx-1"
                   onClick={() => navigate(`/journal/journal-details/${l.id}`)}>
                    <i className="ti ti-eye"></i>
                    </button>
                   <button className="avtar avtar-s btn-light-warning mx-1"
                   onClick={() => navigate(`/journal/update-journal/${l.id}`)}>
                    <i className="ti ti-pencil"></i>
                    </button>
                    <button
                      className="avtar avtar-s btn-light-danger mx-1"
                      onClick={() => handleDelete(l.id)}
                    >
                      <i className="ti ti-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={11} className="text-center text-muted">
                    No articles found.
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
                      <button data-page={1} className="datatable-pagination-list-item-link">
                        ‹
                      </button>
                    </li>
                    <li className="datatable-pagination-list-item datatable-active">
                      <button data-page={1} className="datatable-pagination-list-item-link">
                        1
                      </button>
                    </li>
                    <li className="datatable-pagination-list-item">
                      <button data-page={2} className="datatable-pagination-list-item-link">
                        2
                      </button>
                    </li>
                    <li className="datatable-pagination-list-item">
                      <button data-page={2} className="datatable-pagination-list-item-link">
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
};

export default Articles;
