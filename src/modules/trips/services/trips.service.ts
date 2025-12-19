import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip } from './entities/trip.entity';
import { CreateTripDto } from './dto/create-trip.dto';

@Injectable()
export class TripsService {
    contructor(
        @InjectRepository(Trip)
        private tripRepository: Repository<Trip[]> 
    ) {}

    public async findAll(userId: string): Promise<Trip[]> {
        return this.tripRepository.find({
            where: {userId},
            order: {createdAt: 'DESC'}
        })
    }

    public async findOne(id:string, userId: string): Promise<Trip> {
        const trip = await this.tripRepository.findOne({
            where: {id, userId},
        })

        if(!trip) {
            throw new NotFoundException(`Trip with ID ${id} not found`)
        }

        return trip
    }

    public async create(createTripDto: CreateTripDto, userId: string): Promise<Trip> {
        const trip = this.tripRepository.create({
            ...createTripDto,
            userId,
            startDate: new Date(createTripDto.startDate),
            endDate: new Date(createTripDto.endDate)
        })

        return this.tripRepository.save(trip)
    }

    public async update(id: string, updateTripDto: UpdateTripDto, userId: string): Promise<Trip> {
        const trip = await this.findOne(id, userId)

        Object.assign(trip, updateTripDto)// Check why?? 

        if(updateTripDto.startDate) {
            trip.startDate = new Date(updateTripDto.startDate)
        }
        if(updateTripDto.endDate) {
            trip.endDate = new Date(updateTripDto.endDate)
        }

        return this.tripRepository.save(trip)
    }

    public async remove(id: string, userId: string): Promise<void> {
        const trip = await this.findOne(id, userId)
        await this.tripRepository.remove(trip)
    }
}