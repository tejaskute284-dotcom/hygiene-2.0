import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../../database/entities/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TwoFactorAuthService } from './two-factor-auth.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        PassportModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>('JWT_SECRET') || 'secret',
                signOptions: { expiresIn: '12h' },
            }),
        }),
    ],
    providers: [AuthService, JwtStrategy, TwoFactorAuthService],
    controllers: [AuthController],
    exports: [AuthService, TwoFactorAuthService, JwtModule],
})
export class AuthModule { }
