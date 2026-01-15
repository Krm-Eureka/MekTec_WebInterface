// Configuration for API endpoints and common helpers
export const API_BASE_URL = '/api-geekplus';

export const API_MSG_LIST = {
    LOCATION_LIST: 'LocationListMsg',
    STATION_LIST: 'StationListMsg',
    SUBMIT_TASK: 'SubmitTaskMsg',
    CONTAINER_LIST: 'ContainerListMsg',
    AREA_LIST: 'AreaListMsg',
    TRAFFICCONTROLAREA_LIST: 'TrafficControlAreaListMsg',
    WORKFLOWINSTANCE_LIST: 'WorkflowInstanceListMsg',
    WORKFLOW_INSTANCE_LIST: 'WorkflowInstanceListMsg',
};
export const API_MSG_CREATE_TASK ={
    WORKFLOW_START: 'WorkflowStartMsg',
}

export const API_MSG_DETAIL = {
    ROBOT_INFO: 'RobotInfoMsg',
    CHARGER_INFO: 'ChargerInfoMsg',
    MAP_INFO: 'MapInfoMsg'
};
export const API_GROUPS = [
    {
        name: "Data Lists",
        color: "#3498db",
        endpoints: API_MSG_LIST
    },
    {
        name: "Task Creation",
        color: "#2ecc71",
        endpoints: API_MSG_CREATE_TASK
    },
    {
        name: "System Details",
        color: "#9b59b6",
        endpoints: API_MSG_DETAIL
    }
];

export const API_HEADERS = {
    CHANNEL_ID: 'EA-Interface',
    CLIENT_CODE: 'MEKTEC',
    LANGUAGE: "en_us",
};

export const DEBUG_ACCESS_HASH = '9919e37a09efa86d858226ec423509ccb9c9872ce37adc398d8daaa06ce3749d';

export const getRequestTime = () => {
    const now = new Date();
    return now.toISOString().replace('T', ' ').substring(0, 19);
};

export const generateGuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};
