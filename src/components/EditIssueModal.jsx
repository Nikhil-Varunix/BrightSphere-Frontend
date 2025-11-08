import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const EditIssueModal = ({ show, onHide, onSave, issue }) => {
  const [issueName, setIssueName] = useState("");
  const [status, setStatus] = useState(true);

  useEffect(() => {
    if (issue) {
      setIssueName(issue.issueName || "");
      setStatus(issue.status ?? true); // if undefined, default to true
    }
  }, [issue]);

  const handleSave = () => {
    if (!issueName.trim()) return;
    if (!issue || !issue._id) return;
    onSave(issue._id, issueName.trim(), status);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Issue</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Issue Name</Form.Label>
          <Form.Control
            type="text"
            value={issueName}
            onChange={(e) => setIssueName(e.target.value)}
            placeholder="Enter new issue name"
          />
        </Form.Group>

        {/* Status toggle */}
        <Form.Group>
          <Form.Check
            type="switch"
            id="issue-status-switch"
            label={status ? "Active" : "Inactive"}
            checked={status}
            onChange={(e) => setStatus(e.target.checked)}
          />
        </Form.Group>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditIssueModal;
