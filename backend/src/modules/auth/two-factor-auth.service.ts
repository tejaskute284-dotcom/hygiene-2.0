import { Injectable } from '@nestjs/common';
import { User } from '../../database/entities/user.entity';
import { toDataURL } from 'qrcode';
// Use require for robust interop across ESM/CJS in NestJS environments
// eslint-disable-next-line @typescript-eslint/no-var-requires
const otplib = require('otplib');
const authenticator = otplib.authenticator;

@Injectable()
export class TwoFactorAuthService {
    public generateTwoFactorAuthenticationSecret(user: User) {
        const secret = authenticator.generateSecret();
        const otpauthUrl = authenticator.keyuri(
            user.email,
            'IHMS_SYANPSE_CARE',
            secret,
        );
        return {
            secret,
            otpauthUrl,
        };
    }

    public async generateQrCodeDataURL(otpauthUrl: string) {
        return toDataURL(otpauthUrl);
    }

    public isTwoFactorAuthenticationCodeValid(
        twoFactorAuthenticationCode: string,
        user: User,
    ) {
        if (!user.twoFactorSecret) return false;
        return authenticator.verify({
            token: twoFactorAuthenticationCode,
            secret: user.twoFactorSecret,
        });
    }
}
