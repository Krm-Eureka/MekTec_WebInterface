import React from 'react';

const Sidebar = ({ currentPage, setCurrentPage, isMockMode, setIsMockMode }) => {
    const menuItems = [
        { id: 'map', label: 'Map Control', icon: '📍' },
        { id: 'taskmonitoring', label: 'Task Monitoring', icon: '📊' }
    ];

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h1>MekTec Control</h1>
            </div>
            <nav className="nav-menu">
                {menuItems.map((item) => (
                    <div
                        key={item.id}
                        className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
                        onClick={() => setCurrentPage(item.id)}
                    >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                    </div>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="mode-toggle-sidebar">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span className="mode-label">Mock Mode</span>
                        <span style={{ fontSize: '0.65rem', color: '#636e7b' }}>Simulate data</span>
                    </div>
                    <label className="switch">
                        <input
                            type="checkbox"
                            checked={isMockMode}
                            onChange={(e) => setIsMockMode(e.target.checked)}
                        />
                        <span className="slider round"></span>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
