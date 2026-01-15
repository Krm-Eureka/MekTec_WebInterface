// Configuration for Workflows and their respective codes
export const WORKFLOW_CODES = {
    "PP_HDD >>> LIFT": "F202601120000005",
    "PP_HDD >>> PACK": "F202601120000004",
    "LIFT >>> PP_HDD": "F202601120000003",
    "PACK >>> PP_HDD": "F202601120000001",
    "PP_HDD >>> B3F1": "F202512260000007",
    "B3F1 >>> PP_HDD": "F202512260000006",
    "B3F1 >>> PACK": "F202512240000003",
    "B3F1 >>> LIFT": "F202512240000001",
    "LIFT >>> B3F1": "F202512260000002",
    "LIFT >>> PACK": "F202512260000001",
    
    // Special Workflows
    "HDD-ROT-TEST": "F000012",
    "TEST-ROT-HDD": "F000011"
};

// Aliases for normalizing station names from API to Workflow names
export const STATION_ALIASES = {
    "ELEVATOR": "LIFT",
    "B3F1_1_IN": "B3F1",
    "B3F1_2_IN": "B3F1",
    "B3F1_1_OUT": "B3F1",
    "B3F1_2_OUT": "B3F1",
    "PACK": "PACK",
    "ST-": "PACK",          // Any code starting with ST- is Packing
    "PACKING_1": "PACK",    // Any code containing PACKING
    "PACKING_2": "PACK"      // Any code containing PACKING
};

/**
 * Normalizes a station name using the aliases defined above.
 */
export const normalizeStationName = (sName) => {
    if (!sName) return "";
    
    const upperName = sName.toUpperCase();

    // 1. Check for specific prefixes first
    if (upperName.startsWith("ST-")) return "PACK";
    
    // 2. Exact match check
    if (STATION_ALIASES[upperName]) {
        return STATION_ALIASES[upperName];
    }
    
    // 3. Substring check (e.g., B3F1_1_IN -> B3F1)
    for (const [key, alias] of Object.entries(STATION_ALIASES)) {
        if (upperName.includes(key)) return alias;
    }

    return sName;
};

// Workflow Instance Status Definitions
export const WORKFLOW_STATUS_MAP = {
    "10": { label: "CREATED", color: "#f1c40f", description: "เข้าคิวรอหุ่นยนต์" },
    "20": { label: "STARTED", color: "#3498db", description: "กำลังทำงาน" },
    "30": { label: "COMPLETED", color: "#2ecc71", description: "เสร็จสมบูรณ์" },
    "31": { label: "CANCELED", color: "#95a5a6", description: "ถูกยกเลิก" },
    "32": { label: "SUSPENDED", color: "#e67e22", description: "ถูกระงับชั่วคราว" },
    "40": { label: "ABNORMAL", color: "#e74c3c", description: "มีข้อผิดพลาด" }
};

// Map API Result Codes to User-Friendly Messages
export const CODE_RESULT = {
    // ============================================================
    // 0. SUCCESS
    // ============================================================
    "0": { level: "success", title: "Success", message: "ทำรายการสำเร็จ", action: "NONE" },

    // ============================================================
    // 1. GENERAL ERRORS
    // ============================================================
    "-1": { level: "error", title: "System Exception", message: "ระบบขัดข้อง (Unknown Error)", action: "CONTACT_ADMIN" },
    "1001": { level: "critical", title: "Parameter Error", message: "รูปแบบข้อมูล JSON ไม่ถูกต้อง", action: "DEV_ALERT" },
    "1002": { level: "critical", title: "Interface Error", message: "ระบุ msgType ไม่ถูกต้อง", action: "DEV_ALERT" },
    "1004": { level: "error", title: "Data Not Found", message: "ไม่พบข้อมูลในระบบ", action: "CHECK_DATA" },
    "404": { level: "error", title: "Data Not Found", message: "ไม่พบข้อมูล (404)", action: "CHECK_DATA" }, // Alias for convenience

    // ============================================================
    // 2. ROBOT & DEVICE ERRORS
    // ============================================================
    "3001": { level: "error", title: "Robot Not Found", message: "ไม่พบรหัสหุ่นยนต์", action: "CHECK_ID" },
    "3002": { level: "critical", title: "Robot Offline", message: "หุ่นยนต์ขาดการเชื่อมต่อ", action: "SITE_ALERT" },
    "3003": { level: "warning", title: "Robot Busy", message: "หุ่นยนต์ไม่ว่าง", action: "RETRY" },
    "3504": { level: "warning", title: "No Robot Available", message: "ไม่มีหุ่นยนต์ว่างสำหรับงานนี้", action: "RETRY" },

    // ============================================================
    // 3. WORKFLOW & LOGIC ERRORS
    // ============================================================
    "3501": { level: "critical", title: "Workflow Not Found", message: "ไม่พบรหัส Workflow Template", action: "DEV_ALERT" },
    "3505": { level: "warning", title: "Station Occupied", message: "สถานีปลายทางไม่ว่าง", action: "WAIT" },
    "3507": { level: "error", title: "Point Ambiguous", message: "ปลายทางมีหลายจุด ต้องระบุ locationCode", action: "FIX_PARAM" },
    "3516": { level: "error", title: "Docking Point Mismatch", message: "จุดจอดไม่ตรงกับสถานี", action: "FIX_PARAM" },
    "3520": { level: "error", title: "Inventory Error", message: "ไม่พบ Container/Shelf", action: "CHECK_STOCK" },
    "3530": { level: "error", title: "Strategy Error", message: "ไม่มีหุ่นยนต์ตามเงื่อนไข", action: "ADMIN_CHECK" },
    
    // ============================================================
    // 4. MAP ERRORS
    // ============================================================
    "4001": { level: "error", title: "Map Error", message: "ไม่พบข้อมูลแผนที่", action: "DEV_ALERT" },
    "300098": { level: "warning", title: "No Container Found", message: "ไม่พบ Shelf/Container ที่จุดเริ่มต้น", action: "CHECK_LOCATION" }
};
