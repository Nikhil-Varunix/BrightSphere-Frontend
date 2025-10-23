// src/pages/admin/RichTextEditor.jsx
import React, { useState, useRef } from "react";
import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
import Select from "react-select";
import BreadCrumb from "../../components/BreadCrumb";
import { Link } from "react-router-dom";

export default function RichTextEditor() {
  const [formData, setFormData] = useState({
    title: "",
    subTitle: "",
    editorials: [],
    articles: [],
    content: "",
    coverImage: null,
  });

  const options = [
    { value: "Sandro Gelsomino", label: "Sandro Gelsomino" },
    { value: "Vikas Kumar", label: "Vikas Kumar" },
  ];

  const articleoptions = [
    { value: "Go Green, Green Innovation for Global", label: "Go Green, Green Innovation for Global" },
    { value: "Go Green, Green Innovation for Global", label: "Go Green, Green Innovation for Global" },
    { value: "Go Green, Green Innovation for Global", label: "Go Green, Green Innovation for Global" },
  ];

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedArticleOptions, setSelectedArticleOptions] = useState([]);
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

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("subTitle", formData.subTitle);
    payload.append("content", formData.content);
    payload.append("editorials", JSON.stringify(selectedOptions.map(opt => opt.value)));
    payload.append("articles", JSON.stringify(selectedArticleOptions.map(opt => opt.value)));
    if (formData.coverImage) {
      payload.append("coverImage", formData.coverImage);
    }

    console.log("Submitting Article:", Object.fromEntries(payload));
    alert("Article submitted successfully!");
  };

  // Image upload handler for ReactQuill
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

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <BreadCrumb subLabel="Create Journal" />
        <div className="d-flex align-items-start gap-2 flex-wrap">
          <Link to="/journals" className="btn btn-primary d-flex align-items-center">
            <i className="ti ti-arrow-left f-24"></i> Back to Journals
          </Link>
        </div>
      </div>
      <div className="container mt-4">
        <div className="card shadow-sm">
          <div className="card-header bg-light-primary text-white">
            <h5 className="mb-0">Create Journal</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                {/* Title */}
                <div className="col-12">
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

                {/* Sub Title */}
                <div className="col-12">
                  <label className="form-label">Sub Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="subTitle"
                    value={formData.subTitle}
                    onChange={handleChange}
                    placeholder="Enter journal sub title"
                  />
                </div>

                {/* Editorials Multi Select */}
                <div className="col-12">
                  <label className="form-label">Add Editorials</label>
                  <Select
                    isMulti
                    name="editorials"
                    options={options}
                    value={selectedOptions}
                    onChange={setSelectedOptions}
                    classNamePrefix="select"
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderRadius: "0.375rem",
                        minHeight: "52px",
                        boxShadow: "none",
                        borderColor: "#303f50",
                        backgroundColor: "transparent",
                      }),
                      menu: (base) => ({
                        ...base,
                        borderRadius: "0.375rem",
                        backgroundColor: "#f8f9fa",
                        padding: "4px",
                        zIndex: 9999,
                      }),
                      option: (base, state) => ({
                        ...base,
                        borderRadius: "4px",
                        padding: "10px 12px",
                        fontWeight: 500,
                        backgroundColor: state.isSelected
                          ? "#04a9f5"
                          : state.isFocused
                            ? "#e3f2fd"
                            : "transparent",
                        color: state.isSelected ? "white" : "#212529",
                        cursor: "pointer",
                      }),
                      multiValue: (base) => ({
                        ...base,
                        backgroundColor: "#04a9f5",
                        borderRadius: "10px",
                        padding: "4px 6px",
                      }),
                      multiValueLabel: (base) => ({
                        ...base,
                        color: "white",
                        fontWeight: 600,
                        fontSize: "14px",
                      }),
                      multiValueRemove: (base) => ({
                        ...base,
                        color: "white",
                        ":hover": {
                          color: "white",
                        },
                      }),
                    }}
                  />
                </div>



                {/* Journal Image */}
                <div className="col-12">
                  <label className="form-label">Journal Image</label>
                  <input
                    type="file"
                    className="form-control"
                    name="coverImage"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* React Quill Editor */}
              <div className="mb-3 mt-4">
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

              {/* Submit */}
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

// Quill Toolbar Config
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
    handlers: {
      image: imageHandler,
    },
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
