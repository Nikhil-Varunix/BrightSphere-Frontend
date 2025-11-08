import { useState, useEffect } from "react";
import BreadCrumb from "../components/BreadCrumb";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

function CreateInPressArticle() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    content: "",
    journal: "",
    document: null,
  });

  const [journals, setJournals] = useState([]);

  // ✅ Fetch all journals
  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get(`${API_URL}/journals/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setJournals(res.data.data);
          if (res.data.data.length > 0) {
            setFormData((prev) => ({
              ...prev,
              journal: res.data.data[0]._id,
            }));
          }
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load journals");
      }
    };
    fetchJournals();
  }, []);

  // ✅ Handle input and file changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) return toast.error("Title is required");
    if (!formData.author.trim()) return toast.error("Author is required");
    if (!formData.content.trim()) return toast.error("Content is required");
    if (!formData.journal) return toast.error("Please select a journal");
    if (!formData.document) return toast.error("Please upload a PDF document");

    if (formData.document.type !== "application/pdf") {
      return toast.error("Only PDF files are allowed");
    }

    try {
      const payload = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) payload.append(key, formData[key]);
      });

      const token = localStorage.getItem("authToken");

      const res = await axios.post(`${API_URL}/inpress-articles`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        toast.success("In-Press Article created successfully!");
        navigate("/articles/in-press");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response.data.message ||"Failed to create in-press article");
    }
  };

  return (
    <>
      {/* ✅ Header and Back Button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <BreadCrumb subLabel="Create In-Press Article" />
        <Link to="/articles/in-press" className="btn btn-primary">
          <i className="ti ti-arrow-left"></i> Back to In-Press Articles
        </Link>
      </div>

      {/* ✅ Form */}
      <div className="container mt-4">
        <div className="card shadow-sm">
          <div className="card-header bg-light-primary text-white">
            <h5>Create In-Press Article</h5>
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
                <label>Document (PDF)</label>
                <input
                  type="file"
                  name="document"
                  onChange={handleChange}
                  className="form-control"
                  accept=".pdf"
                />
              </div>

              {/* Content / Abstract */}
              <div className="col-12">
                <label>Content / Abstract</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows="6"
                  className="form-control"
                  placeholder="Write your article content or abstract here..."
                />
              </div>

              {/* Submit */}
              <div className="col-12">
                <button type="submit" className="btn btn-primary">
                  Submit In-Press Article
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateInPressArticle;
