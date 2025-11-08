import { useState, useEffect } from "react";
import BreadCrumb from "../components/BreadCrumb";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = import.meta.env.VITE_BASE_URL;

function EditInPressArticle() {
  const { id } = useParams(); // Article ID from route
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    content: "",
    journal: "",
    document: null,
  });

  const [journals, setJournals] = useState([]);
  const [existingDocument, setExistingDocument] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch journals
  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get(`${API_URL}/journals/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setJournals(res.data.data);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load journals");
      }
    };

    fetchJournals();
  }, []);

  // ✅ Fetch existing article details
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await axios.get(`${API_URL}/inpress-articles?page=1&limit=1000`);
        const article = res.data.data.find((a) => a._id === id);

        if (!article) {
          toast.error("Article not found");
          navigate("/articles/in-press");
          return;
        }

        setFormData({
          title: article.title || "",
          author: article.author || "",
          content: article.content || "",
          journal: article.journal?._id || "",
          document: null,
        });

        setExistingDocument(article.document || null);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load article");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, navigate]);

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // ✅ Submit updated article
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) return toast.error("Title is required");
    if (!formData.author.trim()) return toast.error("Author is required");
    if (!formData.content.trim()) return toast.error("Content is required");
    if (!formData.journal) return toast.error("Journal is required");

    if (formData.document && formData.document.type !== "application/pdf") {
      return toast.error("Only PDF files are allowed");
    }

    try {
      const payload = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) payload.append(key, formData[key]);
      });

      const token = localStorage.getItem("authToken");

      const res = await axios.put(`${API_URL}/inpress-articles/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        toast.success("Article updated successfully!");
        navigate("/articles/in-press");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response.data.message || "Failed to update article");
    }
  };

  if (loading) {
    return <p className="text-center mt-5">Loading...</p>;
  }

  return (
    <>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <BreadCrumb subLabel="Edit In-Press Article" />
        <Link to="/articles/in-press" className="btn btn-primary">
          <i className="ti ti-arrow-left"></i> Back to In-Press Articles
        </Link>
      </div>

      {/* Form */}
      <div className="container mt-4">
        <div className="card shadow-sm">
          <div className="card-header bg-light-primary text-white">
            <h5>Edit In-Press Article</h5>
          </div>

          <div className="card-body">
            <form onSubmit={handleSubmit} className="row g-3">

              {/* Title */}
              <div className="col-md-6">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter article title"
                />
              </div>

              {/* Author */}
              <div className="col-md-6">
                <label>Author</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter author name"
                />
              </div>

              {/* Journal */}
              <div className="col-md-6">
                <label>Journal</label>
                <select
                  name="journal"
                  value={formData.journal}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Select Journal</option>
                  {journals.map((j) => (
                    <option key={j._id} value={j._id}>
                      {j.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* PDF Document */}
              <div className="col-md-6">
                <label>Replace Document (PDF)</label>
                <input
                  type="file"
                  name="document"
                  onChange={handleChange}
                  className="form-control"
                  accept=".pdf"
                />
                {existingDocument && (
                  <div className="mt-2">
                    <a
                      href={`${BASE_URL}/${existingDocument}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm btn-outline-primary"
                    >
                      View Current PDF
                    </a>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="col-12">
                <label>Content / Abstract</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows="6"
                  className="form-control"
                  placeholder="Write your article content here..."
                />
              </div>

              {/* Submit */}
              <div className="col-12">
                <button type="submit" className="btn btn-primary">
                  Update In-Press Article
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditInPressArticle;
