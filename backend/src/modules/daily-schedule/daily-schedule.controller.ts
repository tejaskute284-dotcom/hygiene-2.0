import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { DailyScheduleService } from './daily-schedule.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('daily-schedule')
@UseGuards(JwtAuthGuard)
export class DailyScheduleController {
    constructor(private readonly dailyScheduleService: DailyScheduleService) { }

    @Get()
    findAll(@Request() req) {
        return this.dailyScheduleService.findAll(req.user.id);
    }

    @Post()
    create(@Request() req, @Body() data: any) {
        return this.dailyScheduleService.create(req.user.id, data);
    }

    @Patch(':id')
    update(@Request() req, @Param('id') id: string, @Body() data: any) {
        return this.dailyScheduleService.update(req.user.id, id, data);
    }

    @Delete(':id')
    remove(@Request() req, @Param('id') id: string) {
        return this.dailyScheduleService.remove(req.user.id, id);
    }
}
