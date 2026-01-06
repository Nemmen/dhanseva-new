import nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import { config } from './index';

const transportOptions: SMTPTransport.Options = {
  host: config.email.host,
  port: config.email.port,
  secure: false, // true for 465, false for other ports
  auth: {
    user: config.email.user,
    pass: config.email.password,
  },
  // Added for better compatibility with cloud providers
  tls: {
    rejectUnauthorized: false,
    minVersion: 'TLSv1.2'
  },
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,
  socketTimeout: 20000,
};

export const emailTransporter = nodemailer.createTransport(transportOptions);

// Skip verification in serverless environment (Vercel)
if (process.env.VERCEL !== '1') {
  emailTransporter.verify((error: Error | null) => {
    if (error) {
      console.error('❌ Email transporter configuration error:', error.message);
    } else {
      console.log('✅ Email transporter is ready');
    }
  });
}

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const info = await emailTransporter.sendMail({
      from: `"Dhanseva Legal Services" <${config.email.user}>`,
      to,
      subject,
      html,
    });
    return info;
  } catch (error) {
    console.error('Email send error:', error);
    throw error;
  }
};
