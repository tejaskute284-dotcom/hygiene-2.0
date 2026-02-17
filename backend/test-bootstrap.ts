import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';

async function test() {
    console.log('Starting diagnostic bootstrap...');
    try {
        const app = await NestFactory.create(AppModule, { logger: ['error', 'warn', 'debug', 'verbose'] });
        console.log('App created successfully');
        await app.init();
        console.log('App initialized successfully');
        process.exit(0);
    } catch (err) {
        console.error('FATAL ERROR DURING BOOTSTRAP:');
        console.error(err);
        if (err.stack) {
            console.error(err.stack);
        }
        process.exit(1);
    }
}

test();
