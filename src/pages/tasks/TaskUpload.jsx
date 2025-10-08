import { useEffect, useRef, useState } from "react";
import BreadCrumb from "../../components/BreadCrumb";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";

const ExcelFileList = () => {
  const [files, setFiles] = useState([]);
  const [previewFile, setPreviewFile] = useState(null); // confirmation
  const fileInputRef = useRef(null);

  // Load saved files on page load
  useEffect(() => {
    const savedFiles =
      JSON.parse(localStorage.getItem("uploadedExcelFiles")) || [];
    setFiles(savedFiles);
  }, []);

  // Handle file select
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);

      const fileDetails = {
        id: Date.now(),
        fileName: file.name,
        type: "Excel File", 
        size: (file.size / 1024).toFixed(2) + " KB",
        taskCount: rows.length,
        uploadedBy: "Admin",
        uploadedDate: new Date(),
        url: URL.createObjectURL(file),
      };

      setPreviewFile(fileDetails);
    };
    reader.readAsArrayBuffer(file);
  };

 const handleConfirmUpload = () => {
  if (!previewFile) return;
  const updatedFiles = [...files, previewFile];
  setFiles(updatedFiles);
  localStorage.setItem("uploadedExcelFiles", JSON.stringify(updatedFiles));
  toast.success(`${previewFile.fileName}"File uploaded successfully!`);
  setPreviewFile(null);
};


  // Cancel Upload
  const handleCancelUpload = () => {
    setPreviewFile(null);
    toast("Upload cancelled");
  };

  // Download
  const handleDownload = (file) => {
    const link = document.createElement("a");
    link.href = file.url;
    link.download = file.fileName;
    link.click();
    toast.success(`Downloading ${file.fileName}`);
  };

  // Delete
  const handleDelete = (id) => {
    const updatedFiles = files.filter((f) => f.id !== id);
    setFiles(updatedFiles);
    localStorage.setItem("uploadedExcelFiles", JSON.stringify(updatedFiles));
    toast.error("File deleted");
  };

  return (
    <>
      {/* Header with Breadcrumb & Upload */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <BreadCrumb subLabel="Admin" pageTitle="Task Uploads" />

        <button
          className="btn d-flex align-items-center btn-secondary"
          type="button"
          onClick={() => fileInputRef.current.click()}
        >
          <i className="ti ti-file me-2"></i> Excel Upload
        </button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept=".xlsx,.xls"
          onChange={handleFileChange}
        />
      </div>

      {/* Table */}
      <div className="row">
        <div className="col-12">
          <div className="card table-card">
            <div className="card-body pt-3">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>File Name</th>
                      <th>Type</th>
                      <th>Size</th>
                      <th>Task Count</th>
                      <th>Uploaded By</th>
                      <th>Uploaded Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {files.map((file, index) => (
                      <tr key={file.id}>
                        <td>{index + 1}</td>
                        <td>{file.fileName}</td>
                        <td>{file.type}</td> {/* ✅ always Excel File */}
                        <td>{file.size}</td>
                        <td>{file.taskCount}</td>
                        <td>{file.uploadedBy}</td>
                        <td>
                          <div>
                            {new Date(file.uploadedDate).toLocaleDateString()}
                          </div>
                          <div style={{ fontSize: "12px", color: "#6c757d" }}>
                            {new Date(file.uploadedDate).toLocaleTimeString(
                              [],
                              { hour: "2-digit", minute: "2-digit" }
                            )}
                          </div>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-light-primary me-2"
                            onClick={() => handleDownload(file)}
                          >
                            <i className="ti ti-download"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-light-danger"
                            onClick={() => handleDelete(file.id)}
                          >
                            <i className="ti ti-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {files.length === 0 && (
                      <tr>
                        <td colSpan="8" className="text-center text-muted">
                          No files uploaded
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              <div className="datatable-bottom">
                <div className="datatable-info">Showing 1 to 5 of 6 entries</div>
                <nav className="datatable-pagination">
                  <ul className="datatable-pagination-list">
                    <li className="datatable-pagination-list-item datatable-hidden datatable-disabled">
                      <button
                        data-page={1}
                        className="datatable-pagination-list-item-link"
                        aria-label="Page 1"
                      >
                        ‹
                      </button>
                    </li>
                    <li className="datatable-pagination-list-item datatable-active">
                      <button
                        data-page={1}
                        className="datatable-pagination-list-item-link"
                        aria-label="Page 1"
                      >
                        1
                      </button>
                    </li>
                    <li className="datatable-pagination-list-item">
                      <button
                        data-page={2}
                        className="datatable-pagination-list-item-link"
                        aria-label="Page 2"
                      >
                        2
                      </button>
                    </li>
                    <li className="datatable-pagination-list-item">
                      <button
                        data-page={2}
                        className="datatable-pagination-list-item-link"
                        aria-label="Page 2"
                      >
                        ›
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

    {previewFile && (
  <div
    className="modal show d-block"
    tabIndex="-1"
    role="dialog"
    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
  >
    <div className="modal-dialog modal-dialog-centered" role="document">
      <div className="modal-content border-0 shadow">
        <div className="modal-body text-center py-4">
          {/* File Icon */}
          <div className="mb-3">
            <i className="ti ti-file-check text-success fs-1"></i>
          </div>
          {/* Message with file name */}
          <h5 className="fw-bold mb-3">
             Are you sure you want to upload this?
          </h5>
          <p className="fw-semibold text-truncate mb-3" title={previewFile.fileName}>
            <i className="ti ti-file me-1"></i> {previewFile.fileName}
          </p>
          {/* Action Buttons */}
          <div className="d-flex justify-content-center gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={handleCancelUpload}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-success"
              onClick={handleConfirmUpload}
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}



    </>
  );
};

export default ExcelFileList;
