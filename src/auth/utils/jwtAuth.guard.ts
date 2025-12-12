import { ExecutionContext, Injectable, UnauthorizedException, NotFoundException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { IS_PUBLIC_KEY } from "./public";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt-strategy") { // the strategy name should be the same as created
    constructor(private reflector: Reflector) {
        super();
    }

    /** validate token */
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        // the the route is public
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass()
        ]);
        if (isPublic) return true;
        
        // if not public, check the token
        return super.canActivate(context);
    }

    /**
     * @description: 验完成后调用
     * @param {*} error 这是 Passport 策略执行过程中发生的任何潜在错误。如果在验证过程中没有错误发生，这个值通常是 null
     * @param {*} user 这是 Passport 策略验证成功后返回的用户对象。如果验证失败，这个值可能是 false 或 null，具体取决于你使用的 Passport 策略
     * @param {*} info 如果验证失败，info通常是一个error对象
     * @Date: 2024-01-02 13:14:47
     * @Author: mulingyuer
     */
    handleRequest(error, user, info) {
        // user info will be added to request, can be access use @Request req   => req.user
        /*
        user: User {
            id: 9,
            user_name: 'beehives',
            password: '08e84c626ca6586fc487e9af975086a69b8bc9d6226d733d7d23bc62cf322755',
            created_utc: 2024-01-17T08:13:01.000Z,
            updated_utc: 2024-01-17T08:13:01.000Z
        },
        */
        if (info || error) throw new UnauthorizedException("token validation failed.");
        if (!user) throw new NotFoundException("User does not exist.");

        // console.log('handle user: ', user);

        return user;
    }
}