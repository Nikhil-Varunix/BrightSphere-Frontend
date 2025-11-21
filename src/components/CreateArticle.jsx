import { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import BreadCrumb from "../components/BreadCrumb";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

function CreateArticle() {
  const quillRef = useRef();
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    content: "",
    journal: "",
    volume: "",
    issue: "",
    coverImage: null,
    pdfFile: null, // ✅ PDF file added
    articleType: "",
  });

  const [journals, setJournals] = useState([]);
  const [volumes, setVolumes] = useState([]);
  const [issues, setIssues] = useState([]);

  // Fetch journals
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
            setFormData(prev => ({ ...prev, journal: res.data.data[0]._id }));
          }
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load journals");
      }
    };
    fetchJournals();
  }, []);

  // Fetch volumes when journal changes
  useEffect(() => {
    const fetchVolumes = async () => {
      if (!formData.journal) {
        setVolumes([]);
        setFormData(prev => ({ ...prev, volume: "", issue: "" }));
        setIssues([]);
        return;
      }
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get(`${API_URL}/volumes?limit=1000`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          const filtered = res.data.data.filter(v => v.journal._id === formData.journal);
          setVolumes(filtered);
          setFormData(prev => ({ ...prev, volume: "", issue: "" }));
          setIssues([]);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load volumes");
      }
    };
    fetchVolumes();
  }, [formData.journal]);

  // Fetch issues when volume changes
  useEffect(() => {
    const fetchIssues = async () => {
      if (!formData.volume) {
        setIssues([]);
        setFormData(prev => ({ ...prev, issue: "" }));
        return;
      }
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get(`${API_URL}/issues?limit=1000`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          const filtered = res.data.data.filter(i => i.volume._id === formData.volume);
          setIssues(filtered);
          setFormData(prev => ({ ...prev, issue: "" }));
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load issues");
      }
    };
    fetchIssues();
  }, [formData.volume]);

  // ✅ Handle input changes including files
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]:
        name === "coverImage" || name === "pdfFile"
          ? files[0]
          : value,

      ...(name === "journal" ? { volume: "", issue: "" } : {}),
      ...(name === "volume" ? { issue: "" } : {}),
    }));
  };

  const handleContentChange = value =>
    setFormData(prev => ({ ...prev, content: value }));

  // ✅ Submit article with cover image + PDF
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.author || !formData.journal || !formData.volume) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const payload = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          payload.append(key, formData[key]);
        }
      });

      const token = localStorage.getItem("authToken");
      const res = await axios.post(`${API_URL}/articles`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        toast.success("Article created successfully!");

        setFormData({
          title: "",
          author: "",
          content: "",
          journal: "",
          volume: "",
          issue: "",
          coverImage: null,
          pdfFile: null, // ✅ reset PDF file
          articleType: "",
        });

        setVolumes([]);
        setIssues([]);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create article");
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <BreadCrumb subLabel="Create Article" />
        <Link to="/articles" className="btn btn-primary">
          <i className="ti ti-arrow-left"></i> Back to Articles
        </Link>
      </div>

      <div className="container mt-4">
        <div className="card shadow-sm">
          <div className="card-header bg-light-primary text-white">
            <h5>Create Article</h5>
          </div>

          <div className="card-body">
            <form onSubmit={handleSubmit} className="row g-3">

              <div className="col-md-6">
                <label>Title</label>
                <input type="text" name="title" value={formData.title}
                  onChange={handleChange} className="form-control" required />
              </div>

              <div className="col-md-6">
                <label>Author</label>
                <input type="text" name="author" value={formData.author}
                  onChange={handleChange} className="form-control" required />
              </div>

              <div className="col-md-6">
                <label>Journal</label>
                <select name="journal" value={formData.journal}
                  onChange={handleChange} className="form-select" required>
                  <option value="">Select Journal</option>
                  {journals.map(j => (
                    <option key={j._id} value={j._id}>{j.title}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label>Volume</label>
                <select name="volume" value={formData.volume}
                  onChange={handleChange} className="form-select"
                  disabled={!volumes.length} required>
                  <option value="">Select Volume</option>
                  {volumes.map(v => (
                    <option key={v._id} value={v._id}>{v.volumeName}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label>Issue</label>
                <select name="issue" value={formData.issue}
                  onChange={handleChange} className="form-select"
                  disabled={!issues.length}>
                  <option value="">Select Issue</option>
                  {issues.map(i => (
                    <option key={i._id} value={i._id}>{i.issueName}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label>Article Type</label>
                <select name="articleType" value={formData.articleType}
                  onChange={handleChange} className="form-select" required>
                  <option value="">Select Type</option>
                  <option value="Research Paper">Research Paper</option>
                  <option value="Review Article">Review Article</option>
                  <option value="Case Study">Case Study</option>
                  <option value="Short Communication">Short Communication</option>
                  <option value="Editorial">Editorial</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="col-12">
                <label>Cover Image</label>
                <input type="file" name="coverImage"
                  onChange={handleChange} className="form-control"
                  accept="image/*" />
              </div>

              {/* ✅ PDF Upload Field */}
              <div className="col-12">
                <label>PDF File</label>
                <input type="file" name="pdfFile"
                  onChange={handleChange} className="form-control"
                  accept="application/pdf" />
              </div>

              <div className="col-12 mt-3">
                <label className="form-label">Content</label>
                <ReactQuill
                  ref={quillRef}
                  theme="snow"
                  value={formData.content}
                  onChange={handleContentChange}
                  placeholder="Write your article content here..."
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, false] }],
                      ["bold", "italic", "underline"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["link"],
                      ["clean"],
                    ],
                  }}
                  formats={["header", "bold", "italic", "underline", "list", "bullet", "link"]}
                  style={{ height: "300px", marginBottom: "50px" }}
                />
              </div>

              <div className="col-12">
                <button type="submit" className="btn btn-primary">
                  Submit Article
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateArticle;
