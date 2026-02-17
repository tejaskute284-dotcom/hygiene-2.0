import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async findById(id: string) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const { password, twoFactorSecret, ...result } = user;
        return result;
    }

    async updateProfile(id: string, updateDto: any) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Don't allow password updates through this endpoint
        const { password, twoFactorSecret, ...safeUpdates } = updateDto;

        Object.assign(user, safeUpdates, { updatedAt: new Date() });
        await this.userRepository.save(user);

        const { password: _, twoFactorSecret: __, ...result } = user;
        return result;
    }

    async updateSettings(id: string, settings: any) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Update specific settings
        if (settings.languagePreference !== undefined) {
            user.languagePreference = settings.languagePreference;
        }
        if (settings.timezone !== undefined) {
            user.timezone = settings.timezone;
        }
        if (settings.uiMode !== undefined) {
            user.uiMode = settings.uiMode;
        }
        if (settings.isTwoFactorEnabled !== undefined) {
            user.isTwoFactorEnabled = settings.isTwoFactorEnabled;
        }
        if (settings.preferences !== undefined) {
            user.preferences = { ...user.preferences, ...settings.preferences };
        }

        user.updatedAt = new Date();
        await this.userRepository.save(user);

        const { password, twoFactorSecret, ...result } = user;
        return result;
    }

    async changePassword(id: string, currentPassword: string, newPassword: string) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new Error('Current password is incorrect');
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.updatedAt = new Date();
        await this.userRepository.save(user);

        return { message: 'Password updated successfully' };
    }

    async deleteAccount(id: string) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        await this.userRepository.remove(user);
        return { message: 'Account deleted successfully' };
    }
}
