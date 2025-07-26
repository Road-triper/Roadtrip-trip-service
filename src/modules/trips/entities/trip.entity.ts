export class Trip {
    constructor(
        public readonly id: string, //think about UUID
        public userId: string, // from auth service
        public name: string,
        public description: string,
        public startDate: Date,
        public endDate: Date,
        public status: TripStatus,
        public isPublic: boolean,
        public tags: string[],
        public waypoints: Waypoint[] = [],
    ) {}
}
