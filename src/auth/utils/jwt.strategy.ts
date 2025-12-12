import { Strategy, ExtractJwt } from "passport-jwt";
import type { StrategyOptions } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { EntityManager } from "typeorm";
import { User } from "../user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt-strategy") {
    constructor(
        private readonly eManager: EntityManager,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET_KEY
        } as StrategyOptions);
    }

    /** return user through the token */
    async validate({ user_name }) {
        return await this.eManager.findOne(User, {
            where: {
                user_name
            }
        });
    }
}