import { Controller, Post, Body, HttpCode, HttpStatus, Request, UseGuards, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Public()
    @Post('register')
    async register(@Body() registerDto: any) {
        try {
            return await this.authService.register(registerDto);
        } catch (error: any) {
            console.error(`[AUTH-CONTROLLER-v3] Registration error caught:`, error);
            const status = error instanceof HttpException ? error.getStatus() : (error.status || HttpStatus.INTERNAL_SERVER_ERROR);

            let errorMessage = 'Registration failed';
            if (error.response && error.response.message) {
                errorMessage = Array.isArray(error.response.message) ? error.response.message[0] : error.response.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            const responseBody = {
                message: errorMessage,
                error: (error as any).name || (error instanceof HttpException ? error.constructor.name : 'InternalServerError'),
                statusCode: status,
                timestamp: new Date().toISOString()
            };
            console.log(`[AUTH-CONTROLLER-v3] Explicitly returning error body:`, responseBody);
            throw new HttpException(responseBody, status);
        }
    }

    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: any) {
        return this.authService.login(loginDto);
    }

    @Public()
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refresh(@Body() refreshTokenDto: any) {
        return this.authService.refreshToken(refreshTokenDto.refreshToken);
    }

    @Post('2fa/generate')
    @UseGuards(JwtAuthGuard)
    async generate2FA(@Request() req) {
        return this.authService.generateTwoFactorSecret(req.user);
    }

    @Post('2fa/turn-on')
    @UseGuards(JwtAuthGuard)
    async turnOn2FA(@Request() req, @Body() body: { code: string }) {
        return this.authService.verifyTwoFactorAndEnable(req.user.id, body.code);
    }

    @Public()
    @Post('2fa/authenticate')
    @HttpCode(HttpStatus.OK)
    async authenticate2FA(@Body() body: { userId: string; code: string }) {
        return this.authService.loginWith2FA(body.userId, body.code);
    }
}
