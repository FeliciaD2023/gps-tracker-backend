import { applyDecorators, UseGuards } from "@nestjs/common";
import { JwtLocalAuthGuard } from "./jwtLocalAuth.guard";

export function JwtAuth() {
    return applyDecorators(UseGuards(JwtLocalAuthGuard));
}