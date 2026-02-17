import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DailySchedule } from '../../database/entities/daily-schedule.entity';

@Injectable()
export class DailyScheduleService {
    constructor(
        @InjectRepository(DailySchedule)
        private dailyScheduleRepository: Repository<DailySchedule>,
    ) { }

    async findAll(userId: string): Promise<DailySchedule[]> {
        return this.dailyScheduleRepository.find({
            where: { userId },
            order: { time: 'ASC' },
        });
    }

    async create(userId: string, data: Partial<DailySchedule>): Promise<DailySchedule> {
        const item = this.dailyScheduleRepository.create({
            ...data,
            userId,
        });
        return this.dailyScheduleRepository.save(item);
    }

    async update(userId: string, id: string, data: Partial<DailySchedule>): Promise<DailySchedule> {
        const item = await this.dailyScheduleRepository.findOne({ where: { id, userId } });
        if (!item) throw new NotFoundException('Daily schedule item not found');

        Object.assign(item, data);
        return this.dailyScheduleRepository.save(item);
    }

    async remove(userId: string, id: string): Promise<void> {
        const item = await this.dailyScheduleRepository.findOne({ where: { id, userId } });
        if (!item) throw new NotFoundException('Daily schedule item not found');

        await this.dailyScheduleRepository.remove(item);
    }
}
