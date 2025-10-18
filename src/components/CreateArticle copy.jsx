// src/pages/admin/RichTextEditor.jsx
import React, { useState, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Link } from "react-router-dom";
import BreadCrumb from "../components/BreadCrumb";

export default function RichTextEditor() {
  const journalsList = [
    "Life and Environmental Science",
    "Journal of Climate Studies",
    "Global Sustainability Review",
    "Earth & Ecology Research",
  ];

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    articleType: "",
    journal: "", // will come from dropdown
    content: "",
    coverImage: null, // for main article image
  });

  const quillRef = useRef();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "coverImage") {
      setFormData({ ...formData, coverImage: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleContentChange = (value) => {
    setFormData({ ...formData, content: value });
  };

  // Custom Image Upload for Quill
  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        const url = URL.createObjectURL(file);
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();
        quill.insertEmbed(range.index, "image", url);
      }
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("author", formData.author);
    payload.append("articleType", formData.articleType);
    payload.append("journal", formData.journal);
    payload.append("content", formData.content);
    if (formData.coverImage) {
      payload.append("coverImage", formData.coverImage);
    }

    console.log("Submitting Article:", Object.fromEntries(payload));
    alert("Article submitted successfully!");
  };

  return (
    <>
     <div className="d-flex justify-content-between align-items-center mb-4">
                  <BreadCrumb subLabel="Create Article"/>
                   <div className="d-flex align-items-start gap-2 flex-wrap">
                          <Link to="/articles" className="btn btn-primary d-flex align-items-center">
                    <i className="ti ti-arrow-left f-24"></i> Back to Articles
                    </Link>
                         </div>
    </div>
    <div className="container mt-4">
      <div className="card">
        <div className="card-header bg-primary">
          <h5>Create Article</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Article Title */}
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter article title"
                required
              />
            </div>

            {/* Author */}
            <div className="mb-3">
              <label className="form-label">Author</label>
              <input
                type="text"
                className="form-control"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Enter author name"
                required
              />
            </div>

            {/* Article Type */}
            <div className="mb-3">
              <label className="form-label">Article Type</label>
              <input
                type="text"
                className="form-control"
                name="articleType"
                value={formData.articleType}
                onChange={handleChange}
                placeholder="Enter article type"
                required
              />
            </div>

            {/* Journal Dropdown */}
            <div className="mb-3">
              <label className="form-label">Journal</label>
              <select
                className="form-control"
                name="journal"
                value={formData.journal}
                onChange={handleChange}
                required
              >
                <option value="">Select Journal</option>
                {journalsList.map((j, idx) => (
                  <option key={idx} value={j}>
                    {j}
                  </option>
                ))}
              </select>
            </div>

            {/* Cover Image */}
            <div className="mb-3">
              <label className="form-label">Article Image</label>
              <input
                type="file"
                className="form-control"
                name="coverImage"
                onChange={handleChange}
              />
            </div>

            {/* React Quill Editor */}
            <div className="mb-3">
              <label className="form-label">Content</label>
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={formData.content}
                onChange={handleContentChange}
                placeholder="Write your article here..."
                modules={modules(imageHandler)}
                formats={formats}
                style={{ height: "300px", marginBottom: "50px" }}
              />
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary">
              Submit Article
            </button>
          </form>
        </div>
      </div>
    </div>
    </>
  );
}

// Quill Toolbar Modules (with custom image handler)
const modules = (imageHandler) => ({
  toolbar: {
    container: [
      [{ header: [1, 2, 3, false] }],
      [{ font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ script: "sub" }, { script: "super" }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["blockquote", "code-block"],
      ["link", "image", "video"],
      ["clean"],
    ],
    handlers: { image: imageHandler },
  },
});

// Quill Allowed Formats
const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "script",
  "list",
  "bullet",
  "indent",
  "align",
  "blockquote",
  "code-block",
  "link",
  "image",
  "video",
];
