import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailySchedule } from '../../database/entities/daily-schedule.entity';
import { DailyScheduleService } from './daily-schedule.service';
import { DailyScheduleController } from './daily-schedule.controller';

@Module({
    imports: [TypeOrmModule.forFeature([DailySchedule])],
    providers: [DailyScheduleService],
    controllers: [DailyScheduleController],
})
export class DailyScheduleModule { }
