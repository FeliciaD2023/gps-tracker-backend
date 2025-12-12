import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";

@Entity()
@Unique(['device_id'])
export class Device {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    device_id: string;

    @Column({nullable: true})
    user: string;

    @Column({nullable: true})
    device_name: string;

    @Column({type: 'timestamp with time zone', precision: 0, nullable: true})
    last_report: Date;

    @CreateDateColumn({type: 'timestamp with time zone', precision: 0})
    created_utc: Date;

    @UpdateDateColumn({type: 'timestamp with time zone', precision: 0})
    updated_utc: Date;

    constructor(deviceObj: Partial<Device>) {
        Object.assign(this, deviceObj);
    }
}