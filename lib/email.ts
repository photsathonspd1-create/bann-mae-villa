import { Resend } from 'resend';

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail(data: EmailData): Promise<{ success: boolean; error?: string }> {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY not configured');
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data: result, error } = await resend.emails.send({
      from: data.from || process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: [data.to],
      subject: data.subject,
      html: data.html,
    });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

export function generateLeadEmailHTML(leadData: {
  name: string;
  phone: string;
  lineId?: string;
  message?: string;
  villaName?: string;
  visitDate?: Date;
}): string {
  const { name, phone, lineId, message, villaName, visitDate } = leadData;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Lead - Bann Mae Villa</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2c3e50; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #2c3e50; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏡 New Lead Received</h1>
          <p>Bann Mae Villa Contact Form</p>
        </div>
        
        <div class="content">
          <div class="field">
            <span class="label">Name:</span> ${name}
          </div>
          
          <div class="field">
            <span class="label">Phone:</span> ${phone}
          </div>
          
          ${lineId ? `
          <div class="field">
            <span class="label">LINE ID:</span> ${lineId}
          </div>
          ` : ''}
          
          ${villaName ? `
          <div class="field">
            <span class="label">Interested Villa:</span> ${villaName}
          </div>
          ` : ''}
          
          ${visitDate ? `
          <div class="field">
            <span class="label">Visit Date:</span> ${visitDate.toLocaleDateString('th-TH')}
          </div>
          ` : ''}
          
          ${message ? `
          <div class="field">
            <span class="label">Message:</span><br>
            ${message.replace(/\n/g, '<br>')}
          </div>
          ` : ''}
        </div>
        
        <div class="footer">
          <p>This email was sent from the Bann Mae Villa contact form.</p>
          <p>Received: ${new Date().toLocaleString('th-TH')}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
