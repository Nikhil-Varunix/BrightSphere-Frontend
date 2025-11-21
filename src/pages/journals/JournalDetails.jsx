import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import BreadCrumb from "../../components/BreadCrumb";

const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = import.meta.env.VITE_BASE_URL;

const JournalDetails = () => {
  const { id } = useParams();
  const [journal, setJournal] = useState(null);

  useEffect(() => {
    const fetchJournal = async () => {
      try {
        const res = await axios.get(`${API_URL}/journals/v2/${id}`);
        if (res.data.success) setJournal(res.data.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch journal details");
      }
    };
    fetchJournal();
  }, [id]);

  const truncateText = (text, max = 300) => {
    if (!text) return "";
    const plain = text.replace(/<\/?[^>]+(>|$)/g, "");
    return plain.length > max ? plain.slice(0, max) + "..." : plain;
  };

  if (!journal) return <p className="text-center py-5">Loading...</p>;

  return (
    <div className="container py-5">
      {/* Breadcrumb & Back */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <BreadCrumb subLabel="Journals" pageTitle={journal.title} />
        <div className="d-flex align-items-start gap-2 flex-wrap">
          <Link to="/journals" className="btn btn-primary">
            <i className="ti ti-arrow-left"></i> Back to Journals
          </Link>
        </div>
      </div>


      {/* Header */}
      <div className="row mb-4">
        <div className="col-md-8">
          <h1 className="fw-bold">{journal.title}</h1>
          <p className="text-muted fs-5">{journal.subTitle}</p>
        </div>
        <div className="col-md-4 text-center">
          <img
            src={journal.coverImage ? `${BASE_URL}/${journal.coverImage}` : "/assets/img/journal/default-cover.jpg"}
            alt="Journal Cover"
            className="img-fluid shadow-sm rounded"
          />
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs invoice-tab border-bottom mb-3" id="journalTab" role="tablist">
        {["About", "Editorial Board", "Articles"].map((t, i) => (
          <li className="nav-item" key={t} role="presentation">
            <button
              className={`nav-link ${i === 0 ? "active" : ""}`}
              data-bs-toggle="tab"
              data-bs-target={`#tab${i + 1}`}
              type="button"
            >
              {t}
            </button>
          </li>
        ))}
      </ul>

      <div className="tab-content">
        {/* About */}
        <div className="tab-pane fade show active" id="tab1">
          <div dangerouslySetInnerHTML={{ __html: journal.content }} />
        </div>

        {/* Editorial Board */}
        <div className="tab-pane fade" id="tab2">
          <div className="row mt-3">
            {journal.editors.length === 0 && <p>No editors assigned yet.</p>}
            {journal.editors.map((e) => (
              <>
                <div className="col-md-6 mb-3" key={e._id}>
                  <div className="p-3 border rounded shadow-sm h-100 d-flex ">
                    <div className="p-3 pt-0">
                      <img 
                      style={{width: "100px", height: "100px", objectFit: "cover"}}
                      src={`${BASE_URL}/${e.coverImage}`}
                       alt="user-image" class="user-avtar rounded-circle shadow-sm"></img>
                    </div>
                    <div>
                      <h5>{e.firstName} {e.lastName}</h5>
                      <p className="mb-0">{e.designation} </p>
                      <p className="mb-0">{e.department} </p>
                      <p className="mb-0">{e.email}</p>
                      <p className="mb-0">{e.university}</p>
                      <p className="mb-0">{e.address}</p>
                    </div>
                  </div>
                </div>
              </>
            ))}
          </div>
        </div>

        {/* Articles */}
        <div className="tab-pane fade" id="tab3">
          {journal.articles.length === 0 && <p className="mt-3">No articles published yet.</p>}

          {journal.articles.map((a) => (
            <Link to={`/articles/article-details/${a._id}`} className="row align-items-center mb-3 article-card" key={a._id}>
              <div className="col-md-4">
                <img
                  src={`${BASE_URL}/${a.coverImage}`}
                  alt={a.title}
                  className="img-fluid rounded shadow-sm"
                />
              </div>
              <div className="col-md-8">


                <div className="d-flex justify-content-between">
                  <div>
                    <h5>{a.title}</h5>
                    <p className="text-muted small">
                      by <strong>{a.authorName}</strong> on {new Date(a.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="me-3"><i className="text-primary ti ti-eye"></i> <span className="text-white">{a.views}</span></span>
                    <span><i className="text-primary ti ti-download"></i> <span className="text-white">{a.downloads}</span></span>
                  </div>
                </div>
                <p style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  color: "whitesmoke"
                }}>
                  {truncateText(a.content)}
                </p>

              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JournalDetails;
