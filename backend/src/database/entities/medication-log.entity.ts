import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import type { User } from './user.entity';
import type { Medication } from './medication.entity';

@Entity('medication_logs')
@Index(['userId', 'scheduledTime'])
export class MedicationLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'medication_id' })
    medicationId: string;

    @ManyToOne('Medication')
    @JoinColumn({ name: 'medication_id' })
    medication: Medication;

    @Column({ name: 'user_id' })
    userId: string;

    @ManyToOne('User')
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'scheduled_time' })
    scheduledTime: Date;

    @Column({ nullable: true, name: 'taken_at' })
    takenAt: Date;

    @Column({ type: 'text', default: 'pending' })
    status: string;

    @Column({ type: 'text', default: 'manual', name: 'confirmation_method' })
    confirmationMethod: string;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @Column({ type: 'simple-array', nullable: true, name: 'side_effects_reported' })
    sideEffectsReported: string[];

    @Column({ name: 'created_at', nullable: true })
    createdAt: Date;
}
