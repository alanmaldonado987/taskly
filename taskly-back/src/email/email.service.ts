import { Injectable, Logger } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { APP_URL, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } from '../utils/constants';
import * as fs from 'fs';
import * as path from 'path';
export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: SMTP_HOST || 'smtp.ethereal.email',
      port: parseInt(SMTP_PORT as string) || 587,
      secure: false,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }

  private renderTemplate(templateName: string, data: Record<string, any>): string {
    const filePath = path.join(__dirname, 'templates', `${templateName}.html`);
    
    let template = fs.readFileSync(filePath, 'utf-8');

    Object.keys(data).forEach((key) => {
      const value = data[key];
      template = template.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });

    return template;
  }

  async send(options: SendEmailOptions): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from: `"Taskly" <noreply@taskly.com>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });

      this.logger.log(`Email sent to ${options.to}: ${info.messageId}`);
      
      if (process.env.NODE_ENV === 'development') {
        this.logger.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      }
    } catch (error) {
      this.logger.error(`Failed to send email: ${error}`);
      throw error;
    }
  }

  getForgotPasswordTemplate(name: string, code: string): string {
    return this.renderTemplate('forgot-password', {
      name,
      code,
      appUrl: APP_URL,
      currentYear: new Date().getFullYear(),
    });
  }

  getVerificationEmailTemplate(name: string, code: string): string {
    return this.renderTemplate('verification', {
      name,
      code,
      appUrl: APP_URL,
      currentYear: new Date().getFullYear(),
    });
  }

  getPasswordChangedTemplate(name: string): string {
    return this.renderTemplate('password-changed', {
      name,
      appUrl: APP_URL,
      currentYear: new Date().getFullYear(),
    });
  }
}