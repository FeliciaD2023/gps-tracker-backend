import { Strategy, ExtractJwt } from "passport-jwt";
import type { StrategyOptions } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { EntityManager } from "typeorm";
import { User } from "../../user.entity";

@Injectable()
export class JwtLocalStrategy extends PassportStrategy(Strategy, "jwt-local-strategy") {
    constructor(
        private readonly eManager: EntityManager,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_KEY_FOR_MESSAGE_PROCESSER
        } as StrategyOptions);
    }

    /** return user through the token */
    async validate({ user_name }) {
        const result =  await this.eManager.findOne(User, {
            select: {
                user_name
            },
            where: {
                user_name
            }
        });

        console.log(result);

        if(result.user_name === 'MessageProcesserUser') {
            return result;
        }else{
            return;
        }
    }
}