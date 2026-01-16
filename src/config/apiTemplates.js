export const API_PAYLOAD_TEMPLATES = {
    // =================================================================
    // 1. หมวดดึงข้อมูล (LISTS & QUERIES)
    // ใช้สำหรับค้นหา IDs, พิกัด, หรือสถานะของสิ่งของในระบบ
    // =================================================================

    // [LocationListMsg]
    // วิธีใช้: ใช้ค้นหา "รหัสภายใน" (Internal ID) ของจุดจอดต่างๆ (เช่น 200000062)
    // ประโยชน์: เอา ID ที่ได้ไปใส่ในคำสั่ง WorkflowStartMsg เพื่อแก้ Error 3516
    'LocationListMsg': {
        "msgType": "LocationListMsg",
        "floorId": "INTEGER", 
        "locationType": "STRING" // Optional: กรองเฉพาะจุดจอด (STATION_CELL) หรือจุดหมุน (OMNI_DIR_CELL)
    },

    // [StationListMsg]
    // วิธีใช้: ส่ง body ว่างๆ เพื่อดึงรายชื่อ Station ทั้งหมด
    // ประโยชน์: เพื่อดูว่า Station นี้ (เช่น PACK) มีจุดจอดลูก (Docking Points) ชื่ออะไรบ้าง
    'StationListMsg': {
        "msgType": "StationListMsg"
    },

    // [ContainerListMsg]
    // วิธีใช้: ใช้ค้นหาว่าชั้นวาง/ตะกร้า (Container) เบอร์นี้ อยู่ที่พิกัดไหน
    // ประโยชน์: เมื่อต้องการสั่งหุ่นไปรับชั้นวางเจาะจง (Target specific shelf)
    'ContainerListMsg': {
        "msgType": "ContainerListMsg",
        "containerCode": "STRING" // ใส่รหัสชั้นวางที่ต้องการหา (เช่น "00000038")
    },

    // [WorkflowInstanceListMsg]
    // วิธีใช้: ใช้ติดตามสถานะงาน (Tracking)
    // - instanceStatus: "20" = กำลังวิ่ง (Running)
    // - instanceStatus: "30" = เสร็จแล้ว (Completed)
    // - instanceStatus: "40" = Error
    'WorkflowInstanceListMsg': {
        "msgType": "WorkflowInstanceListMsg",
        "instanceStatus": "STRING" // ใส่สถานะที่ต้องการกรอง หรือลบออกเพื่อดูทั้งหมด
    },

    // =================================================================
    // 2. หมวดสั่งงาน (TASKS & ACTIONS)
    // ใช้สำหรับสั่งให้หุ่นยนต์เริ่มทำงาน
    // =================================================================

    // [WorkflowStartMsg]
    // วิธีใช้: คำสั่งเริ่มงานมาตรฐาน (Standard Task)
    // ข้อควรระวัง: 
    // 1. startPoint ควรใช้เป็น "locationCode" (รหัสตัวเลข Internal ID) เพื่อความแม่นยำสูงสุด
    // 2. ไม่ต้องใส่ taskCode (ระบบจะจัดการผ่าน RequestID ใน Header)
    'WorkflowStartMsg': {
        "msgType": "WorkflowStartMsg",
        "workflowCode": "STRING", // ใส่รหัส Workflow Template ที่ต้องการ
        "locationCode": "STRING"        // [สำคัญ] ใส่ Internal ID ของจุดรับ (แก้ปัญหาหาจุดไม่เจอ)
    },

    // =================================================================
    // 3. หมวดรายละเอียดระบบ (SYSTEM DETAILS)
    // ใช้ดูสถานะ Hardware และแผนที่
    // =================================================================

    // [RobotInfoMsg]
    // วิธีใช้: ใช้ดูสถานะหุ่นยนต์ (แบตเตอรี่, ออนไลน์/ออฟไลน์, Error Code)
    // ประโยชน์: เอาไว้ทำ Dashboard หน้า Monitor Fleet หุ่นยนต์
    'RobotInfoMsg': {
        "msgType": "RobotInfoMsg",
        "robotCode": "STRING" // ปล่อยว่างเพื่อดูทั้งหมด หรือใส่เบอร์หุ่นเพื่อเจาะจง
    },

    // [MapInfoMsg]
    // วิธีใช้: ดึงข้อมูลพื้นฐานของแผนที่
    'MapInfoMsg': {
        "msgType": "MapInfoMsg",
        "floorId": "INTEGER"
    }
};