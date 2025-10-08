import React, { useState } from 'react';
import { Table, Badge, Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const assetsData = [
    {
        image: 'https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg',
        name: 'Dell Latitude 5420',
        type: 'Laptop',
        serial: 'DLT5420SN7890',
        date: '01-Jul-2024',
        status: 'In Use'
    },
    {
        image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
        name: 'Samsung Galaxy M52',
        type: 'Mobile',
        serial: 'SMGM52SN1042',
        date: '15-Jul-2024',
        status: 'In Use'
    },
    {
        image: 'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg',
        name: 'Cap',
        type: 'Cap',
        serial: 'HARDHAT9981',
        date: '01-Jun-2024',
        status: 'Returned'
    }
];

// Map status to light variant and dark text
const getBadgeProps = (status) => {
    switch(status) {
        case 'In Use': return { bg: 'light-success', text: 'dark' };
        case 'Returned': return { bg: 'light-secondary', text: 'dark' };
        case 'Expired': return { bg: 'light-danger', text: 'dark' };
        default: return { bg: 'light-primary', text: 'dark' };
    }
};

const AssetTable = () => {
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showView, setShowView] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState(null);

    const handleEdit = (asset) => {
        setSelectedAsset(asset);
        setShowEdit(true);
    };

    const handleDelete = (asset) => {
        setSelectedAsset(asset);
        setShowDelete(true);
    };

    const handleView = (asset) => {
        setSelectedAsset(asset);
        setShowView(true);
    };

    return (
        <>
            <Table hover responsive className="align-middle">
                <thead className="table-light">
                    <tr>
                        <th>Image</th>
                        <th>Asset Name</th>
                        <th>Type</th>
                        <th>Serial Number</th>
                        <th>Assigned Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {assetsData.map((asset, index) => (
                        <tr key={index}>
                            <td>
                                <img src={asset.image} alt={asset.name} width="60" className="img-fluid" />
                            </td>
                            <td>{asset.name}</td>
                            <td>{asset.type}</td>
                            <td>{asset.serial}</td>
                            <td>{asset.date}</td>
                            <td>
                                <Badge {...getBadgeProps(asset.status)}>
                                    {asset.status}
                                </Badge>
                            </td>
                            <td>
                                <div className="overlay-edit">
                                    <ul className="list-inline mb-0">
                                        <li className="list-inline-item m-0">
                                            <span className="avtar avtar-s btn btn-light-warning" onClick={() => handleView(asset)}>
                                                <i className="ti ti-eye f-18" />
                                            </span>
                                        </li>
                                        <li className="list-inline-item ms-2 m-0">
                                            <span className="avtar avtar-s btn btn-light-primary" onClick={() => handleEdit(asset)}>
                                                <i className="ti ti-pencil f-18" />
                                            </span>
                                        </li>
                                        <li className="list-inline-item ms-2 m-0 cursor-pointer">
                                            <span className="avtar avtar-s btn btn-light-danger" onClick={() => handleDelete(asset)}>
                                                <i className="ti ti-trash f-18" />
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* View Modal */}
            <Modal show={showView} onHide={() => setShowView(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Asset Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedAsset && (
                        <div className="text-center">
                            <img src={selectedAsset.image} alt={selectedAsset.name} className="img-fluid mb-3" style={{ maxWidth: '200px' }} />
                            <h5>{selectedAsset.name}</h5>
                            <p><strong>Type:</strong> {selectedAsset.type}</p>
                            <p><strong>Serial Number:</strong> {selectedAsset.serial}</p>
                            <p><strong>Assigned Date:</strong> {selectedAsset.date}</p>
                            <p>
                                <strong>Status:</strong> 
                                <Badge {...getBadgeProps(selectedAsset.status)} className="ms-2">
                                    {selectedAsset.status}
                                </Badge>
                            </p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowView(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Edit Modal */}
            <Modal show={showEdit} onHide={() => setShowEdit(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Asset</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedAsset && (
                        <form>
                            <div className="mb-3">
                                <label className="form-label">Asset Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={selectedAsset.name}
                                    onChange={(e) => setSelectedAsset({ ...selectedAsset, name: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Asset Type</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={selectedAsset.type}
                                    onChange={(e) => setSelectedAsset({ ...selectedAsset, type: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Serial Number</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={selectedAsset.serial}
                                    onChange={(e) => setSelectedAsset({ ...selectedAsset, serial: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Assigned Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={selectedAsset.date}
                                    onChange={(e) => setSelectedAsset({ ...selectedAsset, date: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Status</label>
                                <select
                                    className="form-select"
                                    value={selectedAsset.status}
                                    onChange={(e) => setSelectedAsset({ ...selectedAsset, status: e.target.value })}
                                >
                                    <option value="In Use">In Use</option>
                                    <option value="Returned">Returned</option>
                                    <option value="Expired">Expired</option>
                                </select>
                            </div>
                        </form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEdit(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={() => setShowEdit(false)}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Delete Modal */}
            <Modal show={showDelete} onHide={() => setShowDelete(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Asset</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete <strong>{selectedAsset?.name}</strong>?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDelete(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger">
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default AssetTable;
