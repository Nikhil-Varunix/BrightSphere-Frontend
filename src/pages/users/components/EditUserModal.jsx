// EditUserModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-hot-toast';

const EditUserModal = ({ show, handleClose, userData, onSave }) => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    gender: 'Male', // Default gender
    status: 'Active',
  });

  useEffect(() => {
    if (userData) {
      setUser({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.mobile || '',
        gender: userData.gender || 'Male', // fallback to Male
        status: userData.status || 'Active',
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!user.name || !user.email) {
      toast.error('Please fill in all required fields');
      return;
    }
    onSave(user);
    toast.success('User updated successfully');
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <div className="form-floating mb-3">
            <Form.Control
              type="text"
              placeholder="Name"
              name="name"
              value={user.name}
              onChange={handleChange}
            />
            <label>Name</label>
          </div>

          <div className="form-floating mb-3">
            <Form.Control
              type="email"
              placeholder="Email"
              name="email"
              value={user.email}
              onChange={handleChange}
            />
            <label>Email</label>
          </div>

          <div className="form-floating mb-3">
            <Form.Control
              type="text"
              placeholder="Phone"
              name="phone"
              value={user.phone}
              onChange={handleChange}
            />
            <label>Mobile</label>
          </div>

          {/* Gender Dropdown */}
          <div className="form-floating mb-3">
            <Form.Select
              name="gender"
              value={user.gender}
              onChange={handleChange}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Form.Select>
            <label>Gender</label>
          </div>

          <div className="form-floating mb-3">
            <Form.Select
              name="status"
              value={user.status}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Form.Select>
            <label>Status</label>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit}>Save Changes</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditUserModal;
