import React, { useState } from 'react';
import {
    API_BASE_URL,
    API_HEADERS,
    API_GROUPS,
    getRequestTime,
    generateGuid
} from '../../config/apiConfig';
import { API_PAYLOAD_TEMPLATES } from '../../config/apiTemplates';

const ApiDebugManager = () => {
    // State
    const [selectedEndpoint, setSelectedEndpoint] = useState(null); // { name, msgType, groupColor }
    const [payload, setPayload] = useState('{}');
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeRequestMeta, setActiveRequestMeta] = useState(null);

    const handleSelectEndpoint = (name, msgType, groupColor) => {
        setSelectedEndpoint({ name, msgType, groupColor });

        // Use template if available, otherwise default to simple msgType object
        const template = API_PAYLOAD_TEMPLATES[msgType] || { msgType: msgType };
        console.log(template);

        setPayload(JSON.stringify(template, null, 2));

        setResponse(null);
        setError(null);
        setActiveRequestMeta(null);
    };

    const handleSend = async () => {
        if (!selectedEndpoint) return;

        setLoading(true);
        setResponse(null);
        setError(null);
        setActiveRequestMeta({
            msgType: selectedEndpoint.msgType,
            time: new Date().toLocaleTimeString()
        });

        const commonHeader = {
            requestId: generateGuid(),
            channelId: API_HEADERS.CHANNEL_ID,
            clientCode: API_HEADERS.CLIENT_CODE,
            language: API_HEADERS.LANGUAGE,
            requestTime: getRequestTime()
        };

        try {
            const parsedBody = payload ? JSON.parse(payload) : {};
            const requestPayload = {
                header: commonHeader,
                body: {
                    msgType: selectedEndpoint.msgType,
                    ...parsedBody
                }
            };

            const res = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestPayload)
            });

            const data = await res.json();
            setResponse(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="api-debug-container">
            <style>{`
                .api-debug-container {
                    display: flex;
                    height: 100vh;
                    overflow: hidden;
                    background: #1e272e;
                    color: #ecf0f1;
                }
                
                /* Left Sidebar: API List */
                .api-list-sidebar {
                    width: 300px;
                    flex-shrink: 0;
                    background: #2c3e50;
                    border-right: 1px solid #34495e;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                }
                
                .api-list-header {
                    padding: 20px;
                    border-bottom: 1px solid #34495e;
                    background: #242b33;
                }
                
                .api-group-item {
                    margin-bottom: 5px;
                }
                
                .api-group-title {
                    padding: 10px 20px;
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    color: #bdc3c7;
                    font-weight: bold;
                    letter-spacing: 0.05em;
                    background: rgba(0,0,0,0.2);
                }
                
                .api-item {
                    padding: 12px 20px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    border-left: 3px solid transparent;
                    transition: background 0.2s;
                    font-size: 0.9rem;
                }
                
                .api-item:hover {
                    background: rgba(255,255,255,0.05);
                }
                
                .api-item.active {
                    background: rgba(52, 152, 219, 0.1);
                    border-left-color: #3498db;
                    color: white;
                }
                
                .method-badge {
                    font-size: 0.6rem;
                    background: #34495e;
                    padding: 2px 5px;
                    border-radius: 3px;
                    margin-right: 10px;
                    color: #bdc3c7;
                }
                
                /* Main Content Area */
                .api-main-area {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }
                
                /* Top Header of Main Area */
                .api-request-header {
                    padding: 20px;
                    border-bottom: 1px solid #34495e;
                    background: #242b33;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                /* Split View: Request & Response */
                .split-view {
                    flex: 1;
                    display: flex;
                    overflow: hidden;
                }
                
                .pane-request, .pane-response {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    padding: 20px;
                    overflow-y: auto;
                    min-width: 300px;
                }
                
                .pane-request {
                    border-right: 1px solid #34495e;
                }
                
                .pane-title {
                    font-size: 0.85rem;
                    color: #7f8c8d;
                    margin-bottom: 10px;
                    text-transform: uppercase;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .editor-box {
                    flex: 1;
                    background: #1a1d21;
                    border: 1px solid #34495e;
                    border-radius: 4px;
                    padding: 10px;
                    color: #ecf0f1;
                    font-family: 'Consolas', 'Monaco', monospace;
                    font-size: 13px;
                    resize: none;
                    outline: none;
                    line-height: 1.5;
                }
                
                .editor-box:focus {
                    border-color: #3498db;
                }
                
                .send-btn-large {
                    margin-top: 15px;
                    padding: 12px;
                    background: #27ae60;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    font-weight: bold;
                    cursor: pointer;
                    text-align: center;
                    width: 100%;
                }
                
                .send-btn-large:hover {
                    background: #2ecc71;
                }
                
                .send-btn-large:disabled {
                    background: #7f8c8d;
                    cursor: wait;
                }
                
                .json-viewer {
                    background: #1a1d21;
                    padding: 15px;
                    border-radius: 4px;
                    overflow: auto;
                    font-family: monospace;
                    font-size: 13px;
                    min-height: 100px;
                    flex: 1;
                    border: 1px solid #34495e;
                }

                /* JSON Syntax Highlighting */
                .json-key { color: #f1c40f; }      /* Yellow for keys */
                .json-string { color: #2ecc71; }   /* Green for strings */
                .json-number { color: #e67e22; }   /* Orange for numbers */
                .json-boolean { color: #9b59b6; }  /* Purple for booleans */
                .json-null { color: #e74c3c; }     /* Red for null */
                
                .empty-state {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #7f8c8d;
                    font-size: 1.2rem;
                    flex-direction: column;
                    gap: 15px;
                }
            `}</style>

            {/* LEFT SIDEBAR: LIST */}
            <div className="api-list-sidebar">
                <div className="api-list-header">
                    <h3 style={{ margin: 0 }}>API Explorer</h3>
                </div>

                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {API_GROUPS.map((group) => (
                        <div key={group.name} className="api-group-item">
                            <div className="api-group-title" style={{ color: group.color }}>
                                {group.name}
                            </div>
                            {Object.entries(group.endpoints).map(([key, msgType]) => {
                                const isActive = selectedEndpoint?.name === key;
                                return (
                                    <div
                                        key={key}
                                        className={`api-item ${isActive ? 'active' : ''}`}
                                        style={isActive ? { borderLeftColor: group.color } : {}}
                                        onClick={() => handleSelectEndpoint(key, msgType, group.color)}
                                    >
                                        <span className="method-badge">POST</span>
                                        {key}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT MAIN AREA */}
            <div className="api-main-area">
                {!selectedEndpoint ? (
                    <div className="empty-state">
                        <span>Select an API endpoint to start debugging</span>
                    </div>
                ) : (
                    <>
                        <div className="api-request-header">
                            <div>
                                <h2 style={{ margin: 0, fontSize: '1.2rem' }}>{selectedEndpoint.name}</h2>
                                <span style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>{selectedEndpoint.msgType}</span>
                            </div>
                        </div>

                        <div className="split-view">
                            {/* REQUEST PANE (LEFT) */}
                            <div className="pane-request">
                                <div className="pane-title">Request Body</div>
                                <textarea
                                    className="editor-box"
                                    value={payload}
                                    onChange={(e) => setPayload(e.target.value)}
                                    spellCheck="false"
                                />
                                <button className="send-btn-large" onClick={handleSend} disabled={loading}>
                                    {loading ? 'Sending Request...' : '▶ Execute Request'}
                                </button>
                            </div>

                            {/* RESPONSE PANE (RIGHT) */}
                            <div className="pane-response">
                                <div className="pane-title">
                                    Response
                                    {activeRequestMeta && <span style={{ fontSize: '0.8rem' }}>{activeRequestMeta.time}</span>}
                                </div>

                                {error ? (
                                    <div className="json-viewer" style={{ borderColor: '#e74c3c', color: '#e74c3c' }}>
                                        {error}
                                    </div>
                                ) : (
                                    <div className="json-viewer" style={!response ? { color: '#7f8c8d', fontStyle: 'italic', display: 'flex', alignItems: 'center', justifyContent: 'center' } : {}}>
                                        {response ? (
                                            <JsonHighlighter data={response} />
                                        ) : (
                                            "Waiting for response..."
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

const JsonHighlighter = ({ data }) => {
    if (!data) return null;

    const json = JSON.stringify(data, null, 2);

    // Regex logic to tokenize and wrap in spans
    const html = json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        let cls = 'json-number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'json-key';
            } else {
                cls = 'json-string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'json-boolean';
        } else if (/null/.test(match)) {
            cls = 'json-null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });

    return (
        <pre dangerouslySetInnerHTML={{ __html: html }} style={{ margin: 0 }}></pre>
    );
};

export default ApiDebugManager;
