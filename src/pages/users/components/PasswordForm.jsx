import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const PasswordForm = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      toast.error('Passwords do not match');
      return;
    }

    // Add your logic to update password here (API call etc.)
    toast.success('Password updated successfully!');

    // Optionally reset form
    setNewPassword('');
    setConfirmNewPassword('');
  };

  return (
    <form className='bg-secondary-subtle p-3 rounded' onSubmit={handleSubmit}>
      <h6 className=" bg-secondary-subtle">Change Password</h6>

      <div className="row bg-secondary-subtle  m-0">
        <div className="col-md-5 mb-3">
          <div className="form-floating">
            <input
              type="password"
              className="form-control"
              id="newPassword"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <label htmlFor="newPassword">New Password</label>
          </div>
        </div>

        <div className="col-md-5 mb-3">
          <div className="form-floating">
            <input
              type="password"
              className="form-control"
              id="confirmNewPassword"
              placeholder="Confirm New Password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
            <label htmlFor="confirmNewPassword">Confirm New Password</label>
          </div>
        </div>
        <div className="col-md-2 mb-3">
          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary">
              Update <i className="ti ti-send fs-6"></i>
            </button>
          </div>
        </div>
      </div>





    </form>
  );
};

export default PasswordForm;
