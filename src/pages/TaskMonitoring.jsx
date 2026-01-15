import React from 'react';

const TaskMonitoring = () => {
    // In a real app, this would come from a global state or API
    const mockTasks = [
        { id: 'T1', from: 'Loading Bay A', to: 'Shelf A1', status: 'RUNNING', floor: 1, time: '2024-05-20 10:30' },
        { id: 'T2', from: 'Shelf A2', to: 'Output Buffer', status: 'PENDING', floor: 1, time: '2024-05-20 10:45' },
        { id: 'T3', from: 'Storage B1', to: 'Packing Area', status: 'DONE', floor: 2, time: '2024-05-20 09:15' },
        { id: 'T4', from: 'QC Zone', to: 'Loading Bay A', status: 'ERROR', floor: 3, time: '2024-05-20 08:30' },
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case 'PENDING': return { color: '#f1c40f' };
            case 'RUNNING': return { color: '#3498db' };
            case 'DONE': return { color: '#2ecc71' };
            case 'ERROR': return { color: '#e74c3c' };
            default: return {};
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1 style={{ color: 'white', marginBottom: '2rem' }}>Task Monitoring</h1>

            <div style={{
                background: 'var(--bg-card)',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                overflow: 'hidden'
            }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.05)', color: 'white' }}>
                            <th style={{ padding: '1rem' }}>Task ID</th>
                            <th style={{ padding: '1rem' }}>From</th>
                            <th style={{ padding: '1rem' }}>To</th>
                            <th style={{ padding: '1rem' }}>Floor</th>
                            <th style={{ padding: '1rem' }}>Status</th>
                            <th style={{ padding: '1rem' }}>Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockTasks.map(task => (
                            <tr key={task.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '1rem' }}>{task.id}</td>
                                <td style={{ padding: '1rem' }}>{task.from}</td>
                                <td style={{ padding: '1rem' }}>{task.to}</td>
                                <td style={{ padding: '1rem' }}>Floor {task.floor}</td>
                                <td style={{ padding: '1rem', fontWeight: 'bold', ...getStatusStyle(task.status) }}>
                                    {task.status}
                                </td>
                                <td style={{ padding: '1rem', color: '#666' }}>{task.time}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TaskMonitoring;
