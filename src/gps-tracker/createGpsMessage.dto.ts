import { IsDateString, IsDefined, IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateGpsMessageDto {
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    device_id: string;

    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    lat: number;

    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    lng: number;

    @IsDefined()
    @IsInt()
    satellite_num: number;

    @IsDefined()
    @IsNumber()
    hop: number;

    @IsDefined()
    @IsNumber()
    altitude: number;

    @IsDefined()
    @IsNumber()
    battery: number;

    @IsDefined()
    @IsNumber()
    signal_strength: number;

    @IsDefined()
    @IsNotEmpty()
    @IsDateString()
    utc: Date;

}