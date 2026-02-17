import { Controller, Post, Body, HttpCode, HttpStatus, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Public()
    @Post('register')
    async register(@Body() registerDto: any) {
        return this.authService.register(registerDto);
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
