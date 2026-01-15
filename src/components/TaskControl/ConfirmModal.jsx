import React from 'react';

const ConfirmModal = ({ isOpen, taskData, onConfirm, onCancel }) => {
    if (!isOpen) return null;
    console.log(taskData.from);

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h2 className="modal-title">Confirm New Task</h2>
                </div>
                <div className="modal-body">
                    <div className="info-row">
                        <span className="info-label">From Location</span>
                        <span className="info-value">{taskData?.from?.name || 'Unknown'}</span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">To Location</span>
                        <span className="info-value">{taskData?.to?.name || 'Unknown'}</span>
                    </div>
                    <p style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
                        Are you sure you want to create this movement task?
                    </p>
                </div>
                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onCancel}>
                        Cancel
                    </button>
                    <button className="btn btn-primary" onClick={onConfirm}>
                        Confirm Task
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
