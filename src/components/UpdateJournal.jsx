// src/pages/admin/UpdateJournal.jsx
import React, { useState, useRef, useMemo } from "react";
import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
import Select from "react-select";
import { Link } from "react-router-dom";
import BreadCrumb from "../components/BreadCrumb";

export default function UpdateJournal({ defaultData }) {

  const options = [
    { value: "Sandro Gelsomino", label: "Sandro Gelsomino" },
    { value: "Vikas Kumar", label: "Vikas Kumar" },
  ];

  const articleoptions = [
    { value: "Go Green, Green Innovation for Global", label: "Go Green, Green Innovation for Global" },
    { value: "Global Sustainability Practices", label: "Global Sustainability Practices" },
    { value: "Climate Action Initiatives", label: "Climate Action Initiatives" },
  ];

  const [selectedOptions, setSelectedOptions] = useState(
    defaultData?.editorials?.map((e) => ({ value: e.name, label: e.name })) || []
  );
  const [selectedArticleOptions, setSelectedArticleOptions] = useState(
    defaultData?.articles?.map((a) => ({ value: a.aname, label: a.aname })) || []
  );

  const quillRef = useRef();

  const [formData, setFormData] = useState({
    title: defaultData?.title || "Journal of Earth And Environmental Science",
    subTitle: defaultData?.subTitle || "Exploring Nature, Sustaining the Future",
    articleType: defaultData?.articleType || "Research",
    journal: defaultData?.journal || "Life and Environmental Science",
    author: defaultData?.author || "Pravinaben Mangubhai Gamit",
    editorials: defaultData?.editorials || [],
    articles: defaultData?.articles || [],
    content: defaultData?.content || `<h3>Exploring Nature, Sustaining the Future</h3>
    <p>“The Journal of Earth and Environmental Science is an international, peer-reviewed platform dedicated to advancing knowledge and research in the fields of Earth sciences and environmental studies. The journal aims to publish original research, reviews, case studies, and technical communications that address the scientific understanding of the Earth’s structure, processes, natural resources, and the complex interactions between humans and the environment.</p>`,
    coverImage: defaultData?.coverImage || "/assets/images/pages/card-1.png",
  });

  // Input change handler
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "coverImage") {
      setFormData({ ...formData, coverImage: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // ReactQuill content change
  const handleContentChange = (value) => {
    setFormData({ ...formData, content: value });
  };

  // Update formData when select changes
  const handleEditorialSelect = (selected) => {
    setSelectedOptions(selected);
    setFormData({
      ...formData,
      editorials: selected.map((s) => ({ name: s.value })),
    });
  };

  const handleArticleSelect = (selected) => {
    setSelectedArticleOptions(selected);
    setFormData({
      ...formData,
      articles: selected.map((s) => ({ aname: s.value })),
    });
  };

  // Image handler for Quill
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

  // Quill toolbar modules
  const modules = useMemo(() => ({
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
  }), []);

  const formats = [
    "header","font","size","bold","italic","underline","strike",
    "color","background","script","list","bullet","indent","align",
    "blockquote","code-block","link","image","video"
  ];

  // Form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("subTitle", formData.subTitle);
    payload.append("articleType", formData.articleType);
    payload.append("journal", formData.journal);
    payload.append("author", formData.author);
    payload.append("publishedDate", formData.publishedDate || "");
    payload.append("content", formData.content);
    payload.append("editorials", JSON.stringify(formData.editorials));
    payload.append("articles", JSON.stringify(formData.articles));
    if (formData.coverImage) payload.append("coverImage", formData.coverImage);

    console.log("Updating Article:", Object.fromEntries(payload));
    alert("Article updated successfully!");
  };

  return (
    <>
     <div className="d-flex justify-content-between align-items-center mb-4">
              <BreadCrumb subLabel="Update Journal"/>
               <div className="d-flex align-items-start gap-2 flex-wrap">
                      <Link to="/journals" className="btn btn-primary d-flex align-items-center">
                <i className="ti ti-arrow-left f-24"></i> Back to Journals
                </Link>
                     </div>
              </div>
    <div className="container mt-4">
      <div className="card">
        <div className="card-header bg-primary"><h5>Update Journal</h5></div>
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

            {/* Sub Title */}
            <div className="mb-3">
              <label className="form-label">Sub Title</label>
              <input
                type="text"
                className="form-control"
                name="subTitle"
                value={formData.subTitle}
                onChange={handleChange}
                placeholder="Enter Journal sub title"
              />
            </div>

            {/* Editorials Multi Select */}
            <div className="col-12 mb-3">
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

            {/* Articles Multi Select */}
            <div className="col-12 mb-3">
              <label className="form-label">Add Articles</label>
              <Select
          isMulti
          name="articles"
          options={articleoptions}
          value={selectedArticleOptions}
          onChange={setSelectedArticleOptions}
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

            {/* Cover Image */}
            <div className="mb-3">
              <label className="form-label">Journal Image</label>
              <input
                type="file"
                className="form-control"
                name="coverImage"
                onChange={handleChange}
              />
              <div className="mt-2">
                <p>Preview:</p>
                <img
                  src={
                    formData.coverImage instanceof File
                      ? URL.createObjectURL(formData.coverImage)
                      : formData.coverImage
                  }
                  alt="Cover Preview"
                  style={{ maxWidth: "200px", maxHeight: "200px", borderRadius: "4px" }}
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
              Update Article
            </button>
          </form>
        </div>
      </div>
    </div>
    </>
  );
}
