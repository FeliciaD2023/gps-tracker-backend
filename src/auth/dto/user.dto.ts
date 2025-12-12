import { IsDefined, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    user_name: string;

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    password: string;

    created_utc: Date;
    updated_utc: Date;
}