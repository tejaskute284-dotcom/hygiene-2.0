import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Observable } from 'rxjs';

@Injectable()
export class WsJwtGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const client = context.switchToWs().getClient();
            const authHeader = client.handshake.headers.authorization;
            if (!authHeader) {
                throw new WsException('Authorization header not found');
            }

            const token = authHeader.split(' ')[1];
            const payload = await this.jwtService.verifyAsync(token);

            // Attach user to client
            client.user = payload;
            return true;
        } catch (err) {
            throw new WsException('Invalid credentials');
        }
    }
}
