import { useState, useEffect } from 'react';
import { API_BASE_URL, API_MSG_LIST, API_HEADERS, getRequestTime, generateGuid } from '../config/apiConfig';
import { normalizeStationName, WORKFLOW_CODES } from '../config/workflowConfig';
import { MAP_CONFIG } from '../config/mapConfig';
import { MOCK_STATION_MAP, MOCK_LOCATIONS, MOCK_CONTAINERS } from '../data/mockData';
import { ContainerModel } from '../models/containerModel';

/**
 * Custom hook for fetching and managing map data
 * Handles locations, stations, containers, and active workflows
 */
export const useMapData = (isMockMode) => {
    const [locations, setLocations] = useState([]);
    const [stationMap, setStationMap] = useState({});
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            let locData, staData, contData, wfData;
            let currentStationMap = {};
            let currentContainerMap = {};

            try {
                setLoading(true);

                if (isMockMode) {
                    // --- MOCK MODE ---
                    setStationMap(MOCK_STATION_MAP);
                    currentStationMap = MOCK_STATION_MAP;
                    
                    // Process Mock Containers
                    if (MOCK_CONTAINERS) {
                        MOCK_CONTAINERS.forEach(c => {
                            if (c.locationCode) {
                                currentContainerMap[c.locationCode] = new ContainerModel(c);
                            }
                        });
                    }
                    
                    locData = { header: { code: "0" }, body: MOCK_LOCATIONS };
                    contData = { header: { code: "0" }, body: [] }; // Handled above
                    wfData = { header: { code: "0" }, body: [] }; // Mock tasks logic if needed
                } else {
                    // --- REAL API MODE ---
                    const commonHeader = {
                        requestId: generateGuid(),
                        channelId: API_HEADERS.CHANNEL_ID,
                        clientCode: API_HEADERS.CLIENT_CODE,
                        language: API_HEADERS.LANGUAGE,
                        requestTime: getRequestTime()
                    };

                    // 1. Fetch Locations
                    const locRes = await fetch(API_BASE_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            header: commonHeader,
                            body: { msgType: API_MSG_LIST.LOCATION_LIST }
                        })
                    });
                    if (!locRes.ok) throw new Error(`API Error: ${locRes.status}`);
                    locData = await locRes.json();

                    // 2. Fetch Station List
                    const staRes = await fetch(API_BASE_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            header: { ...commonHeader, requestId: generateGuid() },
                            body: { msgType: API_MSG_LIST.STATION_LIST }
                        })
                    });
                    if (!staRes.ok) throw new Error(`Station API Error: ${staRes.status}`);
                    staData = await staRes.json();

                    // Process Station Mapping
                    if (staData?.body && Array.isArray(staData.body)) {
                        staData.body.forEach(station => {
                            const normalized = normalizeStationName(station.stationCode);
                            if (station.locations) {
                                station.locations.forEach(loc => {
                                    currentStationMap[loc.locationCode] = normalized;
                                });
                            }
                        });
                        setStationMap(currentStationMap);
                    }

                    // 3. Fetch Container List
                    const contRes = await fetch(API_BASE_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            header: { ...commonHeader, requestId: generateGuid() },
                            body: { msgType: API_MSG_LIST.CONTAINER_LIST }
                        })
                    });
                    if (contRes.ok) {
                        contData = await contRes.json();
                        if (contData?.body && Array.isArray(contData.body)) {
                            contData.body.forEach(c => {
                                if (c.locationCode) {
                                    currentContainerMap[c.locationCode] = ContainerModel.fromApiResponse(c);
                                }
                            });
                        }
                    }

                    // 4. Fetch Active Workflows
                    const wfRes = await fetch(API_BASE_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            header: { ...commonHeader, requestId: generateGuid() },
                            body: { msgType: API_MSG_LIST.WORKFLOW_INSTANCE_LIST }
                        })
                    });
                    if (wfRes.ok) {
                        wfData = await wfRes.json();
                    }
                }

                // Process Locations with Container Info
                let finalLocations = [];
                const rawLocations = locData?.body || [];
                
                if (locData?.header?.code === "0" && Array.isArray(rawLocations)) {
                    finalLocations = rawLocations
                        .filter(item => {
                            // Support both API format and Mock format
                            const type = item.locationType || item.raw?.locationType;
                            return type === "STATION_CELL" || type === "MOCK";
                        }) 
                        .map(item => {
                            // Normalize Key Access: Support both Mock (id) and API (locationCode) structures
                            const locCode = item.locationCode || item.id;
                            const hostCode = item.hostCellCode || item.locationCode || item.id;
                            const apiX = item.location?.x ?? item.apiX;
                            const apiY = item.location?.y ?? item.apiY;
                            const floorId = item.location?.z ? Math.floor(item.location.z) : (item.floorId || 1);
                            
                            const contInfo = currentContainerMap[locCode];
                            // Logic: If mock hasShelf=true but no container defined, create default mock container
                            // OR if API returns occupyContainerCode
                            const baseContainerCode = item.occupyContainerCode;
                            
                            // If mock says hasShelf=true but no container in list, generate one
                            let activeContainer = contInfo;
                            if (!activeContainer && item.hasShelf && isMockMode) {
                                activeContainer = ContainerModel.createMock(`C-${locCode}`, locCode);
                            } else if (!activeContainer && baseContainerCode) {
                                // Fallback for real API if container list missing but location has code
                                activeContainer = new ContainerModel({
                                    containerCode: baseContainerCode,
                                    width: 1.1, length: 0.7, orientation: 0 
                                });
                            }

                            return {
                                id: locCode,
                                name: hostCode,
                                stationName: currentStationMap[locCode] || normalizeStationName(hostCode),
                                apiX: apiX,
                                apiY: apiY,
                                width: item.width || MAP_CONFIG.DEFAULT_LOC_SIZE,
                                length: item.length || MAP_CONFIG.DEFAULT_LOC_SIZE,
                                floorId: floorId,
                                
                                // Visualization Logic
                                hasShelf: !!activeContainer,
                                containerCode: activeContainer?.code || null,
                                containerWidth: activeContainer?.width || 1.1,
                                containerLength: activeContainer?.length || 0.7,
                                containerOrientation: activeContainer?.orientation || 0,
                                isBusy: activeContainer?.status === 2,
                                taskCode: activeContainer?.taskCode,
                                
                                raw: { ...item, container: activeContainer }
                            };
                        });
                    setLocations(finalLocations);
                }

                // Process Workflows (Only if WF Data exists)
                if (wfData?.body && Array.isArray(wfData.body)) {
                     const processedTasks = processWorkflows(wfData.body, finalLocations);
                     setTasks(processedTasks);
                }
                
                setError(null);

            } catch (err) {
                console.error("Fetch Error:", err);
                setError(`API Sync Error: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isMockMode]);

    return { locations, stationMap, tasks, loading, error, setTasks };
};

// Helper function to process workflows
const processWorkflows = (workflows, locations) => {
    // WORKFLOW_CODES is now imported at top level
    
    const mapApiStatus = (s) => {
        switch (Number(s)) {
            case 10: return 'PENDING';
            case 20: return 'RUNNING';
            case 30: return 'DONE';
            case 31: return 'CANCELLED';
            case 32: return 'SUSPENDED';
            case 40: return 'ABNORMAL';
            default: return 'UNKNOWN';
        }
    };

    const getRouteFromCode = (code) => {
        const entry = Object.entries(WORKFLOW_CODES).find(([k, v]) => v === code);
        if (entry) {
            const [fromName, toName] = entry[0].split(' >>> ').map(s => s.trim());
            return { fromName, toName };
        }
        return null;
    };

    return workflows
        .filter(wf => {
            const status = Number(wf.workflowPocStatus || wf.status);
            return [10, 20, 32, 40].includes(status);
        })
        .map(wf => {
            const route = getRouteFromCode(wf.workflowCode);
            if (!route) return null;

            const fromLoc = locations.find(l => l.stationName === route.fromName);
            const toLoc = locations.find(l => l.stationName === route.toName);

            if (!fromLoc || !toLoc) return null;

            return {
                id: wf.workflowInstanceId || wf.taskCode || `WF-${Math.random()}`,
                fromId: fromLoc.id,
                toId: toLoc.id,
                status: mapApiStatus(wf.workflowPocStatus || wf.status),
                floorId: toLoc.floorId,
                workflowCode: wf.workflowCode
            };
        })
        .filter(Boolean);
};
