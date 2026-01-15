import React from 'react';
import { MAP_CONFIG } from '../../config/mapConfig';

/**
 * Map legend showing status colors
 */
const MapLegend = () => {
    const getStatusColor = (status) => {
        const s = status?.toUpperCase() || '';
        switch (s) {
            case 'PENDING': return MAP_CONFIG.COLORS.TASK_PENDING;
            case 'RUNNING': return MAP_CONFIG.COLORS.TASK_RUNNING;
            case 'DONE': return MAP_CONFIG.COLORS.TASK_DONE;
            case 'CANCELED': return MAP_CONFIG.COLORS.TASK_CANCELLED;
            case 'SUSPENDED': return MAP_CONFIG.COLORS.TASK_SUSPENDED;
            case 'ABNORMAL': return MAP_CONFIG.COLORS.TASK_ABNORMAL;
            default: return "#adbac7";
        }
    };

    const statuses = ['PENDING', 'RUNNING', 'DONE', 'CANCELED', 'SUSPENDED', 'ABNORMAL'];

    return (
        <div className="map-legend">
            {statuses.map(status => (
                <div key={status} className="legend-item">
                    <div
                        className="legend-color"
                        style={{ background: getStatusColor(status) }}
                    />
                    <span>{status.charAt(0) + status.slice(1).toLowerCase()}</span>
                </div>
            ))}
        </div>
    );
};

export default MapLegend;
