import { Body, Controller, Get, Request, Post, UseGuards } from "@nestjs/common";
import { TrackerService } from "./tracker.service";
import { CreateGpsMessageDto } from "./createGpsMessage.dto";
import { Public } from "src/auth/utils/public";
import { JwtLocalAuthGuard } from "src/auth/utils/local_auth/jwtLocalAuth.guard";

type GetNewMessages = {
    device_id: string,
    last_time?: string,
    desc?: boolean
}


@Controller('tracking')
export class TrackerController {
    constructor(private readonly service: TrackerService) {}

    @Post('get-new-messages')
    getNewMessages(@Body() params: GetNewMessages) {
        return this.service.getNewMessages(params.device_id, params.last_time, params.desc);
    }

    @Post('get-new-messages-multiple')
    getNewMessagesMultiple(@Request() req, @Body() params: {last_time?: string}){
        return this.service.getNewMessagesMultiple(req.user.user_id, params.last_time);
    }

    @Public()
    @UseGuards(JwtLocalAuthGuard)
    @Post('create-new-message')
    CreateNewMessage(@Body() createMessageDto: CreateGpsMessageDto) {
        return this.service.createNewMessage(createMessageDto);
    }


}