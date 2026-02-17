import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { AuthModule } from './src/modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: ':memory:',
            autoLoadEntities: true,
            synchronize: true,
        }),
        AuthModule,
    ],
})
class TestModule { }

async function test() {
    console.log('Bootstrapping TestModule (Auth)...');
    try {
        const app = await NestFactory.create(TestModule);
        console.log('Auth initialized successfully');
        process.exit(0);
    } catch (err) {
        console.error('CRASH IN AUTH:');
        console.error(err);
        process.exit(1);
    }
}

test();
