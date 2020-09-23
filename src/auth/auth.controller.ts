import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { AccessTokenDto } from './dto/access-token.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
    ) {}

    @Post('/signup')
    public async signUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.authService.signUp(authCredentialsDto);
    }

    @Post('/signin')
    public async signIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<AccessTokenDto> {
        return this.authService.signIn(authCredentialsDto);
    }
}
