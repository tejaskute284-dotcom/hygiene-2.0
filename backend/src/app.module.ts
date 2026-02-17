import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { join } from 'path';

// Entities
import { User } from './database/entities/user.entity';
import { Medication } from './database/entities/medication.entity';
import { MedicationLog } from './database/entities/medication-log.entity';
import { Appointment } from './database/entities/appointment.entity';
import { CareRelationship } from './database/entities/care-relationship.entity';
import { DailySchedule } from './database/entities/daily-schedule.entity';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { MedicationsModule } from './modules/medications/medications.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { UsersModule } from './modules/users/users.module';
import { RemindersModule } from './modules/reminders/reminders.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { DailyScheduleModule } from './modules/daily-schedule/daily-schedule.module';
import { RealtimeGateway } from './gateways/realtime.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'sqlite',
        database: join(process.cwd(), 'data', 'ihms.sqlite'),
        entities: [User, Medication, MedicationLog, Appointment, CareRelationship, DailySchedule],
        synchronize: true,
        logging: false,
      }),
    }),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    AuthModule,
    UsersModule,
    MedicationsModule,
    AppointmentsModule,
    RemindersModule,
    NotificationsModule,
    DailyScheduleModule,
  ],
  providers: [RealtimeGateway],
})
export class AppModule { }
