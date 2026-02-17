const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'ihms.sqlite');
const db = new sqlite3.Database(dbPath);

const email = 'tejas@synapse.care';
const password = 'Password123!';
const saltRounds = 10;

async function seed() {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const id = '550e8400-e29b-41d4-a716-446655440000'; // Fixed UUID for testing

    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE,
            password TEXT,
            first_name TEXT,
            last_name TEXT,
            date_of_birth TEXT,
            roles TEXT,
            is_two_factor_enabled BOOLEAN DEFAULT 0,
            two_factor_secret TEXT,
            is_active BOOLEAN DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS medications (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            name TEXT,
            dosage TEXT,
            schedule TEXT,
            inventory TEXT,
            is_active BOOLEAN DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        db.run(`INSERT OR IGNORE INTO users (id, email, password, first_name, last_name, date_of_birth, roles) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [id, email, hashedPassword, 'Tejas', 'Care', '1990-01-01', 'user']);

        const medId = '660e8400-e29b-41d4-a716-446655440001';
        const medDosage = JSON.stringify({ amount: 1, unit: 'pill', form: 'capsule' });
        const medSchedule = JSON.stringify({ frequency: 'daily', times: ['08:00 AM'], startDate: new Date() });
        const medInventory = JSON.stringify({ currentQuantity: 30, refillThreshold: 5, autoRefill: false });

        db.run(`INSERT OR IGNORE INTO medications (id, user_id, name, dosage, schedule, inventory) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [medId, id, 'Vitamin D3', medDosage, medSchedule, medInventory]);

        console.log('✅ Test user and medications seeded.');
        db.close();
    });
}

seed();
