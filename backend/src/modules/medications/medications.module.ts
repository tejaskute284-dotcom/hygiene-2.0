import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medication } from '../../database/entities/medication.entity';
import { MedicationLog } from '../../database/entities/medication-log.entity';
import { MedicationsService } from './medications.service';
import { MedicationsController } from './medications.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Medication, MedicationLog])],
    providers: [MedicationsService],
    controllers: [MedicationsController],
    exports: [MedicationsService],
})
export class MedicationsModule { }
