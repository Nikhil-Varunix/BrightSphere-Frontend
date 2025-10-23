import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Select from "react-select";
import BreadCrumb from "../../components/BreadCrumb";
import axios from "axios";
import toast from "react-hot-toast";
import JournalImageUploader from "./JournalImageUploader";


const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_URL = import.meta.env.VITE_API_URL;

export default function UpdateJournal() {
  const { id } = useParams();
  const quillRef = useRef();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    subTitle: "",
    content: "",
    editorials: [],
  });

  const [editorOptions, setEditorOptions] = useState([]);
  const [selectedEditorials, setSelectedEditorials] = useState([]);

  // Fetch editors & journal data
  useEffect(() => {
    const fetchEditors = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get(`${API_URL}/editors`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) setEditorOptions(res.data.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load editors");
      }
    };

    const fetchJournal = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get(`${API_URL}/journals/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          const journal = res.data.data;

          // Map existing editors for react-select
          const preSelected = (journal.editors || []).map((e) => ({
            value: e._id,
            label: `${e.firstName} ${e.lastName}`,
          }));

          setFormData({
            title: journal.title,
            subTitle: journal.subTitle,
            content: journal.content,
            coverImage: journal.coverImage,
            editorials: journal.editors || [],
          });

          setSelectedEditorials(preSelected);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch journal data");
      } finally {
        setLoading(false);
      }
    };

    fetchEditors();
    fetchJournal();
  }, [id]);

  // ReactQuill image handler
  const imageHandler = React.useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();
    input.onchange = () => {
      const file = input.files[0];
      if (file) {
        const url = URL.createObjectURL(file);
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();
        quill.insertEmbed(range?.index || 0, "image", url);
      }
    };
  }, []);

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image", "video"],
        ["clean"],
      ],
      handlers: { image: imageHandler },
    },
  }), [imageHandler]);

  const formats = [
    "header", "bold", "italic", "underline", "strike",
    "list", "bullet", "link", "image", "video"
  ];

  // Input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Editorials change
  const handleEditorialChange = (selected) => {
    setSelectedEditorials(selected);
    setFormData((prev) => ({
      ...prev,
      editorials: selected.map((s) => ({ _id: s.value, name: s.label })),
    }));
  };

  // Content change
  const handleContentChange = (value) => {
    setFormData((prev) => ({ ...prev, content: value }));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        subTitle: formData.subTitle,
        content: formData.content,
        editorials: selectedEditorials.map((e) => e.value), // array of editor IDs
      };

      const token = localStorage.getItem("authToken");
      await axios.put(`${API_URL}/journals/update/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Journal updated successfully!");
      setTimeout(() => {
        navigate("/journals");
      }, 1500);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update journal");
    }
  };

  if (loading) return <p>Loading...</p>;

  const editorSelectOptions = editorOptions.map((e) => ({
    value: e._id,
    label: `${e.firstName} ${e.lastName}`,
  }));

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <BreadCrumb subLabel="Update Journal" />
        <Link to="/journals" className="btn btn-primary">
          <i className="ti ti-arrow-left"></i> Back to Journals
        </Link>
      </div>

      <div className="container mt-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <form onSubmit={handleSubmit}>

              <div className="row">
                <div className="col-md-8 mb-3">
                  {/* Title */}
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>

                  {/* SubTitle */}
                  <div className="mb-3">
                    <label className="form-label">Sub Title</label>
                    <input
                      type="text"
                      name="subTitle"
                      value={formData.subTitle}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <JournalImageUploader
                    journalId={id}
                    currentImage={formData.coverImage}
                    onUpdate={(newImage) =>
                      setFormData((prev) => ({ ...prev, coverImage: newImage }))
                    }
                  />
                </div>
              </div>


              {/* Editorials */}
              <div className="mb-3">
                <label className="form-label">Editorials</label>
                <Select
                  isMulti
                  options={editorSelectOptions}
                  value={selectedEditorials}
                  onChange={handleEditorialChange}
                  classNamePrefix="select"
                  placeholder="Select editors..."
                />
              </div>

              {/* Content */}
              <div className="mb-3">
                <label className="form-label">Content</label>
                <ReactQuill
                  ref={quillRef}
                  theme="snow"
                  value={formData.content}
                  onChange={handleContentChange}
                  modules={modules}
                  formats={formats}
                  style={{ height: "300px", marginBottom: "50px" }}
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Update Journal
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

