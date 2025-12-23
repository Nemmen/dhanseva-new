import fs from 'fs';
import path from 'path';
import { sendEmail } from '../../config/email';

interface TemplateVariables {
  [key: string]: string | number | boolean | undefined;
}

export class EmailTemplate {
  private templatesDir = path.join(__dirname, '../../templates/emails');

  /**
   * Load and render email template with variables
   */
  private loadTemplate(templateName: string): string {
    const templatePath = path.join(this.templatesDir, `${templateName}.html`);
    const content = fs.readFileSync(templatePath, 'utf-8');
    return content;
  }

  /**
   * Replace variables in template
   */
  private renderTemplate(template: string, variables: TemplateVariables): string {
    let rendered = template;

    // Replace all {{VARIABLE}} with actual values
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      rendered = rendered.replace(regex, String(value || ''));
    });

    // Remove conditional blocks
    rendered = rendered.replace(/{{#IF_\w+}}[\s\S]*?{{\/IF_\w+}}/g, '');
    rendered = rendered.replace(/{{^IF_\w+}}[\s\S]*?{{\/IF_\w+}}/g, '');

    return rendered;
  }

  /**
   * Send OTP Verification Email
   */
  async sendOtpVerification(email: string, otp: string, expiryTime: string): Promise<void> {
    const template = this.loadTemplate('otp-verification');
    const html = this.renderTemplate(template, {
      OTP: otp,
      EXPIRY_TIME: expiryTime,
    });

    await sendEmail(email, '🔐 Email Verification - Dhanseva', html);
  }

  /**
   * Send Registration Success Email
   */
  async sendRegistrationSuccess(
    email: string,
    userName: string,
    role: string,
    dashboardUrl: string,
    creationDate: string
  ): Promise<void> {
    const template = this.loadTemplate('registration-success');
    const html = this.renderTemplate(template, {
      USER_NAME: userName,
      EMAIL: email,
      ROLE: role,
      CREATION_DATE: creationDate,
      DASHBOARD_URL: dashboardUrl,
    });

    await sendEmail(email, '✅ Welcome to Dhanseva!', html);
  }

  /**
   * Send Payment Success Email
   */
  async sendPaymentSuccess(
    email: string,
    userName: string,
    serviceName: string,
    transactionId: string,
    amount: string,
    paymentDate: string,
    paymentMethod: string,
    referenceCode: string,
    dashboardUrl: string
  ): Promise<void> {
    const template = this.loadTemplate('payment-success');
    const html = this.renderTemplate(template, {
      USER_NAME: userName,
      SERVICE_NAME: serviceName,
      TRANSACTION_ID: transactionId,
      AMOUNT: amount,
      PAYMENT_DATE: paymentDate,
      PAYMENT_METHOD: paymentMethod,
      REFERENCE_CODE: referenceCode,
      DASHBOARD_URL: dashboardUrl,
    });

    await sendEmail(email, '✅ Payment Confirmed - Dhanseva', html);
  }

  /**
   * Send Request Status Update Email
   */
  async sendRequestStatusUpdate(
    email: string,
    userName: string,
    serviceName: string,
    status: string,
    requestId: string,
    updateDate: string,
    expectedDate: string,
    notes?: string,
    expertName?: string,
    expertEmail?: string,
    expertPhone?: string,
    expertExperience?: string,
    dashboardUrl?: string
  ): Promise<void> {
    const template = this.loadTemplate('request-status-update');
    const html = this.renderTemplate(template, {
      USER_NAME: userName,
      SERVICE_NAME: serviceName,
      STATUS: status,
      STATUS_LOWER: status.toLowerCase(),
      REQUEST_ID: requestId,
      UPDATE_DATE: updateDate,
      EXPECTED_DATE: expectedDate,
      NOTES: notes || '',
      EXPERT_NAME: expertName || '',
      EXPERT_EMAIL: expertEmail || '',
      EXPERT_PHONE: expertPhone || '',
      EXPERT_EXPERIENCE: expertExperience || '',
      DASHBOARD_URL: dashboardUrl || '',
    });

    await sendEmail(email, `📋 ${status} - Your ${serviceName} Request Update`, html);
  }

  /**
   * Send Request Completion Email
   */
  async sendRequestCompletion(
    email: string,
    userName: string,
    serviceName: string,
    requestId: string,
    completionDate: string,
    duration: string,
    downloadLink: string,
    expertName: string,
    expertQualification: string,
    expertExperience: string,
    expertEmail: string,
    ratingLink: string,
    browseServicesLink: string
  ): Promise<void> {
    const template = this.loadTemplate('request-completed');
    const html = this.renderTemplate(template, {
      SERVICE_NAME: serviceName,
      USER_NAME: userName,
      REQUEST_ID: requestId,
      COMPLETION_DATE: completionDate,
      DURATION: duration,
      DOWNLOAD_LINK: downloadLink,
      EXPERT_NAME: expertName,
      EXPERT_QUALIFICATION: expertQualification,
      EXPERT_EXPERIENCE: expertExperience,
      EXPERT_EMAIL: expertEmail,
      RATING_LINK: ratingLink,
      BROWSE_SERVICES: browseServicesLink,
    });

    await sendEmail(email, `✅ Your ${serviceName} is Ready - Download Now!`, html);
  }

  /**
   * Send DSA Invitation Email
   */
  async sendDsaInvitation(
    email: string,
    firstName: string,
    regions: string,
    registrationLink: string,
    expiryDate: string
  ): Promise<void> {
    const template = this.loadTemplate('dsa-invitation');
    const html = this.renderTemplate(template, {
      FIRST_NAME: firstName,
      REGIONS: regions,
      REGISTRATION_LINK: registrationLink,
      EXPIRY_DATE: expiryDate,
    });

    await sendEmail(email, '🚀 Join Dhanseva as a Legal Expert (DSA)', html);
  }

  /**
   * Send Password Reset Email
   */
  async sendPasswordReset(
    email: string,
    userName: string,
    resetLink: string,
    expiryTime: string
  ): Promise<void> {
    const template = this.loadTemplate('password-reset');
    const html = this.renderTemplate(template, {
      USER_NAME: userName,
      RESET_LINK: resetLink,
      EXPIRY_TIME: expiryTime,
    });

    await sendEmail(email, '🔐 Reset Your Password - Dhanseva', html);
  }
}

export const emailTemplate = new EmailTemplate();
