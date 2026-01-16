import { Body, Controller, HttpCode, HttpStatus, Inject, Post, UnauthorizedException } from '@nestjs/common';
import { AuthenticateUserUseCase } from '../../2-application/use-cases/authenticate-user.usecase';
import { InvalidCredentialsError } from '../../1-domain/errors/invalid-credentials.error';
import { LoginRequestDto } from '../api-dto/login-request.dto';
import { LoginUserDto } from '../../2-application/dto/login-user.dto';
import { AUTH_TOKENS } from '../../4-infrastructure/di/auth.tokens';

@Controller('auth')
export class AuthenticationController {
    constructor(
        @Inject(AUTH_TOKENS.AUTHENTICATE_USER_USECASE)
        private readonly authenticateUserUseCase: AuthenticateUserUseCase,
    ) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginRequestDto) {
        try {
            const dto = new LoginUserDto(loginDto.email, loginDto.password);
            const result = await this.authenticateUserUseCase.execute(dto);
            return result;
        } catch (error) {
            if (error instanceof InvalidCredentialsError) {
                throw new UnauthorizedException(error.message);
            }
            throw error;
        }
    }
}
