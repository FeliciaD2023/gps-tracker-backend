import { Strategy, ExtractJwt } from "passport-jwt";
import type { StrategyOptions } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { EntityManager } from "typeorm";
import { User } from "../user.entity";
import { AES, enc } from 'crypto-js';

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
    async validate(payload) {
        // console.log('token payloadin validate: ', payload);

        try {
            const decrypted = AES.decrypt(payload?.user, process.env.JWT_PAYLOAD_KEY).toString(enc.Utf8);
            // console.log('decrypted token: ', decrypted);
            const decodedPayload = JSON.parse(decrypted);
            if(!decodedPayload?.user_id) {
                throw new Error();
            }

            const userInfo =  await this.eManager.findOne(User, {
                where: {
                    id: decodedPayload.user_id
                }
            });

            return {
                user_id: userInfo.id,
                user_name: userInfo.user_name,
                role: userInfo.role
            };
        } catch (error) {
            console.log('err in validate: ', error);
            throw new Error('Required user information missing in JWT payload');
        }
    }
}