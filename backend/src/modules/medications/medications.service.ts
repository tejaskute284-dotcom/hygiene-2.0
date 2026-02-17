import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Medication } from '../../database/entities/medication.entity';
import { MedicationLog } from '../../database/entities/medication-log.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class MedicationsService {
    constructor(
        @InjectRepository(Medication)
        private medicationRepository: Repository<Medication>,
        @InjectRepository(MedicationLog)
        private medicationLogRepository: Repository<MedicationLog>,
        private eventEmitter: EventEmitter2,
    ) { }

    async create(userId: string, createDto: any) {
        const medication = this.medicationRepository.create({
            ...createDto,
            userId,
        });

        const saved = await this.medicationRepository.save(medication);
        this.eventEmitter.emit('medication.created', { medication: saved });
        return saved;
    }

    async findAll(userId: string, isActive?: boolean) {
        const where: any = { userId };
        if (isActive !== undefined) {
            where.isActive = isActive;
        }

        return this.medicationRepository.find({
            where,
            order: { createdAt: 'DESC' }
        });
    }

    async findOne(id: string, userId: string) {
        const medication = await this.medicationRepository.findOne({
            where: { id, userId },
        });

        if (!medication) {
            throw new NotFoundException('Medication not found');
        }

        return medication;
    }

    async update(id: string, userId: string, updateDto: any) {
        const medication = await this.findOne(id, userId);

        Object.assign(medication, updateDto);
        const updated = await this.medicationRepository.save(medication);
        this.eventEmitter.emit('medication.updated', { medication: updated });
        return updated;
    }

    async remove(id: string, userId: string) {
        const medication = await this.findOne(id, userId);
        medication.isActive = false;
        return this.medicationRepository.save(medication);
    }

    async logMedication(userId: string, logDto: any) {
        const medication = await this.findOne(logDto.medicationId, userId);

        const log = this.medicationLogRepository.create({
            medicationId: medication.id,
            userId,
            scheduledTime: logDto.scheduledTime,
            takenAt: new Date(),
            status: 'taken',
            confirmationMethod: logDto.confirmationMethod || 'manual',
            notes: logDto.notes,
            sideEffectsReported: logDto.sideEffectsReported,
        });

        const saved = await this.medicationLogRepository.save(log);

        if (medication.inventory.currentQuantity > 0) {
            medication.inventory.currentQuantity -= medication.dosage.amount;
            await this.medicationRepository.save(medication);
        }

        this.eventEmitter.emit('medication.taken', {
            log: saved,
            medication,
            userId
        });

        return saved;
    }

    async getAdherenceRate(userId: string, startDate: Date, endDate: Date) {
        const logs = await this.medicationLogRepository.find({
            where: {
                userId,
                scheduledTime: Between(startDate, endDate),
            },
        });

        const total = logs.length;
        const taken = logs.filter(log => log.status === 'taken').length;

        return {
            total,
            taken,
            missed: total - taken,
            adherenceRate: total > 0 ? (taken / total) * 100 : 0,
        };
    }
}
