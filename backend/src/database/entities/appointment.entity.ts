import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import type { User } from './user.entity';

@Entity('appointments')
export class Appointment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id' })
    userId: string;

    @ManyToOne('User', (user: User) => user.appointments)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'text' })
    type: string;

    @Column({ type: 'simple-json' })
    provider: {
        name: string;
        specialty: string;
        phone: string;
        address: {
            street: string;
            city: string;
            state: string;
            zip: string;
        };
        npi?: string;
    };

    @Column({ name: 'scheduled_at' })
    scheduledAt: Date;

    @Column({ type: 'int' })
    duration: number;

    @Column({ type: 'text', default: 'scheduled' })
    status: string;

    @Column({ type: 'simple-json', nullable: true })
    preparation: {
        checklist: Array<{ task: string; completed: boolean }>;
        documentsNeeded: string[];
        fasting?: boolean;
    };

    @Column({ type: 'text', nullable: true })
    notes: string;

    @Column({ type: 'int', nullable: true, name: 'travel_time' })
    travelTime: number;

    @Column({ nullable: true, name: 'video_conference_url' })
    videoConferenceUrl: string;

    @Column({ name: 'created_at', nullable: true })
    createdAt: Date;

    @Column({ name: 'updated_at', nullable: true })
    updatedAt: Date;
}
