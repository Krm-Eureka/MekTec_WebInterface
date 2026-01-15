import React from 'react';
import { MAP_CONFIG } from '../../config/mapConfig';

/**
 * Panel showing active tasks for the current floor
 */
const ActiveTasksPanel = ({ tasks, locations, floorId }) => {
    const getStatusColor = (status) => {
        const s = status?.toUpperCase() || '';
        switch (s) {
            case 'PENDING': return MAP_CONFIG.COLORS.TASK_PENDING;
            case 'STARTED':
            case 'RUNNING': return MAP_CONFIG.COLORS.TASK_RUNNING;
            case 'COMPLETED':
            case 'DONE': return MAP_CONFIG.COLORS.TASK_DONE;
            case 'CANCELED':
            case 'CANCELLED': return MAP_CONFIG.COLORS.TASK_CANCELLED;
            case 'SUSPENDED': return MAP_CONFIG.COLORS.TASK_SUSPENDED;
            case 'ABNORMAL':
            case 'ERROR': return MAP_CONFIG.COLORS.TASK_ABNORMAL;
            default: return "#adbac7";
        }
    };

    const filteredTasks = tasks.filter(t => t.floorId === floorId);

    return (
        <div className="side-panel-right">
            <div className="side-panel-title">Active Tasks</div>
            <div className="task-list-mini">
                {filteredTasks.map(task => {
                    const fromNode = locations.find(l => l.id === task.fromId);
                    const toNode = locations.find(l => l.id === task.toId);
                    return (
                        <div
                            key={task.id}
                            className="task-item-mini"
                            style={{ borderLeftColor: getStatusColor(task.status) }}
                        >
                            <span className="task-id-badge">
                                {fromNode?.stationName || fromNode?.name || task.fromId}
                            </span>
                            <div className="task-connector">
                                <div
                                    className="task-connector-line"
                                    style={{ background: getStatusColor(task.status) }}
                                />
                                <span>▶</span>
                            </div>
                            <span className="task-id-badge">
                                {toNode?.stationName || toNode?.name || task.toId}
                            </span>
                        </div>
                    );
                })}
                {filteredTasks.length === 0 && (
                    <div style={{
                        fontSize: '0.75rem',
                        color: '#636e7b',
                        textAlign: 'center',
                        marginTop: '10px'
                    }}>
                        No active tasks on this floor
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActiveTasksPanel;
