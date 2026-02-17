import { DataSource } from 'typeorm';
import { User } from './src/database/entities/user.entity';
import { Medication } from './src/database/entities/medication.entity';
import { MedicationLog } from './src/database/entities/medication-log.entity';
import { Appointment } from './src/database/entities/appointment.entity';
import { CareRelationship } from './src/database/entities/care-relationship.entity';

async function test() {
    console.log('Connecting to DataSource with all entities...');
    const AppDataSource = new DataSource({
        type: 'sqlite',
        database: 'data/ihms-test.sqlite',
        entities: [User, Medication, MedicationLog, Appointment, CareRelationship],
        synchronize: true,
        logging: ['query', 'error'],
    });

    try {
        await AppDataSource.initialize();
        console.log('DataSource initialized successfully');
        process.exit(0);
    } catch (err) {
        console.error('TypeORM Initialization Error:');
        console.log('Error Name:', err.name);
        console.log('Error Message:', err.message);
        if (err.query) console.log('Failed Query:', err.query);
        if (err.parameters) console.log('Parameters:', err.parameters);
        // Do NOT stringify the whole thing if it's too big, just the important parts
        process.exit(1);
    }
}

test();
