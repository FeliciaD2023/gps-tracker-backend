import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";

@Entity()
export class GpsMessage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    device_id: string;

    @Column({type:'float', scale: 6})
    lat: number;

    @Column({type:'float', scale: 6})
    lng: number;

    @Column({nullable: true})
    satellite_num: number;

    @Column({type:'float', scale: 3, nullable: true})
    hop: number;

    @Column({type:'float', scale: 3, nullable: true})
    altitude: number;

    @Column({type:'float', scale: 2, nullable: true})
    battery: number;

    @Column({nullable: true})
    signal_strength: number;

    @Column({type:'float', scale: 3, nullable: true})
    speed: number;

    @Column({type: 'timestamp with time zone', precision: 0, nullable: true})
    utc: Date;
	
	@CreateDateColumn({type: 'timestamp with time zone', precision: 0})
    received_utc: Date;

    constructor(gpsMessageObj: Partial<GpsMessage>) {
        Object.assign(this,gpsMessageObj);
    }
}