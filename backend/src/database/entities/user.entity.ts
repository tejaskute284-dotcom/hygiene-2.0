import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import type { Medication } from './medication.entity';
import type { Appointment } from './appointment.entity';
import type { DailySchedule } from './daily-schedule.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    phone: string;

    @Column()
    @Exclude()
    password: string;

    @Column({ name: 'first_name', nullable: true })
    firstName: string;

    @Column({ name: 'last_name', nullable: true })
    lastName: string;

    @Column({ name: 'date_of_birth', nullable: true })
    dateOfBirth: Date;

    @Column({ nullable: true, name: 'profile_photo' })
    profilePhoto: string;

    @Column({ default: 'en', name: 'language_preference' })
    languagePreference: string;

    @Column({ default: 'America/New_York' })
    timezone: string;

    @Column({ default: 'standard', name: 'ui_mode' })
    uiMode: string;

    @Column({ type: 'simple-json', nullable: true })
    preferences: any;

    @Column({ type: 'simple-array', default: 'user' })
    roles: string[];

    @Column({ default: false, name: 'is_two_factor_enabled' })
    isTwoFactorEnabled: boolean;

    @Column({ nullable: true, name: 'two_factor_secret' })
    @Exclude()
    twoFactorSecret: string;

    @Column({ default: true, name: 'is_active' })
    isActive: boolean;

    @Column({ nullable: true, name: 'last_login' })
    lastLogin: Date;

    @Column({ name: 'created_at', nullable: true })
    createdAt: Date;

    @Column({ name: 'updated_at', nullable: true })
    updatedAt: Date;

    @OneToMany('Medication', (medication: Medication) => medication.user)
    medications: Medication[];

    @OneToMany('Appointment', (appointment: Appointment) => appointment.user)
    appointments: Appointment[];

    @OneToMany('DailySchedule', (dailySchedule: DailySchedule) => dailySchedule.user)
    dailySchedules: DailySchedule[];
}
