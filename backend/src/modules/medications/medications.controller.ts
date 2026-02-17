import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { MedicationsService } from './medications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('medications')
@UseGuards(JwtAuthGuard)
export class MedicationsController {
    constructor(private readonly medicationsService: MedicationsService) { }

    @Post()
    create(@Request() req, @Body() createDto: any) {
        return this.medicationsService.create(req.user.id, createDto);
    }

    @Get()
    findAll(@Request() req, @Query('active') active?: string) {
        const isActive = active === 'true' ? true : active === 'false' ? false : undefined;
        return this.medicationsService.findAll(req.user.id, isActive);
    }

    @Get(':id')
    findOne(@Request() req, @Param('id') id: string) {
        return this.medicationsService.findOne(id, req.user.id);
    }

    @Patch(':id')
    update(@Request() req, @Param('id') id: string, @Body() updateDto: any) {
        return this.medicationsService.update(id, req.user.id, updateDto);
    }

    @Delete(':id')
    remove(@Request() req, @Param('id') id: string) {
        return this.medicationsService.remove(id, req.user.id);
    }

    @Post('log')
    logMedication(@Request() req, @Body() logDto: any) {
        return this.medicationsService.logMedication(req.user.id, logDto);
    }

    @Get('adherence/rate')
    getAdherenceRate(
        @Request() req,
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
    ) {
        return this.medicationsService.getAdherenceRate(
            req.user.id,
            new Date(startDate),
            new Date(endDate),
        );
    }
}
