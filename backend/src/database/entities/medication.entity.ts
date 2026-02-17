import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import type { User } from './user.entity';

@Entity('medications')
export class Medication {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id' })
    userId: string;

    @ManyToOne('User', (user: User) => user.medications)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column()
    name: string;

    @Column({ nullable: true, name: 'generic_name' })
    genericName: string;

    @Column({ nullable: true })
    ndc: string;

    @Column({ type: 'simple-json' })
    dosage: {
        amount: number;
        unit: string;
        form: string;
    };

    @Column({ type: 'simple-json', name: 'visual_identification', nullable: true })
    visualIdentification: {
        shape: string;
        color: string;
        imprint: string;
        imageUrl?: string;
    };

    @Column({ type: 'simple-json' })
    schedule: {
        frequency: string;
        times: string[];
        mealRelation?: 'before' | 'with' | 'after';
        startDate: Date;
        endDate?: Date;
    };

    @Column({ type: 'simple-json', nullable: true })
    inventory: {
        currentQuantity: number;
        refillThreshold: number;
        autoRefill: boolean;
    };

    @Column({ type: 'simple-json', nullable: true })
    prescriber: {
        name: string;
        phone: string;
        npi?: string;
    };

    @Column({ type: 'simple-json', nullable: true })
    pharmacy: {
        name: string;
        phone: string;
        rxNumber: string;
    };

    @Column({ type: 'simple-array', default: '' })
    interactions: string[];

    @Column({ type: 'simple-array', default: '' })
    sideEffects: string[];

    @Column({ type: 'text', nullable: true })
    instructions: string;

    @Column({ default: true, name: 'is_active' })
    isActive: boolean;

    @Column({ default: false, name: 'is_critical' })
    isCritical: boolean;

    @Column({ name: 'created_at', nullable: true })
    createdAt: Date;

    @Column({ name: 'updated_at', nullable: true })
    updatedAt: Date;
}
