import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Appointment } from '../../database/entities/appointment.entity';

@Injectable()
export class AppointmentsService {
    constructor(
        @InjectRepository(Appointment)
        private appointmentRepository: Repository<Appointment>,
    ) { }

    async create(userId: string, createDto: any) {
        const appointment = this.appointmentRepository.create({
            ...createDto,
            userId,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        return this.appointmentRepository.save(appointment);
    }

    async findAll(userId: string, status?: string) {
        const where: any = { userId };
        if (status) {
            where.status = status;
        }
        return this.appointmentRepository.find({
            where,
            order: { scheduledAt: 'ASC' },
        });
    }

    async findUpcoming(userId: string, limit: number = 5) {
        const now = new Date();
        return this.appointmentRepository.find({
            where: {
                userId,
                scheduledAt: Between(now, new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)),
                status: 'scheduled',
            },
            order: { scheduledAt: 'ASC' },
            take: limit,
        });
    }

    async findOne(id: string, userId: string) {
        const appointment = await this.appointmentRepository.findOne({
            where: { id, userId },
        });
        if (!appointment) {
            throw new NotFoundException('Appointment not found');
        }
        return appointment;
    }

    async update(id: string, userId: string, updateDto: any) {
        const appointment = await this.findOne(id, userId);
        Object.assign(appointment, updateDto, { updatedAt: new Date() });
        return this.appointmentRepository.save(appointment);
    }

    async remove(id: string, userId: string) {
        const appointment = await this.findOne(id, userId);
        await this.appointmentRepository.remove(appointment);
        return { message: 'Appointment deleted successfully' };
    }

    async updateStatus(id: string, userId: string, status: string) {
        const appointment = await this.findOne(id, userId);
        appointment.status = status;
        appointment.updatedAt = new Date();
        return this.appointmentRepository.save(appointment);
    }
}
