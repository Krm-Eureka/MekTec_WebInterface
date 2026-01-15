import React from 'react';
import { WORKFLOW_CODES } from '../../config/workflowConfig';

const WorkflowSelector = ({ isOpen, sourceLocation, allLocations, onSelect, onCancel }) => {
    console.log('🔧 WorkflowSelector render', { isOpen, sourceLocation: sourceLocation?.name, locationsCount: allLocations?.length });

    if (!isOpen || !sourceLocation) return null;

    // Find available workflows from this source
    const availableWorkflows = Object.keys(WORKFLOW_CODES).filter(key => {
        const [fromName] = key.split(' >>> ').map(s => s.trim());
        return fromName === sourceLocation.stationName;
    });

    console.log('📋 Available workflows:', availableWorkflows);

    // Get destination locations for each workflow
    const workflowOptions = availableWorkflows.map(workflowKey => {
        const [, toName] = workflowKey.split(' >>> ').map(s => s.trim());
        const destination = allLocations.find(loc => loc.stationName === toName);
        return {
            key: workflowKey,
            fromName: sourceLocation.stationName,
            toName,
            workflowCode: WORKFLOW_CODES[workflowKey],
            destination
        };
    }).filter(wf => wf.destination); // Only show if destination exists

    console.log('✅ Workflow options:', workflowOptions.length);

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div
                className="workflow-selector-modal"
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: 'var(--bg-card)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    width: '90%',
                    maxWidth: '400px',
                    border: '1px solid var(--border-color)',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
                }}
            >
                <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: '700',
                        color: 'var(--text-active)',
                        marginBottom: '0.5rem'
                    }}>
                        Select Workflow
                    </h3>
                    <p style={{
                        fontSize: '0.875rem',
                        color: 'var(--text-main)',
                        margin: 0
                    }}>
                        From: <strong style={{ color: '#2ecc71' }}>{sourceLocation.stationName}</strong> (F{sourceLocation.floorId})
                    </p>
                </div>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    marginBottom: '1rem',
                    maxHeight: '300px',
                    overflowY: 'auto'
                }}>
                    {workflowOptions.length === 0 ? (
                        <div style={{
                            padding: '2rem',
                            textAlign: 'center',
                            color: 'var(--text-main)',
                            fontSize: '0.875rem'
                        }}>
                            No workflows available from this location
                        </div>
                    ) : (
                        workflowOptions.map((workflow) => (
                            <button
                                key={workflow.key}
                                onClick={() => onSelect(sourceLocation, workflow.destination)}
                                style={{
                                    background: 'rgba(0, 123, 255, 0.1)',
                                    border: '1px solid var(--primary)',
                                    borderRadius: '8px',
                                    padding: '1rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    textAlign: 'left'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.background = 'var(--primary)';
                                    e.currentTarget.style.transform = 'translateX(4px)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.background = 'rgba(0, 123, 255, 0.1)';
                                    e.currentTarget.style.transform = 'translateX(0)';
                                }}
                            >
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: '0.5rem'
                                }}>
                                    <span style={{
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        color: 'var(--text-active)'
                                    }}>
                                        To: {workflow.toName}
                                    </span>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        background: 'rgba(46, 204, 113, 0.2)',
                                        color: '#2ecc71',
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '4px'
                                    }}>
                                        F{workflow.destination.floorId}
                                    </span>
                                </div>
                                <div style={{
                                    fontSize: '0.75rem',
                                    color: 'var(--text-main)',
                                    fontFamily: 'monospace'
                                }}>
                                    Code: {workflow.workflowCode}
                                </div>
                            </button>
                        ))
                    )}
                </div>

                <button
                    onClick={onCancel}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: 'transparent',
                        border: '1px solid var(--border-color)',
                        borderRadius: '6px',
                        color: 'var(--text-main)',
                        cursor: 'pointer',
                        fontWeight: '600',
                        transition: 'background 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default WorkflowSelector;
