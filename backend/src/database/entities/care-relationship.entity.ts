import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import type { User } from './user.entity';

@Entity('care_relationships')
export class CareRelationship {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'patient_id' })
    patientId: string;

    @ManyToOne('User')
    @JoinColumn({ name: 'patient_id' })
    patient: User;

    @Column({ name: 'caregiver_id' })
    caregiverId: string;

    @ManyToOne('User')
    @JoinColumn({ name: 'caregiver_id' })
    caregiver: User;

    @Column({ type: 'text' })
    relationship: string;

    @Column({ type: 'simple-json' })
    permissions: {
        viewMedications: boolean;
        manageMedications: boolean;
        viewAppointments: boolean;
        manageAppointments: boolean;
        viewHealthData: boolean;
        receiveAlerts: boolean;
        emergencyContact: boolean;
    };

    @Column({ type: 'text', default: 'pending' })
    status: string;

    @Column({ name: 'invited_at', nullable: true })
    invitedAt: Date;

    @Column({ nullable: true, name: 'accepted_at' })
    acceptedAt: Date;

    @Column({ name: 'created_at', nullable: true })
    createdAt: Date;
}
