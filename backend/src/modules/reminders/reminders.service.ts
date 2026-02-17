import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Medication } from '../../database/entities/medication.entity';
import { MedicationLog } from '../../database/entities/medication-log.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class RemindersService {
    private readonly logger = new Logger(RemindersService.name);

    constructor(
        @InjectRepository(Medication)
        private medicationRepository: Repository<Medication>,
        @InjectRepository(MedicationLog)
        private medicationLogRepository: Repository<MedicationLog>,
        private notificationsService: NotificationsService,
    ) { }

    @Cron(CronExpression.EVERY_MINUTE)
    async checkReminders() {
        const now = new Date();
        const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60000);

        const medications = await this.medicationRepository.find({
            where: { isActive: true },
        });

        for (const medication of medications) {
            if (!medication.schedule || !medication.schedule.times) continue;

            for (const time of medication.schedule.times) {
                const [hours, minutes] = time.split(':').map(Number);
                const scheduledTime = new Date(now);
                scheduledTime.setHours(hours, minutes, 0, 0);

                if (scheduledTime >= now && scheduledTime <= fiveMinutesFromNow) {
                    await this.sendReminder(medication, scheduledTime);
                }
            }
        }
    }

    async sendReminder(medication: Medication, scheduledTime: Date) {
        const existingLog = await this.medicationLogRepository.findOne({
            where: { medicationId: medication.id, scheduledTime },
        });

        if (existingLog) return;

        const log = this.medicationLogRepository.create({
            medicationId: medication.id,
            userId: medication.userId,
            scheduledTime,
            status: 'pending',
        });

        await this.medicationLogRepository.save(log);
        await this.notificationsService.sendMedicationReminder({
            userId: medication.userId,
            medication,
            scheduledTime,
        });

        this.logger.log(`Reminder sent for ${medication.name} scheduled at ${scheduledTime.toISOString()}`);
    }

    @OnEvent('medication.taken')
    handleMedicationTaken(payload: any) {
        this.logger.log(`Medication taken: ${payload.medication.name}, clearing any alerts.`);
    }
}
