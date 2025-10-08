
import React, { useState, useRef, useMemo } from "react";
import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
import BreadCrumb from "../components/BreadCrumb";
import { Link } from "react-router-dom";

export default function RichTextEditor() {
  const [formData, setFormData] = useState({
    title: "Go Green, Green Innovation for Global",
    articleType: "Research",
    journal: "Life and Environmental Science", // default selected
    author: "Pravinaben Mangubhai Gamit",
    publishedDate: "2025-09-25",
    content: `<h3>Abstract</h3>
  <p>“LIVE GREEN, THINK GREEN, LOVE GREEN” – Let’s go green together. “A meter of green is greener than a centimetre.” I have always been in love with this green Earth – Charles Lamb. Nowadays, the “Go Green” initiative has become an important movement aimed at protecting natural resources for future generations and safeguarding human health through environmental management and sustainable lifestyles. Living in an eco-friendlier way has become essential.</p>
  <p>I have always loved greenery; in fact, green has been my favourite colour since childhood. Surrounding myself with greenery has influenced my thoughts, lifestyle, and overall perspective on life. That is why I have chosen the topic “Go Green for the Globe.” Whenever I see greenery, it uplifts my mood and fills me with inner happiness. Many people say, “Our inner happiness radiates through our external appearance.” Going green is imperative to understand that we have only one Earth. Nurturing a meaningful relationship with nature ensures long-term sustainability and enhances the value of human life.</p>`,
  coverImage: "/assets/images/pages/card-1.png",
    coverImage: "/assets/images/pages/card-1.png",
  });

  // Example list of available journals
  const journalsList = [
    "Life and Environmental Science",
    "Earth and Climate Studies",
    "Sustainable Development Journal",
    "Energy and Environmental Research",
  ];

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

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = () => {
      const file = input.files[0];
      if (file) {
        const url = URL.createObjectURL(file);
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();
        quill.insertEmbed(range.index, "image", url);
      }
    };
  };

  const modules = useMemo(
    () => ({
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
    }),
    []
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
    "image",
    "video",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("articleType", formData.articleType);
    payload.append("journal", formData.journal);
    payload.append("author", formData.author);
    payload.append("publishedDate", formData.publishedDate);
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
                  <BreadCrumb subLabel="Update Article"/>
                   <div className="d-flex align-items-start gap-2 flex-wrap">
                          <Link to="/articles" className="btn btn-primary d-flex align-items-center">
                    <i className="ti ti-arrow-left f-24"></i> Back to Articles
                    </Link>
                         </div>
    </div>
    <div className="container mt-4">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h5>Create Article</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Title */}
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
                placeholder="Enter Article Type"
              />
            </div>

            {/* Journal Dropdown */}
            <div className="mb-3">
              <label className="form-label">Journal</label>
              <select
                className="form-select"
                name="journal"
                value={formData.journal}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Journal --</option>
                {journalsList.map((j, idx) => (
                  <option key={idx} value={j}>
                    {j}
                  </option>
                ))}
              </select>
            </div>

            {/* Cover Image */}
            <div className="mb-3">
              <label className="form-label">Cover Image</label>
              <input
                type="file"
                className="form-control"
                name="coverImage"
                onChange={handleChange}
              />
              <div className="mt-2">
                <p>Article Image:</p>
                <img
                  src={
                    formData.coverImage instanceof File
                      ? URL.createObjectURL(formData.coverImage)
                      : formData.coverImage
                  }
                  alt="Cover Preview"
                  style={{
                    maxWidth: "200px",
                    maxHeight: "200px",
                    borderRadius: "4px",
                  }}
                />
              </div>
            </div>

            {/* React Quill Editor */}
            <div className="mb-3">
              <label className="form-label">Content</label>
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={formData.content}
                onChange={handleContentChange}
                modules={modules}
                formats={formats}
                placeholder="Write your article here..."
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
