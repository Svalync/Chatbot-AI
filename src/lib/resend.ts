import { Resend } from 'resend';
import configEnv from '@/config';
import {
  EmailTemplateType,
  getEmailContent,
  renderEmailTemplate,
} from '@/utils/emailTemplates';

export default class resendInstance {
  resend: Resend;
  from: string = '';

  constructor() {
    this.resend = new Resend(configEnv.resend.apiKey);
    this.setFromCredentials();
  }

  setFromCredentials() {
    if (configEnv.nextEnv === 'dev') {
      this.from = 'Svalync <onboarding@resend.dev>';
    }

    if (configEnv.nextEnv === 'prod') {
      this.from = 'Uday Agarwal <uday@svalync.com>';
    }
  }

  async sendMail(
    toEmail: string,
    template: EmailTemplateType,
    firstName: string,
    customData: any = null,
  ) {
    const data = {
      firstName,
      customData,
    };
    const emailHtml = renderEmailTemplate(template, data);
    const subject = getEmailContent(template, firstName, customData).subject;
    const mail = await this.resend.emails.send({
      from: this.from,
      to: toEmail,
      subject: subject,
      html: emailHtml,
    });
    return mail;
  }

  // async sendMailAfterSignup(email: string) {
  //   const mail = await this.resend.emails.send({
  //     from: 'Svalync <onboarding@resend.dev>',
  //     to: 'skaazharuddin786@gmail.com',
  //     subject: 'Signup',
  //     text: 'Welcome to svalync',
  //   });
  //   return mail;
  // }

  // async sendMailForWorkflowTurnedon(email: string, title) {
  //   const mail = await this.resend.emails.send({
  //     from: 'Svalync <onboarding@resend.dev>',
  //     to: 'skaazharuddin786@gmail.com',
  //     subject: 'Worfklow turned on',
  //     text: `Your workflow ${title} is start `,
  //   });
  //   return mail;
  // }

  // async sendMailForUnsuedActivity(
  //   email: string,
  //   workflow: workflowInterface[],
  // ) {
  //   const mail = await this.resend.emails.send({
  //     from: 'Svalync <onboarding@resend.dev>',
  //     to: 'skaazharuddin786@gmail.com',
  //     subject: 'Unused Activity',
  //     react: UnusedEmail(workflow),
  //   });
  //   return mail;
  // }

  // async sendMailAfter4Days(email: string) {
  //   const mail = await this.resend.emails.send({
  //     from: 'Svalync <onboarding@resend.dev>',
  //     to: 'skaazharuddin786@gmail.com',
  //     subject: 'sendMailAfter4Days',
  //     text: '4 days',
  //     scheduledAt: 'in 72 hours',
  //   });
  //   return mail;
  // }

  // async sendMail(mailObj: mailInterface) {
  //   const mail = await this.resend.emails.send({
  //     from: mailObj.getFrom(),
  //     to: mailObj.getEmail(),
  //     subject: mailObj.getSubject(),
  //     text: mailObj.getText(),
  //   });
  //   return mail;
  // }

  // async sendHTMLMail(mailObj: mailInterface) {
  //   const mail = await this.resend.emails.send({
  //     from: mailObj.getFrom(),
  //     to: mailObj.getEmail(),
  //     subject: mailObj.getSubject(),
  //     html: mailObj.getHTML(),
  //   });
  //   return mail;
  // }

  // async sendVerificationEmail(
  //   email: string,
  //   token: string,
  //   mailObj: mailInterface,
  // ) {
  //   const confirmLink = `${configEnv.app.url}/auth/new-verification?token=${token}`;
  //   mailObj.setEmail(email);
  //   mailObj.setSubject('Confirm your email');
  //   mailObj.setHTML(
  //     `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
  //   );
  //   const result = await this.sendHTMLMail(mailObj);
  //   return result;
  // }

  // async sendPasswordResetMail(
  //   email: string,
  //   token: string,
  //   mailObj: mailInterface,
  // ) {
  //   const confirmLink = `${configEnv.app.url}/auth/new-password?token=${token}`;
  //   mailObj.setEmail(email);
  //   mailObj.setSubject('Reset Your Password');
  //   mailObj.setHTML(
  //     `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
  //   );
  //   this.sendHTMLMail(mailObj);
  // }
}
