import { Body, Controller, Get, Post, Query, Request } from "@nestjs/common";
import { DeviceService } from "./device.service";
import { CreateDeviceDto } from "./dto/createDevice.dto";

@Controller("device")
export class DeviceController {
    constructor(private readonly service: DeviceService) {}

    @Get("get-all-devices") // not in use
    getAllDevices() {
        return this.service.getAllDevices();
    }

    @Get("get-user-devices")
    getUserDevices(@Request() req, @Query('noGps') noGps: string) {
        console.log("req in get-user-devices: ", req.user);
        return this.service.getUserDevices(req.user?.user_id, req.user?.role, noGps == "true" ? true : false);
    }

    @Get("get-user-device-options")
    getUserDeviceOptions(@Request() req) {
        return this.service.getUserDeviceOptions(req.user?.user_id);
    }

    @Post("create-device")
    createDevice(@Body() createDeviceDto: CreateDeviceDto) {
        return this.service.createDevice(createDeviceDto);
    }

    @Post("update-device-name")
    updateDeviceName(@Body() dto: { device_name: string; device_id: string }) {
        return this.service.updateDeviceName(dto.device_name, dto.device_id);
    }
}
