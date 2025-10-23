import React, { useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_URL = import.meta.env.VITE_API_URL;

export default function JournalImageUploader({ journalId, currentImage, onUpdate }) {
  const fileInputRef = useRef();
  const [preview, setPreview] = useState(currentImage);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("coverImage", file);

    setUploading(true);

    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.put(`${API_URL}/journals/update/image/${journalId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        const updatedImage = res.data.data.coverImage;
        setPreview(updatedImage);
        toast.success("Cover image updated successfully!");

        if (onUpdate) onUpdate(updatedImage); // Notify parent
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update cover image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-2 position-relative text-center">
      <img
        src={`${BASE_URL}/${preview}`}
        alt="Cover Preview"
        style={{
          maxWidth: "250px",
          maxHeight: "250px",
          borderRadius: "4px",
          objectFit: "cover",
        }}
      />
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="d-none"
        onChange={handleFileChange}
      />

      <span
        className={`badge btn btn-sm btn-primary rounded-circle py-2 position-absolute end-0 top-0 me-5 shadow-lg border border-dark ${
          uploading ? "disabled" : "cursor-pointer"
        }`}
        style={{ cursor: uploading ? "not-allowed" : "pointer" }}
        onClick={!uploading ? handleFileSelect : undefined}
      >
        {uploading ? (
          <i className="ti ti-loader ti-spin"></i>
        ) : (
          <i className="ti ti-pencil"></i>
        )}
      </span>
    </div>
  );
}
