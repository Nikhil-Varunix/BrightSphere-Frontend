import React, { useState } from "react";
import { Modal, ProgressBar, Button, Alert, Form } from "react-bootstrap";

const ExcelUploadModal = ({ show, handleClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', or null
  const [isUploading, setIsUploading] = useState(false);

  const supportedFileTypes = [".xls", ".xlsx", ".csv"];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileExtension = file.name.slice(file.name.lastIndexOf("."));
    if (!supportedFileTypes.includes(fileExtension)) {
      alert("Unsupported file type. Please select .xls, .xlsx, or .csv file.");
      return;
    }

    setSelectedFile(file);
    setUploadStatus(null);
    setUploadProgress(0);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    // Mock upload logic
    setIsUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadStatus("success");
          setSelectedFile(null);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleDownloadTemplate = () => {
    const templateUrl = "/templates/tasks-upload-template.xlsx"; // change if needed
    window.open(templateUrl, "_blank");
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Upload Excel File</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group controlId="excelFile">
            <Form.Label>Select Excel file</Form.Label>
            <Form.Control type="file" accept=".xls,.xlsx,.csv" onChange={handleFileChange} />
          </Form.Group>

          <Button variant="secondary" className="mt-2 me-2" onClick={handleDownloadTemplate}>
            Download Template
          </Button>
          <Button variant="primary" className="mt-2" onClick={handleUpload} disabled={isUploading}>
            {isUploading ? "Uploading..." : "Upload"}
          </Button>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <ProgressBar animated now={uploadProgress} label={`${uploadProgress}%`} className="mt-3" />
          )}

          {uploadStatus === "success" && (
            <Alert variant="success" className="mt-3">
              File uploaded successfully!
            </Alert>
          )}
          {uploadStatus === "error" && (
            <Alert variant="danger" className="mt-3">
              Upload failed. Please try again.
            </Alert>
          )}
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ExcelUploadModal;
