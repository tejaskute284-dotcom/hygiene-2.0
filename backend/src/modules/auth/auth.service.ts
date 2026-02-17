import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../database/entities/user.entity';

import { TwoFactorAuthService } from './two-factor-auth.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
        private twoFactorAuthService: TwoFactorAuthService,
    ) { }

    async register(registerDto: any) {
        const { email, password, firstName, lastName, dateOfBirth } = registerDto;

        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new UnauthorizedException('Email already registered');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = this.userRepository.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            dateOfBirth,
            roles: ['user'],
        });

        await this.userRepository.save(user);
        return this.generateTokens(user);
    }

    async login(loginDto: any) {
        const { email, password } = loginDto;

        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (user.isTwoFactorEnabled) {
            return {
                isTwoFactorRequired: true,
                userId: user.id,
            };
        }

        user.lastLogin = new Date();
        await this.userRepository.save(user);

        return this.generateTokens(user);
    }

    async refreshToken(refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
            });

            const user = await this.userRepository.findOne({
                where: { id: payload.sub as string }
            });

            if (!user) {
                throw new UnauthorizedException('Invalid token');
            }

            return this.generateTokens(user);
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    private generateTokens(user: User) {
        const payload = {
            sub: user.id,
            email: user.email,
            roles: user.roles
        };

        return {
            accessToken: this.jwtService.sign(payload),
            refreshToken: this.jwtService.sign(payload, {
                secret: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
                expiresIn: (process.env.JWT_REFRESH_EXPIRATION || '7d') as any,
            }),
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                roles: user.roles,
            },
        };
    }

    async validateUser(userId: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { id: userId } });
    }

    async generateTwoFactorSecret(user: User) {
        const { secret, otpauthUrl } = this.twoFactorAuthService.generateTwoFactorAuthenticationSecret(user);
        await this.userRepository.update(user.id, { twoFactorSecret: secret });
        return {
            secret,
            otpauthUrl,
            qrCode: await this.twoFactorAuthService.generateQrCodeDataURL(otpauthUrl),
        };
    }

    async verifyTwoFactorAndEnable(userId: string, code: string) {
        const user = await this.validateUser(userId);
        if (!user) throw new UnauthorizedException();

        const isValid = this.twoFactorAuthService.isTwoFactorAuthenticationCodeValid(code, user);
        if (!isValid) throw new UnauthorizedException('Invalid 2FA code');

        await this.userRepository.update(userId, { isTwoFactorEnabled: true });
        return { success: true };
    }

    async loginWith2FA(userId: string, code: string) {
        const user = await this.validateUser(userId);
        if (!user) throw new UnauthorizedException();

        const isValid = this.twoFactorAuthService.isTwoFactorAuthenticationCodeValid(code, user);
        if (!isValid) throw new UnauthorizedException('Invalid 2FA code');

        user.lastLogin = new Date();
        await this.userRepository.save(user);

        return this.generateTokens(user);
    }
}
