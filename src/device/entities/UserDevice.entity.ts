import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['device_id', 'user_name'])
export class UserDevice {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    device_id: string;

    @Column({nullable: true})
    user_name: string;

    @Column({default: true})
    is_valid: boolean;

    @CreateDateColumn({type: 'timestamp with time zone', precision: 0})
    created_utc: Date;

    constructor(userDeviceObj: Partial<UserDevice>) {
        Object.assign(this, userDeviceObj);
    }
}