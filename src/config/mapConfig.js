// Configuration for Map Canvas behavior and appearance
export const MAP_CONFIG = {
    MULTIPLIER: 50,          // Pixels per meter
    SNAP_DISTANCE: 30,       // Drag & Drop snap distance
    ORIGIN_OFFSET_X: 0,      // Fine-tune X origin
    ORIGIN_OFFSET_Y: 0,      // Fine-tune Y origin
    DEFAULT_LOC_SIZE: 1.2,   // Default meters if API missing size
    OPACITY: 1.0,            // Background map opacity
    
    // Aesthetic settings
    COLORS: {
        STATION_NAME: "#00e5ff",
        EMPTY_STATION: "#00bcd4",
        ACTIVE_STATION: "#2ecc71",
        SHELF: "#49e743ff",
        SHELF_BUSY: "#0b228bff",
        LABEL_BG: "rgba(0, 0, 0, 0.7)",
        TASK_PENDING: "#f1c40f",
        TASK_RUNNING: "#3498db",
        TASK_DONE: "#2ecc71",
        TASK_ERROR: "#e74c3c",
        TASK_CANCELLED: "#95a5a6",
        TASK_SUSPENDED: "#9b59b6",
        TASK_ABNORMAL: "#c0392b"
    }
};
