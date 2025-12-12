import { IsDefined, IsNotEmpty, IsString } from "class-validator";

export class ValidateUserDto {
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    user_name: string;

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    password: string;
}