import { ExecutionContext, Injectable, UnauthorizedException, NotFoundException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";

@Injectable()
export class JwtLocalAuthGuard extends AuthGuard("jwt-local-strategy") { // the strategy name should be the same as created
    constructor(private reflector: Reflector) {
        super();
    }

    /** validate token */
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        // the the route is public
        const isPublic = this.reflector.getAllAndOverride<boolean>(true, [
            context.getHandler(),
            context.getClass()
        ]);
        if (isPublic) return true;
        
        // if not public, check the token
        return super.canActivate(context);
    }

    handleRequest(error, user, info) {

        // the user is the one retrieved in validate() in stragety 
        if (info || error) throw new UnauthorizedException("token validation failed.");
        if (!user) throw new NotFoundException("User does not exist.");

        // console.log('handle user: ', user);

        return user;
    }
}