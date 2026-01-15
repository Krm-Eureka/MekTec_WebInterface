export const MOCK_STATION_MAP = {
    'ST-01': 'PACK',
    'B3F1_1_IN': 'B3F1',
    'ELEVATOR': 'LIFT',
    'PP_HDD': 'PP_HDD',
    'ST-02': 'PACK',
    'F2_ST-01': 'PACK',
    'F2_LIFT': 'LIFT',
    'F3_PACK': 'PACK',
    'F3_LIFT': 'LIFT'
};

export const MOCK_CONTAINERS = [
    {
        containerCode: 'C-001',
        locationCode: 'ST-01',
        status: 1,
        width: 1.1,
        length: 0.7,
        orientation: 0
    },
    {
        containerCode: 'C-002',
        locationCode: 'B3F1_1_IN',
        status: 2, // Busy
        taskCode: 'T-MOCK-01',
        width: 1.1,
        length: 0.7,
        orientation: 0
    },
    {
        containerCode: 'C-003',
        locationCode: 'PP_HDD',
        status: 1,
        width: 1.1,
        length: 0.7,
        orientation: 90
    }
];

export const MOCK_LOCATIONS = [
    // Floor 1
    { 
        id: 'ST-01', 
        name: 'Packing 1', 
        stationName: 'PACK', 
        apiX: 18.5, 
        apiY: 16.75, 
        floorId: 1, 
        hasShelf: true, 
        raw: { locationCode: 'ST-01', locationType: 'MOCK' } 
    },
    { 
        id: 'B3F1_1_IN', 
        name: 'B3F1_1_IN', 
        stationName: 'B3F1', 
        apiX: 20.0, 
        apiY: 16.75, 
        floorId: 1, 
        hasShelf: true, 
        raw: { locationCode: 'B3F1_1_IN', locationType: 'MOCK' } 
    },
    { 
        id: 'ELEVATOR', 
        name: 'ELEVATOR', 
        stationName: 'LIFT', 
        apiX: 7.6, 
        apiY: 53.0, 
        floorId: 1, 
        hasShelf: false, 
        raw: { locationCode: 'ELEVATOR', locationType: 'MOCK' } 
    },
    { 
        id: 'PP_HDD', 
        name: 'PP_HDD', 
        stationName: 'PP_HDD', 
        apiX: 10.3, 
        apiY: 53.0, 
        floorId: 1, 
        hasShelf: true, 
        raw: { locationCode: 'PP_HDD', locationType: 'MOCK' } 
    },
    
    // Floor 2
    { 
        id: 'F2_ST-01', 
        name: 'F2 Pack A', 
        stationName: 'PACK', 
        apiX: 15.0, 
        apiY: 20.0, 
        floorId: 2, 
        hasShelf: false, 
        raw: { locationCode: 'F2_ST-01', locationType: 'MOCK' } 
    },
    { 
        id: 'F2_LIFT', 
        name: 'F2 LIFT', 
        stationName: 'LIFT', 
        apiX: 7.6, 
        apiY: 53.0, 
        floorId: 2, 
        hasShelf: true, 
        raw: { locationCode: 'F2_LIFT', locationType: 'MOCK' } 
    },
    
    // Floor 3
    { 
        id: 'F3_PACK', 
        name: 'F3 Pack B', 
        stationName: 'PACK', 
        apiX: 25.0, 
        apiY: 30.0, 
        floorId: 3, 
        hasShelf: true, 
        raw: { locationCode: 'F3_PACK', locationType: 'MOCK' } 
    },
    { 
        id: 'F3_LIFT', 
        name: 'F3 LIFT', 
        stationName: 'LIFT', 
        apiX: 7.6, 
        apiY: 53.0, 
        floorId: 3, 
        hasShelf: false, 
        raw: { locationCode: 'F3_LIFT', locationType: 'MOCK' } 
    },
];
