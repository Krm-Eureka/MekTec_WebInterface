import React from 'react';

/**
 * Selection banner showing the selected source location on desktop mode
 */
const SelectionBanner = ({ selectedSource, isMobileMode, onCancel }) => {
    if (!selectedSource || isMobileMode) return null;

    return (
        <div className="selection-active-banner">
            <div className="selection-info">
                <span className="source-label">From:</span>
                <span className="source-value">
                    {selectedSource.stationName} (F{selectedSource.floorId})
                </span>
            </div>
            <button className="cancel-selection-btn" onClick={onCancel}>
                Cancel
            </button>
            <div className="selection-hint">
                Select destination on any floor...
            </div>
        </div>
    );
};

export default SelectionBanner;
