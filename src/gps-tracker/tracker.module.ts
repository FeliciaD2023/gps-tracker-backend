import { Module } from "@nestjs/common";
import { TrackerController } from "./tracker.controller";
import { TrackerService } from "./tracker.service";
// import { AuthService } from "src/auth/auth.service";


@Module({
    controllers: [TrackerController],
    providers: [TrackerService],
})


export class TrackerModule {}