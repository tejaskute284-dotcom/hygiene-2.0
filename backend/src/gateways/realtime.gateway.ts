import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '../modules/auth/guards/ws-jwt.guard';
import { OnEvent } from '@nestjs/event-emitter';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    async handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    @OnEvent('medication.taken')
    handleMedicationTaken(payload: any) {
        this.server.emit('medication_event', {
            type: 'TAKEN',
            ...payload
        });
    }

    @OnEvent('medication.missed')
    handleMedicationMissed(payload: any) {
        this.server.emit('medication_event', {
            type: 'MISSED',
            ...payload
        });
    }
}
