import { IsDateString, IsDefined, IsNotEmpty, IsString } from "class-validator";

export class CreateDeviceDto {
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    device_id: string;

    @IsString()
    device_name: string;

    @IsString()
    user: string;

    @IsDateString()
    last_report: Date;

}