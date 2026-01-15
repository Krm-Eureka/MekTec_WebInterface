import React, { useState, useEffect } from 'react';
import MapCanvas from '../components/TaskControl/MapCanvas';
import ConfirmModal from '../components/TaskControl/ConfirmModal';
import WorkflowSelector from '../components/TaskControl/WorkflowSelector';
import SelectionBanner from '../components/Map/SelectionBanner';
import { useMapData } from '../hooks/useMapData';
import { useTaskManager } from '../hooks/useTaskManager';

const MapPage = ({ isMockMode }) => {
    const [currentFloor, setCurrentFloor] = useState(1);
    const [isMobileMode, setIsMobileMode] = useState(window.innerWidth <= 900);
    const [stageSize, setStageSize] = useState({
        width: window.innerWidth - (window.innerWidth > 900 ? 260 : 0),
        height: window.innerHeight - (window.innerWidth > 900 ? 0 : 60)
    });

    // Use custom hooks for data and task management
    const { locations, tasks, loading, error, setTasks } = useMapData(isMockMode);
    const {
        isModalOpen,
        pendingTask,
        selectedSource,
        isWorkflowSelectorOpen,
        setSelectedSource,
        setIsWorkflowSelectorOpen,
        openWorkflowModal,
        handleWorkflowSelect,
        handleCancelWorkflowSelector,
        handleCancelSelection,
        confirmTask,
        cancelTaskCreation
    } = useTaskManager(setTasks);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            const isMobile = window.innerWidth <= 900;
            setIsMobileMode(isMobile);
            setStageSize({
                width: window.innerWidth - (isMobile ? 0 : 260),
                height: window.innerHeight - (isMobile ? 60 : 0)
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Handle task creation requests from MapCanvas
    const handleAddTaskRequest = (from, to) => {
        console.log('🎯 handleAddTaskRequest called', { from: from?.name, to: to?.name, isMobileMode });

        // CASE 1: Drag & Drop (both 'from' and 'to' provided) - Desktop only
        if (from && to) {
            console.log('📍 Case 1: Drag & Drop');
            openWorkflowModal(from, to);
            return;
        }

        // CASE 2: Mobile Mode - Show Workflow Selector
        if (isMobileMode) {
            console.log('📱 Case 2: Mobile Mode - Opening Workflow Selector');
            setSelectedSource(from);
            setIsWorkflowSelectorOpen(true);
            return;
        }

        // CASE 3: Desktop Selection (Pinning)
        console.log('🖥️ Case 3: Desktop Selection');
        if (!selectedSource) {
            console.log('  → Setting source:', from.name);
            setSelectedSource(from);
        } else {
            if (from.id === selectedSource.id) {
                console.log('  → Deselecting (same location)');
                setSelectedSource(null);
                return;
            }
            console.log('  → Proceeding to modal');
            openWorkflowModal(selectedSource, from);
        }
    };

    const filteredLocations = locations.filter(l => l.floorId === currentFloor);

    return (
        <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Floor Selector */}
            <div className="floor-selector">
                {[1, 2, 3].map(floor => (
                    <button
                        key={floor}
                        className={`floor-btn ${currentFloor === floor ? 'active' : ''}`}
                        onClick={() => setCurrentFloor(floor)}
                    >
                        Floor {floor}
                    </button>
                ))}
            </div>

            {/* Map Canvas */}
            {loading ? (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <div className="loader">Loading Map Data...</div>
                </div>
            ) : (
                <MapCanvas
                    floorId={currentFloor}
                    locations={filteredLocations}
                    tasks={tasks}
                    selectedSource={selectedSource}
                    onAddTask={handleAddTaskRequest}
                    width={stageSize.width}
                    height={stageSize.height}
                    isMockMode={isMockMode}
                    isMobileMode={isMobileMode}
                />
            )}

            {/* Selection Banner (Desktop only) */}
            <SelectionBanner
                selectedSource={selectedSource}
                isMobileMode={isMobileMode}
                onCancel={handleCancelSelection}
            />

            {/* Error Message */}
            {error && (
                <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '260px',
                    background: 'rgba(231, 76, 60, 0.8)',
                    color: 'white',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    zIndex: 100
                }}>
                    {error}
                </div>
            )}

            {/* Confirm Modal */}
            <ConfirmModal
                isOpen={isModalOpen}
                taskData={pendingTask}
                onConfirm={confirmTask}
                onCancel={cancelTaskCreation}
            />

            {/* Workflow Selector (Mobile) */}
            <WorkflowSelector
                isOpen={isWorkflowSelectorOpen}
                sourceLocation={selectedSource}
                allLocations={locations}
                onSelect={handleWorkflowSelect}
                onCancel={handleCancelWorkflowSelector}
            />
        </div>
    );
};

export default MapPage;
