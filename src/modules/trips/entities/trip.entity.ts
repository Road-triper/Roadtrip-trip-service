import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

export enum TripStatus {
    Completed = 'Completed',
    Planned = 'Planned',
    Draft = 'Draft',
    In_progress = 'In progress',
    Canceled = 'Canceled',
}

/**
 * Example of class initializing : const trip = new Trip({userId: 'user-456'});
 *
 * */
@Entity('trips')
export class Trip {
    @PrimaryGeneratedColumn('uuid')
    public readonly id: string; //ToDo: think about using UUID type. Check also if PrimaryGeneratedColumn validates input

    @Column()
    public userId: string; // from auth service

    @Column()
    public name: string;

    @Column({ nullable: true })
    public description: string;

    @Column({ nullable: true, type: 'date' })
    public startDate: Date;

    @Column({ nullable: true, type: 'date' })
    public endDate: Date;

    @Column({
        type: 'enum',
        enum: TripStatus,
        default: TripStatus.Draft,
    })
    public status: TripStatus;

    @Column({ type: 'bool', default: false })
    public isPublic: boolean;

    @Column('simple-array', { nullable: true })
    public tags: string[];

    // (waypoint) => waypoint.trip Specifies which property in Waypoint points back to Trip, Tells TypeORM: "Each waypoint has a 'trip' property that references this Trip"
    @OneToMany(() => Waypoint, (waypoint) => waypoint.trip, {
        cascade: true, // Automatically save waypoints when saving trip. Means: "When I save/update/remove a Trip, also save/update/remove its waypoints"
        eager: true, // Automatically load waypoints when loading trip
    })
    public waypoints: Waypoint[] = [];

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    constructor(partial?: Partial<Trip>) {
        Object.assign(this, partial);
    }
}
