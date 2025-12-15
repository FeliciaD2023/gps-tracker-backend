import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { CreateUserDto } from './dto/user.dto';
import * as jwt from 'jsonwebtoken';
import { SHA256, AES } from 'crypto-js';
import { User } from './user.entity';
import { ValidateUserDto } from './dto/validateUser.dto';

@Injectable()
export class AuthService {
    constructor (
        private readonly eManager: EntityManager,
    ) {}

    async createUser(createUserDto: CreateUserDto) {
        // const jwtKey = process.env.JWT_SECRET_KEY;
        createUserDto.password = SHA256(createUserDto.password).toString();
        const newUser = new User(createUserDto);
        const result = await this.eManager.save(newUser);
        if(!result.id){
            return {result: 'failed'};
        }

        return {
            result: 'success',
            data: {id: result.id}
        };

    }

    async getToken(user: ValidateUserDto) {
        const result = await this.eManager.findOne(User, {select: {password: true}, where: {user_name: user.user_name}});
        const decodedPwd = SHA256(user.password).toString();

        // console.log(decodedPwd)
        if(decodedPwd !== result.password) {
            throw new UnauthorizedException("User validation failed");
        }

        const token = jwt.sign({user_name: user.user_name}, process.env.JWT_KEY_FOR_MESSAGE_PROCESSER);
        return {
            result: 'success',
            data: {token}
        }

    }

    async validateUser(user: ValidateUserDto) {
        // console.log('user in validateUser: ', user)
        const result = await this.eManager.findOne(User, {where: {user_name: user.user_name}});
        
        // console.log('get user: ', result);
        if(!result) {
            throw new UnauthorizedException("User does not exist");
        }
        
        // validate password
        const decodedPwd = SHA256(user.password).toString();
        // console.log('decoded pwd: ', decodedPwd, result.password, decodedPwd === result.password);

        if(decodedPwd !== result.password) {
            throw new UnauthorizedException("User validation failed");
        }

        // create token
        let payload = JSON.stringify({
            user_name: result.user_name,
            user_role: result.role,
            user_id: result.id
        });

        payload = AES.encrypt(payload, process.env.JWT_PAYLOAD_KEY).toString();

        const token = jwt.sign({user: payload}, process.env.JWT_SECRET_KEY);

        return {
            result: 'success',
            data: {user_name: user.user_name, token}
        }
    }
    


}
