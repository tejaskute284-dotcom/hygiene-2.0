import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import type { User } from './user.entity';

@Entity('daily_schedules')
export class DailySchedule {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id' })
    userId: string;

    @ManyToOne('User', (user: User) => user.dailySchedules)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'text' })
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column()
    time: string;

    @Column({ type: 'boolean', default: false, name: 'is_completed' })
    isCompleted: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
