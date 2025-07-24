import { Test, TestingModule } from '@nestjs/testing';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';

describe('TripsController', () => {
    let controller: TripsController;
    let service: TripsService;

    const mockTripsService = {
        findAll: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.creteTestingModule({
            controllers: [TripsController],
            providers: [
                {
                    provide: TripsService,
                    useValue: mockTripsService,
                },
            ],
        }).compile();

        controller = module.get<TripsController>(TripsController);
        service = module.get<TripsService>(TripsService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // ToDo: Remove when i'll become more fluent with a structure
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('GET /trips', () => {
        it('should return an array of trips if user has multiple trips', async () => {
            const userId = 'foobar';
            const startDate = new Date();
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 7);

            const expectedTrips = [
                {
                    id: '1',
                    name: 'Greece Road Trip',
                    userId,
                    startDate: startDate,
                    endDate: endDate,
                },
                {
                    id: '2',
                    name: 'Eurotrip',
                    userId,
                    startDate: startDate,
                    endDate: endDate,
                },
            ];

            mockTripsService.findAll.mockResolvedValue(expectedTrips);

            const result = await controller.findAll(userId);

            expect(result).toEqual(expectedTrips);
            expect(service.findAll).toHaveBeenCalledWith(userId);
            expect(service.findAll).toHaveBeenCalledTimes(1);
        });

        it('should return one trip if user has only one trip', async () => {
            const userId = 'foobar';
            const startDate = new Date();
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 7);

            const expectedTrips = [
                {
                    id: '1',
                    name: 'Greece Road Trip',
                    userId,
                    startDate: startDate,
                    endDate: endDate,
                },
            ];

            mockTripsService.findAll.mockResolvedValue(expectedTrips);

            const result = await controller.findAll(userId);

            expect(result).toEqual(expectedTrips);
            expect(service.findAll).toHaveBeenCalledWith(userId);
            expect(service.findAll).toHaveBeenCalledTimes(1);
        });

        it('should return an empty array if user has no trips', async () => {
            const userId = 'foobar';

            mockTripsService.findAll.mockResolvedValue([]);

            const result = await controller.findAll(userId);

            expect(result).toEqual([]);
            expect(service.findAll).toHaveBeenCalledWith(userId);
            expect(service.findAll).toHaveBeenCalledTimes(1);
        });
    });

    describe('GET /trips/id', () => {
        it('should return a single trip if trip exists', async () => {
            const userId = 'foo-user';
            const tripId = 'foo-trip';
            const expectedTrip = {
                id: tripId,
                name: 'Greece Road Trip',
                userId,
                startDate: new Date('2025-08-06'),
                endDate: new Date('2025-08-23'),
            };

            mockTripsService.findOne.mockResolvedValue(expectedTrip);

            const result = await controller.findOne(tripId, userId);

            expect(result).toEqual(expectedTrip);
            expect(service.findOne).toHaveBeenCalledWIth(trupId, userId);
        });

        it('should return a 404 if trip has not been found', async () => {
            const userId = 'foo-user';
            const tripId = 'non-existent-trip';

            mockTripsService.findOne.mockResolvedValue(404);

            await expect(controller.findOne(tripId, userId)).rejects.toThrow(
                'Trip was not found',
            );

            expect(service.findOne).toHaveBeenCalledWith(tripId, userId);
        });
    });

    describe('POST /trips', () => {
        it('should create a new trip if all required params were provided', async () => {
            const userId = 'foo-user';
            const createTripDto = {
                name: 'Balkan Trip',
                status: TripStatus.DRAFT,
                isPublic: false,
            };

            const expectedTrip = {
                id: 'new-trip',
                ...createTripDto,
                userId,
            };

            mockTripsService.create.mockResolvedValue(expectedTrip);

            const result = await controller.create(createTripDto, userId);

            expect(result).toEqual(expectedTrip);
            expect(service.create).toHaveBeenCalledWith(createTripDto, userId);
        });

        it('should create a new trip if all params were provided', async () => {
            const userId = 'foo-user';
            const createTripDto = {
                name: 'Greece trip',
                description: 'From the south to the north',
                startDate: new Date('2025-08-06'),
                endDate: new Date('2025-08-26'),
                status: TripStatus.PLANNED,
                isPublic: true,
                tags: ['greece', 'car'],
                waypoints: [new WaypointFactory.create()],
            };

            const expectedTrip = {
                id: 'trip-new',
                ...createTripDto,
                userId,
                startDate: new Date(createTripDto.startDate),
                endDate: new Date(createTripDto.endDate),
            };

            mockTripsService.create.mockResolvedValue(expectedTrip);

            const result = await controller.create(createTripDto, userId);

            expect(result).toEqual(expectedTrip);
            expect(service.create).toHaveBeenCalledWith(createTripDto, userId);
        });

        const cases = [
            [{ status: TripStatus.PLANNED, isPublic: true }, 'name'],
            [{ name: 'trip', isPublic: true }, 'status'],
            [{ name: 'trip', status: TripStatus.PLANNED }, 'isPublic'],
        ];

        it.each(cases)(
            'should throw exception if required params was not provided',
            async (createTripDto, missingField) => {
                const userId = 'foo-user';

                await expect(
                    controller.create(userId, createTripDto),
                ).rejects.toThrow('Missing required parameter');
            },
        );

        it('should throw exceptiom if endDate is smaller than a startDate', async () => {
            const userId = 'foo-user';
            const createTripDto = {
                name: 'Greece trip',
                description: 'From the south to the north',
                startDate: new Date('2025-08-26'),
                endDate: new Date('2025-08-06'),
                status: TripStatus.PLANNED,
                isPublic: true,
                tags: ['greece', 'car'],
                waypoints: [new WaypointFactory.create()],
            };

            await expect(
                controller.create(userId, createTripDto),
            ).rejects.toThrow('endDate must be after startDate');

            expect(mockTripsService.create).not.toHaveBeenCalled();
        });
    });

    describe('PATCH /trips/id', () => {
        it('should update a trip if all params were provided', async () => {
            const userId = 'foo-user';
            const tripId = 'tripdId';
            const updateTripDto = {
                name: 'Updated name',
                description: 'Updated description',
                startDate: new Date('2026-08-26'),
                endDate: new Date('2026-08-06'),
                status: TripStatus.PLANNED,
                isPublic: false,
                tags: ['updated', 'tag'],
                waypoint: [new WaypointFactory.create()],
            };

            mockTripsService.update.mockResolvedValue(updateTripDto);

            const result = await controller.update(tripId, userId);

            expect(result).toEqual(updateTripDto);
            expect(service.update).toHaveBeenCalledWith(tripId, userId);
        });

        it('should return an empty array if no param was given', async () => {
            const userId = 'foo-user';
            const tripId = 'tripId';

            mockTripsService.update.mockResolvedValue([]);

            const result = await controller.update(tripdId, userId);

            expect(result).toEqual([]);
            expect(service.update).toHaveBeenCalledWith(tripId, userId);
        });
    });

    describe('DELETE /trips/id', () => {
        it('should delete a trip if id was provided', async () => {
            const userId = 'foo-user';
            const tripId = 'tripId';

            mockTripsService.delete.mockResolvedValue(true);

            const result = await controller.delete(tripId, userId);

            expect(result).toEqual([]);
            expect(service.delete).toHaveBeenCalledWith(tripId, userId);
        });
    });
});
