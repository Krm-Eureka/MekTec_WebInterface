/**
 * Container Data Model
 * Standardizes container information from API/Mock data
 */
export class ContainerModel {
    constructor(data = {}) {
        this.code = data.containerCode || data.code || null;
        this.status = data.status || 0; // 0:Empty, 1:Occupied, 2:Busy/Booking
        this.taskCode = data.taskCode || null;
        
        // Physical Dimensions (in meters)
        this.width = Number(data.width) || 1.1;
        this.length = Number(data.length) || 0.7;
        this.orientation = Number(data.orientation || data.direction) || 0;
        
        // Location Reference
        this.locationCode = data.locationCode || null;
    }

    /**
     * Parse raw API response item
     */
    static fromApiResponse(item) {
        return new ContainerModel({
            containerCode: item.containerCode,
            status: item.status,
            taskCode: item.taskCode,
            width: item.width,
            length: item.length,
            orientation: item.orientation || item.direction,
            locationCode: item.locationCode
        });
    }

    /**
     * Create default mock container
     */
    static createMock(id, locationCode) {
        return new ContainerModel({
            containerCode: id,
            status: 1,
            taskCode: null,
            width: 1.1,
            length: 0.7,
            orientation: 0,
            locationCode: locationCode
        });
    }
}

export default ContainerModel;
