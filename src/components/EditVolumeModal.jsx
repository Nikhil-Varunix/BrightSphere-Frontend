import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const EditVolumeModal = ({ show, onHide, onSave, volume }) => {
  const [volumeName, setVolumeName] = useState("");
  const [status, setStatus] = useState(true); // ✅ new status field

  useEffect(() => {
    if (volume) {
      setVolumeName(volume.volumeName || "");
      setStatus(volume.status ?? true); // set current status
    }
  }, [volume]);

  const handleSave = () => {
    if (!volumeName.trim()) return;
    onSave(volume._id, volumeName.trim(), status);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Volume</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Volume Name</Form.Label>
          <Form.Control
            type="text"
            value={volumeName}
            onChange={(e) => setVolumeName(e.target.value)}
            placeholder="Enter new volume name"
          />
        </Form.Group>

        {/* ✅ Status toggle */}
        <Form.Group>
          <Form.Check
            type="switch"
            id="volume-status-switch"
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

export default EditVolumeModal;
