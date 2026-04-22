import { Injectable, Logger } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { APP_URL, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } from '../utils/constants';

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
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Recuperar Contraseña</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Taskly</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 32px;">
              <h2 style="margin: 0 0 16px; color: #0f172a; font-size: 24px; font-weight: 600;">¿Olvidaste tu contraseña?</h2>
              <p style="margin: 0 0 24px; color: #475569; font-size: 16px; line-height: 1.6;">
                Hola <strong>${name}</strong>,<br><br>
                Recibimos una solicitud para restablecer tu contraseña. Usa el siguiente código para crear una nueva contraseña:
              </p>
              
              <!-- Code Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #f1f5f9; border-radius: 8px; padding: 20px; margin: 24px 0;">
                <tr>
                  <td align="center" style="font-family: 'Geist Mono', monospace; font-size: 32px; font-weight: 700; color: #0f172a; letter-spacing: 8px;">
                    ${code}
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0; color: #64748b; font-size: 14px;">
                Este código vence en <strong>30 minutos</strong>.
              </p>
              
              <!-- Warning -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #fef2f2; border-radius: 8px; padding: 16px; margin: 24px 0; border-left: 4px solid #ef4444;">
                <tr>
                  <td style="color: #991b1b; font-size: 14px;">
                    <strong>Nota de seguridad:</strong> Si no solicitaste este cambio, ignora este correo. Tu contraseña actual seguirá funcionando.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background: #f8fafc; padding: 24px 32px; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; color: #94a3b8; font-size: 12px; text-align: center;">
                © ${new Date().getFullYear()} Taskly. Todos los derechos reservados.<br>
                <a href="${APP_URL}" style="color: #3b82f6; text-decoration: none;">${APP_URL}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
  }

  getVerificationEmailTemplate(name: string, code: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Verifica tu correo</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Taskly</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 32px;">
              <h2 style="margin: 0 0 16px; color: #0f172a; font-size: 24px; font-weight: 600;">Verifica tu correo electrónico</h2>
              <p style="margin: 0 0 24px; color: #475569; font-size: 16px; line-height: 1.6;">
                Hola <strong>${name}</strong>,<br><br>
                Gracias por registrarte en Taskly. Para completar tu registro, verifica tu correo electrónico con el siguiente código:
              </p>
              
              <!-- Code Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #f1f5f9; border-radius: 8px; padding: 20px; margin: 24px 0;">
                <tr>
                  <td align="center" style="font-family: 'Geist Mono', monospace; font-size: 32px; font-weight: 700; color: #0f172a; letter-spacing: 8px;">
                    ${code}
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0; color: #64748b; font-size: 14px;">
                Este código vence en <strong>30 minutos</strong>.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background: #f8fafc; padding: 24px 32px; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; color: #94a3b8; font-size: 12px; text-align: center;">
                © ${new Date().getFullYear()} Taskly. Todos los derechos reservados.<br>
                <a href="${APP_URL}" style="color: #3b82f6; text-decoration: none;">${APP_URL}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
  }

  getPasswordChangedTemplate(name: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Contraseña actualizada</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Taskly</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 32px;">
              <div style="text-align: center; margin-bottom: 24px;">
                <div style="width: 64px; height: 64px; background: #dcfce7; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              </div>
              
              <h2 style="margin: 0 0 16px; color: #0f172a; font-size: 24px; font-weight: 600; text-align: center;">Contraseña actualizada</h2>
              <p style="margin: 0; color: #475569; font-size: 16px; line-height: 1.6; text-align: center;">
                Hola <strong>${name}</strong>,<br><br>
                Tu contraseña ha sido actualizada correctamente.
              </p>
              
              <!-- Warning -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #fef2f2; border-radius: 8px; padding: 16px; margin: 24px 0; border-left: 4px solid #ef4444;">
                <tr>
                  <td style="color: #991b1b; font-size: 14px;">
                    <strong>¿No fuiste tú?</strong> Si no realizaste este cambio, contacta inmediatamente con soporte.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background: #f8fafc; padding: 24px 32px; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; color: #94a3b8; font-size: 12px; text-align: center;">
                © ${new Date().getFullYear()} Taskly. Todos los derechos reservados.<br>
                <a href="${APP_URL}" style="color: #3b82f6; text-decoration: none;">${APP_URL}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
  }
}