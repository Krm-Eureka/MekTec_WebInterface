import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MapPage from './pages/MapPage';
import TaskMonitoring from './pages/TaskMonitoring';
import ApiDebugPage from './pages/ApiDebugPage';
import './index.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    const path = window.location.pathname;
    if (path === '/shw/apiMsgList') return 'api-debug';
    return 'map';
  });

  const [isMockMode, setIsMockMode] = useState(true);

  useEffect(() => {
    // Handle browser back/forward buttons
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/shw/apiMsgList') {
        setCurrentPage('api-debug');
      } else {
        setCurrentPage('map');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <div className="app-container">
      {currentPage !== 'api-debug' && (
        <Sidebar
          currentPage={currentPage}
          setCurrentPage={(page) => {
            setCurrentPage(page);
            // Optional: Update URL on internal navigation
            if (page === 'api-debug') {
              window.history.pushState(null, '', '/shw/apiMsgList');
            } else if (page === 'map') {
              window.history.pushState(null, '', '/');
            }
          }}
          isMockMode={isMockMode}
          setIsMockMode={setIsMockMode}
        />
      )}

      <main className="main-content">
        {currentPage === 'map' && <MapPage isMockMode={isMockMode} />}
        {currentPage === 'taskmonitoring' && <TaskMonitoring />}
        {currentPage === 'api-debug' && <ApiDebugPage />}
      </main>
    </div>
  );
}
