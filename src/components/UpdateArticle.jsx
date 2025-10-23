import { useState, useEffect, useRef, useMemo } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import BreadCrumb from "../components/BreadCrumb";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function UpdateArticle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const quillRef = useRef();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    articleType: "",
    journal: "",
    content: "",
    volume: "",
    issue: "",
    externalLink: "",
    status: "Published",
    coverImage: "",
  });
  const [journalsList, setJournalsList] = useState([]);
  const [volumes, setVolumes] = useState([]);
  const [issues, setIssues] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // Fetch article and journals
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const fetchArticle = async () => {
      try {
        const res = await axios.get(`${API_URL}/articles/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.data.success) {
          const a = res.data.data;
          setFormData({
            title: a.title || "",
            author: a.author || "",
            articleType: a.articleType || "",
            journal: a.journal?._id || "",
            content: a.content || "",
            volume: a.volume?._id || "",
            issue: a.issue?._id || "",
            externalLink: a.externalLink || "",
            status: a.status || "Published",
            coverImage: a.coverImage || "",
          });
          setPreviewImage(a.coverImage ? `${BASE_URL}/${a.coverImage}` : null);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load article data");
      } finally {
        setLoading(false);
      }
    };
    const fetchJournals = async () => {
      try {
        const res = await axios.get(`${API_URL}/journals`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.data.success) setJournalsList(res.data.data);
      } catch (err) { console.error(err); }
    };
    fetchArticle();
    fetchJournals();
  }, [id]);

  // Fetch volumes when journal changes
  useEffect(() => {
    if (!formData.journal) {
      setVolumes([]);
      setIssues([]);
      setFormData(prev => ({ ...prev, volume: "", issue: "" }));
      return;
    }
    const fetchVolumes = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get(`${API_URL}/volumes?limit=1000`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.data.success) {
          const filteredVolumes = res.data.data.filter(v => v.journal._id === formData.journal);
          setVolumes(filteredVolumes);
          setFormData(prev => ({ ...prev, volume: filteredVolumes.length ? prev.volume : "", issue: "" }));
        }
      } catch (err) { console.error(err); toast.error("Failed to load volumes"); }
    };
    fetchVolumes();
  }, [formData.journal]);

  // Fetch issues when volume changes
useEffect(() => {
  if (!formData.volume) {
    setIssues([]);
    setFormData(prev => ({ ...prev, issue: "" }));
    return;
  }
  const fetchIssues = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get(`${API_URL}/issues/by-volume/${formData.volume}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setIssues(res.data.data);

        // Keep current issue if it exists in the fetched issues, otherwise reset
        setFormData(prev => ({
          ...prev,
          issue: res.data.data.find(i => i._id === prev.issue)?._id || res.data.data[0]?._id || "",
        }));
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load issues");
    }
  };
  fetchIssues();
}, [formData.volume]);


  const modules = useMemo(() => ({
    toolbar: [[{ header: [1, 2, 3, false] }], ["bold", "italic", "underline", "strike"], [{ list: "ordered" }, { list: "bullet" }], ["link"], ["clean"]],
  }), []);
  const formats = ["header", "bold", "italic", "underline", "strike", "list", "bullet", "link"];

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === "coverImage") {
      setImageFile(files[0]);
      setPreviewImage(URL.createObjectURL(files[0]));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        ...(name === "journal" ? { volume: "", issue: "" } : {}),
        ...(name === "volume" ? { issue: "" } : {}),
      }));
    }
  };

  const handleContentChange = value => setFormData(prev => ({ ...prev, content: value }));

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      const data = new FormData();
      for (const k in formData) if (k !== "coverImage") data.append(k, formData[k]);
      if (imageFile) data.append("coverImage", imageFile);
      await axios.put(`${API_URL}/articles/update/${id}`, data, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } });
      toast.success("Article updated successfully!");
      setTimeout(() => navigate("/articles"), 1500);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update article");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <BreadCrumb subLabel="Update Article" />
        <Link to="/articles" className="btn btn-primary"><i className="ti ti-arrow-left"></i> Back to Articles</Link>
      </div>
      <div className="container mt-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <form onSubmit={handleSubmit} encType="multipart/form-data" className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} className="form-control" required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Author</label>
                <input type="text" name="author" value={formData.author} onChange={handleChange} className="form-control" required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Article Type</label>
                <select name="articleType" value={formData.articleType} onChange={handleChange} className="form-select" required>
                  <option value="">-- Select Type --</option>
                  <option value="Research Paper">Research Paper</option>
                  <option value="Review Article">Review Article</option>
                  <option value="Case Study">Case Study</option>
                  <option value="Short Communication">Short Communication</option>
                  <option value="Editorial">Editorial</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Journal</label>
                <select name="journal" value={formData.journal} onChange={handleChange} className="form-select" required>
                  <option value="">-- Select Journal --</option>
                  {journalsList.map(j => <option key={j._id} value={j._id}>{j.title}</option>)}
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Volume</label>
                <select name="volume" value={formData.volume} onChange={handleChange} className="form-select" disabled={!volumes.length} required>
                  <option value="">-- Select Volume --</option>
                  {volumes.map(v => <option key={v._id} value={v._id}>{v.volumeName}</option>)}
                </select>
              
                <label className="form-label fw-bold">Issue</label>
                <select name="issue" value={formData.issue} onChange={handleChange} className="form-select" disabled={!issues.length}>
                  <option value="">-- Select Issue --</option>
                  {issues.map(i => <option key={i._id} value={i._id}>{i.issueName}</option>)}
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Cover Image</label>
                <input type="file" name="coverImage" accept="image/*" onChange={handleChange} className="form-control" />
                {previewImage && <img className="rounded shadow  mt-3 shadow" src={previewImage} alt="Cover Preview" style={{ width: "200px", height: "100px", objectFit: "cover"}} />}
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Content</label>
                <ReactQuill ref={quillRef} theme="snow" value={formData.content} onChange={handleContentChange} modules={modules} formats={formats} style={{ height: "300px", marginBottom: "50px" }} />
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-primary">Update Article</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}


