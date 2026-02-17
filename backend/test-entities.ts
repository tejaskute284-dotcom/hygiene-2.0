console.log('Testing entity imports...');
try {
    console.log('Importing User...');
    require('./src/database/entities/user.entity');
    console.log('User OK');

    console.log('Importing Medication...');
    require('./src/database/entities/medication.entity');
    console.log('Medication OK');

    console.log('Importing MedicationLog...');
    require('./src/database/entities/medication-log.entity');
    console.log('MedicationLog OK');

    console.log('Importing Appointment...');
    require('./src/database/entities/appointment.entity');
    console.log('Appointment OK');

    console.log('Importing CareRelationship...');
    require('./src/database/entities/care-relationship.entity');
    console.log('CareRelationship OK');

    console.log('All entities imported successfully');
} catch (err) {
    console.error('Crashed during import:');
    console.error(err);
}
