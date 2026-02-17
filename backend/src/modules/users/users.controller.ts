import { Controller, Get, Patch, Body, Delete, UseGuards, Request, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('profile')
    getProfile(@Request() req) {
        return this.usersService.findById(req.user.id);
    }

    @Patch('profile')
    updateProfile(@Request() req, @Body() updateDto: any) {
        return this.usersService.updateProfile(req.user.id, updateDto);
    }

    @Patch('settings')
    updateSettings(@Request() req, @Body() settings: any) {
        return this.usersService.updateSettings(req.user.id, settings);
    }

    @Post('change-password')
    changePassword(
        @Request() req,
        @Body() body: { currentPassword: string; newPassword: string },
    ) {
        return this.usersService.changePassword(
            req.user.id,
            body.currentPassword,
            body.newPassword,
        );
    }

    @Delete('account')
    deleteAccount(@Request() req) {
        return this.usersService.deleteAccount(req.user.id);
    }
}
