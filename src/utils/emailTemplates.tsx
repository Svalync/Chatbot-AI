// Consolidated enum for all email templates
enum EmailTemplateType {
  Welcome = 'WELCOME',
  VerificationToken = 'VERIFICATION_TOKEN',
  WorkflowScheduled = 'WORKFLOW_SCHEDULED',
  WorkflowNotActivated = 'WORKFLOW_NOT_ACTIVATED',
  NoActivityLastFour = 'NO_ACTIVITY_LAST_FOUR',
  Feedback = 'FEEDBACK',
}

// Interface for email content
interface EmailContent {
  subject: string;
  header: string;
  body: string;
  footer: string;
}

interface renderEmailTemplateProp {
  firstName: string;
  customData: any;
}

// Template map to avoid switch statements
const emailTemplates: Map<EmailTemplateType, (firstName: string, customData?: any) => EmailContent> = new Map([
  [
    EmailTemplateType.Welcome,
    (firstName: string) => ({
      subject: 'Welcome to Svalync &ndash; Your Account is Successfully Created!',
      header: `Hey ${firstName} ✨`,
      body: `
      Welcome to Svalync! 🎉

      We are excited to have you on board. Your account has been successfully created, and you're now ready to automate your processes. Click here to go to user workflow templates and click here to request one.

      Thank you for choosing Svalync. We're thrilled to help you achieve more with less effort!
      `,
      footer: '',
    }),
  ],
  [
    EmailTemplateType.VerificationToken,
    (firstName: string, customData?: { redirectLink: string }) => ({
      subject: 'Verify Your Account on Svalync',
      header: `Hey ${firstName} ✨`,
      body: `
      Thank you for creating an account with Svalync! To get started, please verify your email address by clicking the link below:
      
      <a href="${customData?.redirectLink}">Verify Your Email</a>
      `,
      footer: '',
    }),
  ],
  [
    EmailTemplateType.WorkflowScheduled,
    (firstName: string, customData?: { workflowName: string }) => ({
      subject: 'Your Workflow is Now Active! 🚀',
      header: `Hey ${firstName} ✨`,
      body: `
      Good news! The workflow ${customData?.workflowName} you created in Svalync is now up and running. 🎉
      `,
      footer: '',
    }),
  ],
  [
    EmailTemplateType.WorkflowNotActivated,
    (firstName: string, customData?: { workflowName: string }) => ({
      subject: 'Your Workflow is Ready &ndash; Don&apos;t Miss Out on Automation! &#x1F504;',
      header: `Hey ${firstName} ✨`,
      body: `
        We noticed you created a workflow, ${customData?.workflowName}, a couple of days ago but haven&apos;t taken any action since. Remember, your automation is all set and ready to go!

        What can you do next?
        - Turn on your workflow to start automating your tasks.
        - Connect more apps to maximize the power of Svalync.
        - Test your workflow to see it in action.

        Your automation journey is just a click away. Let&apos;s get your workflows running and save you more time!
      `,
      footer: '',
    }),
  ],
  [
    EmailTemplateType.NoActivityLastFour,
    (firstName: string) => ({
      subject: 'Need Help Getting Started with Svalync? We&apos;re Here for You! &#x1F680;',
      header: `Hey ${firstName} &#x2728;`,
      body: `
        It&apos;s been a few days since you joined Svalync, and we noticed that you haven&apos;t schedule any workflows. 

        No worries! We&apos;re here to help you get started and automate your business processes.

        Here&apos;s how to get started:
        - Set up your first workflow: **Automate your daily tasks with ease. Create a Workflow.
        - Connect your apps: **Sync the tools you use every day. It&apos;s quick and simple!

        If you haven&apos;t found a workflow that suits your needs, please fill out this form, and our team will be happy to assist you.
      `,
      footer: '',
    }),
  ],
  // Add more templates here...
  [
    EmailTemplateType.Feedback,
    (firstName: string, customData?: any) => ({
      subject: 'We Want to Hear from You! 📣',
      header: `Hey ${firstName} ✨`,
      body: `
        We hope you're enjoying your experience with Svalync. Your feedback is important to us, and we'd love to hear from you. Please share your thoughts and suggestions with us.
        ${customData?.feedback}

        Email of the user who provided the feedback: ${customData?.email}
      `,
      footer: '',
    }),
  ],
]);

// Function to get email content based on the template type
function getEmailContent(template: EmailTemplateType, firstName: string, customData?: any): EmailContent {
  const templateFunction = emailTemplates.get(template);

  if (!templateFunction) {
    throw new Error('Invalid email template');
  }

  return templateFunction(firstName, customData);
}

// Function to generate email HTML content on the server
function renderEmailTemplate(template: EmailTemplateType, props: renderEmailTemplateProp): string {
  const emailContent = getEmailContent(template, props.firstName, props.customData);

  // Enhanced HTML template with better styling
  return `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
        }
        .body {
          white-space: pre-line;
          margin-bottom: 30px;
        }
        .footer {
          border-top: 1px solid #eee;
          padding-top: 20px;
          font-size: 12px;
          color: #666;
          white-space: pre-line;
        }
        .salutation {
          white-space: pre-line;
        }
        .company-info {
          margin-top: 20px;
          font-size: 12px;
          color: #888;
        }
      </style>
    </head>
    <body>
      <div>
        <p>${emailContent.header}</p>
      </div>
      <div>
        <p>
          ${emailContent.body}
        </p>
      </div>
      <div class="salutation">
        Regards,
        Uday Agarwal
        Svalync Founder
      </div>
      <div class="footer">
        Svalync
        Omaxe Forest Spa,
        Sector93B, Noida, 
        U.P., 201304
      </div>
    </body>
  </html>
  `;
}

// Example usage with custom data
async function exampleUsage() {
  const email = 'user@example.com';
  const template = EmailTemplateType.Feedback; // Specify the template type
  const firstName = 'John'; // Provide first name for personalization
  const customData = {
    content: 'https://svalync.com/verify?token=someUniqueToken123',
  };

  const emailHtml = renderEmailTemplate(template, { firstName, customData });
  console.log(emailHtml); // Display the generated email HTML
}

export { EmailTemplateType, getEmailContent, renderEmailTemplate };

// Call the example usage to test
