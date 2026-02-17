import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import sgMail from '@sendgrid/mail';

@Injectable()
export class NotificationsService {
    constructor(private configService: ConfigService) {
        const projectId = this.configService.get('FIREBASE_PROJECT_ID');
        if (projectId && projectId !== 'your-project-id') {
            try {
                admin.initializeApp({
                    credential: admin.credential.cert({
                        projectId: projectId,
                        privateKey: this.configService.get('FIREBASE_PRIVATE_KEY'),
                        clientEmail: this.configService.get('FIREBASE_CLIENT_EMAIL'),
                    } as any),
                });
            } catch (error) {
                console.error('Failed to initialize Firebase Admin:', error.message);
            }
        }

        const sendgridApiKey = this.configService.get<string>('SENDGRID_API_KEY');
        if (sendgridApiKey && sendgridApiKey !== 'SG.your_api_key') {
            try {
                sgMail.setApiKey(sendgridApiKey);
            } catch (error) {
                console.error('Failed to initialize SendGrid:', error.message);
            }
        }
    }

    async sendPushNotification(payload: any) {
        console.log('Sending push notification (Simulated):', payload.title);
        // Real implementation would use admin.messaging().send()
    }

    async sendSMS(phoneNumber: string, message: string) {
        console.log(`Sending SMS to ${phoneNumber} (Simulated): ${message}`);
        // Real implementation would use twilioClient.messages.create()
    }

    async sendEmail(payload: any) {
        console.log(`Sending Email to ${payload.to} (Simulated): ${payload.subject}`);
        // Real implementation would use sgMail.send()
    }

    async sendMedicationReminder(payload: { userId: string, medication: any, scheduledTime: Date }) {
        const { medication } = payload;
        await this.sendPushNotification({
            userId: payload.userId,
            title: 'Medication Reminder',
            body: `Time to take ${medication.name} (${medication.dosage.amount} ${medication.dosage.unit})`,
        });
    }

    async sendCriticalMissedAlert(payload: { userId: string, medication: any, scheduledTime: Date }) {
        await this.sendPushNotification({
            userId: payload.userId,
            title: '🚨 CRITICAL: Missed Medication',
            body: `You missed your ${payload.medication.name}. Please take it now.`,
        });
    }
}
