import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medication } from '../../database/entities/medication.entity';
import { MedicationLog } from '../../database/entities/medication-log.entity';
import { RemindersService } from './reminders.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Medication, MedicationLog]),
        NotificationsModule,
    ],
    providers: [RemindersService],
})
export class RemindersModule { }
