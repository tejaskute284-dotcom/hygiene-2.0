import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
    constructor(private readonly appointmentsService: AppointmentsService) { }

    @Post()
    create(@Request() req, @Body() createDto: any) {
        return this.appointmentsService.create(req.user.id, createDto);
    }

    @Get()
    findAll(@Request() req, @Query('status') status?: string) {
        return this.appointmentsService.findAll(req.user.id, status);
    }

    @Get('upcoming')
    findUpcoming(@Request() req, @Query('limit') limit?: string) {
        const limitNum = limit ? parseInt(limit, 10) : 5;
        return this.appointmentsService.findUpcoming(req.user.id, limitNum);
    }

    @Get(':id')
    findOne(@Request() req, @Param('id') id: string) {
        return this.appointmentsService.findOne(id, req.user.id);
    }

    @Patch(':id')
    update(@Request() req, @Param('id') id: string, @Body() updateDto: any) {
        return this.appointmentsService.update(id, req.user.id, updateDto);
    }

    @Patch(':id/status')
    updateStatus(@Request() req, @Param('id') id: string, @Body() body: { status: string }) {
        return this.appointmentsService.updateStatus(id, req.user.id, body.status);
    }

    @Delete(':id')
    remove(@Request() req, @Param('id') id: string) {
        return this.appointmentsService.remove(id, req.user.id);
    }
}
