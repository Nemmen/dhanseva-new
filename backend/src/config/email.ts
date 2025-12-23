import nodemailer from 'nodemailer';
import { config } from './index';

export const emailTransporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: false, // true for 465, false for other ports
  auth: {
    user: config.email.user,
    pass: config.email.password,
  },
});

// Verify transporter configuration
emailTransporter.verify((error: Error | null) => {
  if (error) {
    //console.error('❌ Email transporter configuration error:', error);
  } else {
    //console.log('✅ Email transporter is ready');
  }
});

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
    //console.error('Email send error:', error);
    throw error;
  }
};
