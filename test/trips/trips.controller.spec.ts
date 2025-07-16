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

    
});
