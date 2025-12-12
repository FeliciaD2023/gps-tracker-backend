import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";

@Entity()
@Unique(['user_name'])
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_name: string;

    @Column()
    password: string;

    @CreateDateColumn({type: 'timestamp with time zone', precision: 0})
    created_utc: Date;

    @UpdateDateColumn({type: 'timestamp with time zone', precision: 0})
    updated_utc: Date;

    constructor(userObj: Partial<User>) {
        Object.assign(this, userObj);
    }
}