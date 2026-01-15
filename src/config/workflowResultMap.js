export const CODE_RESULT = {
  // ============================================================
  // 0. SUCCESS
  // ============================================================
  "0": {
    level: "info",
    title: "Success",
    message: "ทำรายการสำเร็จ",
    action: "NONE"
  },

  // ============================================================
  // 1. AUTHENTICATION (การยืนยันตัวตน - เพิ่มมาใหม่)
  // ============================================================
  "1101": {
    level: "critical",
    title: "Not Logged In",
    message: "กรุณาเข้าสู่ระบบใหม่ (Session Missing)",
    action: "FORCE_LOGOUT"
  },
  "1102": {
    level: "warning",
    title: "Session Timeout",
    message: "เซสชั่นหมดอายุ กรุณา Login ใหม่",
    action: "FORCE_LOGOUT"
  },
  "1103": {
    level: "error",
    title: "Authentication Failed",
    message: "ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง",
    action: "NONE"
  },
  "1104": {
    level: "error",
    title: "Permission Denied",
    message: "คุณไม่มีสิทธิ์ใช้งานฟังก์ชันนี้",
    action: "NONE"
  },

  // ============================================================
  // 2. SYSTEM ERRORS (ระบบ)
  // ============================================================
  "-1": {
    level: "error",
    title: "System Exception",
    message: "ระบบขัดข้อง (Unknown Error) ติดต่อ Support",
    action: "SUPPORT_ALERT"
  },
  "-100": {
    level: "critical",
    title: "Database Error",
    message: "ฐานข้อมูลระบบมีปัญหา",
    action: "DEV_ALERT"
  },
  "1001": {
    level: "critical",
    title: "Parameter Error",
    message: "ส่งข้อมูล JSON ผิดรูปแบบ",
    action: "DEV_ALERT"
  },
  "1002": {
    level: "critical",
    title: "Interface Error",
    message: "เรียกใช้งาน API ผิด (msgType ไม่ถูกต้อง)",
    action: "DEV_ALERT"
  },
  "1004": {
    level: "error",
    title: "Data Not Found",
    message: "ไม่พบข้อมูล ID ที่ระบุในระบบ",
    action: "DEV_ALERT"
  },

  // ============================================================
  // 3. ROBOT ERRORS (หุ่นยนต์)
  // ============================================================
  "3001": {
    level: "error",
    title: "Robot Not Found",
    message: "ไม่พบหุ่นยนต์รหัสนี้",
    action: "DEV_ALERT"
  },
  "3002": {
    level: "critical",
    title: "Robot Offline",
    message: "หุ่นยนต์ออฟไลน์ (ขาดการเชื่อมต่อ)",
    action: "SITE_ALERT"
  },
  "3003": {
    level: "warning",
    title: "Robot Busy",
    message: "หุ่นยนต์กำลังทำงานอื่นอยู่",
    action: "RETRY"
  },
  "3014": {
    level: "warning",
    title: "Low Battery",
    message: "แบตเตอรี่หุ่นยนต์ต่ำ",
    action: "SITE_ALERT"
  },
  "3015": {
    level: "critical",
    title: "Robot Hardware Error",
    message: "หุ่นยนต์ติด Error/E-Stop (ต้องการการซ่อมบำรุง)",
    action: "SITE_ALERT"
  },

  // ============================================================
  // 4. WORKFLOW & TASK ERRORS (งาน)
  // ============================================================
  "3501": {
    level: "critical",
    title: "Workflow Not Found",
    message: "ไม่พบรหัส Workflow Template นี้",
    action: "DEV_ALERT"
  },
  "3504": {
    level: "warning",
    title: "No Robot Available",
    message: "ไม่มีหุ่นยนต์ว่างสำหรับงานนี้",
    action: "RETRY"
  },
  "3505": {
    level: "warning",
    title: "Station Occupied",
    message: "สถานีไม่ว่าง (มีหุ่นอื่นจอดอยู่)",
    action: "SITE_ALERT"
  },
  "3507": {
    level: "error",
    title: "Point Ambiguous",
    message: "ปลายทางมีหลายจุด ต้องระบุ locationCode",
    action: "DEV_ALERT"
  },
  "3508": {
    level: "error",
    title: "Path Not Found",
    message: "หุ่นยนต์หาเส้นทางไม่ได้",
    action: "SITE_ALERT"
  },
  "3516": {
    level: "error",
    title: "Docking Point Mismatch",
    message: "รหัสจุดจอดไม่ตรงกับสถานีต้นทาง",
    action: "DEV_ALERT"
  },
  "3520": {
    level: "error",
    title: "Inventory Error",
    message: "ไม่พบรหัส Container/Shelf นี้",
    action: "SITE_ALERT"
  },
  "3521": {
    level: "warning",
    title: "Container Occupied",
    message: "Container ถูกใช้งานอยู่",
    action: "RETRY"
  },
  "3530": {
    level: "error",
    title: "Strategy Error",
    message: "ไม่มีหุ่นยนต์ที่ตรงเงื่อนไขงาน",
    action: "ADMIN_NOTIFY"
  },

  // ============================================================
  // 5. MAP & AREA ERRORS (แผนที่)
  // ============================================================
  "4001": {
    level: "error",
    title: "Map Not Found",
    message: "ไม่พบ Floor ID หรือ Map ID",
    action: "DEV_ALERT"
  },
  "4004": {
    level: "error",
    title: "Location Not Found",
    message: "ไม่พบรหัสจุดจอด (Location Code) นี้",
    action: "DEV_ALERT"
  },

  // ============================================================
  // 6. EXTERNAL DEVICES (ประตู/ลิฟต์ - เพิ่มมาใหม่)
  // ============================================================
  "6001": {
    level: "error",
    title: "Device Not Found",
    message: "ไม่พบอุปกรณ์ภายนอก (ประตู/ลิฟต์)",
    action: "SITE_ALERT"
  },
  "6002": {
    level: "error",
    title: "Device Control Failed",
    message: "สั่งงานอุปกรณ์ภายนอกล้มเหลว",
    action: "RETRY"
  },
  "6003": {
    level: "critical",
    title: "Device Offline",
    message: "อุปกรณ์ภายนอกออฟไลน์",
    action: "SITE_ALERT"
  }
};