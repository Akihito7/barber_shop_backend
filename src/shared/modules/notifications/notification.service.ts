import { Injectable } from '@nestjs/common';
import { NotificationRepository } from './notification.repository';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { ConfigService } from '@nestjs/config';

interface ISendEmail {
  to: string;
  subject: string;
  text?: string;
  html: string;
}

interface ISendEmailVerification {
  email: string;
  code: string;
}

interface ICreateEmailCodeVerification {
  code: string;
  email: string;
}

@Injectable()
export class NotificationService {
  private transporter: Transporter;
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly configService: ConfigService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL_GOOGLE'),
        pass: this.configService.get<string>('PASSWORD_GOOGLE'),
      },
    });
  }

  async sendEmailVerification({ code, email }: ISendEmailVerification) {
    const callbackUrl = `http://localhost:3001/verification-email?userEmail=${email}`;
    console.log(callbackUrl);
    await this.sendEmail({
      to: email,
      html: this.generateHtmlEmail(code, callbackUrl),
      subject: 'Ativação de Conta',
    });
  }

  async createEmailCodeVerification({
    email,
    code,
  }: ICreateEmailCodeVerification) {
    await this.notificationRepository.createEmailCodeValidation({
      email,
      code,
    });
  }

  async sendEmail({ to, subject, text, html }: ISendEmail) {
    try {
      const mailOptions = {
        from:
          '"Barber Shop" <' +
          this.configService.get<string>('EMAIL_GOOGLE') +
          '>',
        to,
        subject,
        text,
        html,
      };
      const info = await this.transporter.sendMail(mailOptions);
      console.log('E-mail enviado: ', info.messageId);
      return info;
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      throw error;
    }
  }

  private generateHtmlEmail(code: string, verificationUrl: string): string {
    return `
      <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              color: #333;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
            }
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            h1 {
              color: #4CAF50;
              font-size: 36px;
              text-align: center;
            }
            .code-box {
              background-color: #4CAF50;
              color: #ffffff;
              font-size: 48px;
              font-weight: bold;
              padding: 20px;
              border-radius: 10px;
              text-align: center;
              margin: 20px 0;
            }
            .button {
              display: block;
              width: 100%;
              padding: 15px;
              background-color: #4CAF50;
              color: white;
              font-size: 18px;
              text-align: center;
              border-radius: 5px;
              text-decoration: none;
              margin-top: 20px;
            }
            .footer {
              font-size: 14px;
              text-align: center;
              color: #777;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <h1>Verificação de E-mail - Barber Shop</h1>
            <p>Olá,</p>
            <p>Estamos verificando seu endereço de e-mail. Para prosseguir, insira o código abaixo em nossa página de verificação:</p>
            
            <!-- Código de Verificação -->
            <div class="code-box">
              ${code}
            </div>
  
            <p><strong>Link para a página de verificação:</strong></p>
            <a href="${verificationUrl}" class="button">Verificar Agora</a>
            
            <h4>Passos para verificação:</h4>
            <ol>
              <li>Clique no botão acima para ir até a página de verificação.</li>
              <li>Insira o código de verificação quando solicitado.</li>
              <li>Confirme sua identidade e pronto!</li>
            </ol>
  
            <p class="footer">Caso você não tenha solicitado esta verificação, por favor, ignore este e-mail.</p>
          </div>
        </body>
      </html>
    `;
  }
}
