import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ValidateUserDto } from './dto/validateUser.dto';
import { CreateUserDto } from './dto/user.dto';
import { Public } from './utils/public';

@Controller('auth')
export class AuthController {
    constructor(private readonly service: AuthService) {}

    @Public()
    @Post('login')
    validateUser(@Body() user: ValidateUserDto){
        return this.service.validateUser(user);
    }

    @Public()
    @Post('register')
    createUser(@Body() user: CreateUserDto) {
        return this.service.createUser(user);
    }

    @Public()
    @Post('get-token')
    createUtilUser(@Body() user: ValidateUserDto) {
        return this.service.getToken(user);
    }

}
