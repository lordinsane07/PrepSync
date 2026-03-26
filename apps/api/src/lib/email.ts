const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const BREVO_API_KEY = process.env.BREVO_API_KEY || '';
const FROM_EMAIL = process.env.BREVO_SENDER_EMAIL || 'prepsync@prepsync.dev';
const FROM_NAME = 'PrepSync';

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  if (!BREVO_API_KEY) {
    console.warn('[Email] BREVO_API_KEY not set — skipping email send');
    return;
  }

  const response = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': BREVO_API_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: FROM_NAME, email: FROM_EMAIL },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`[Email] Brevo API error (${response.status}):`, errorBody);
  }
}

export async function sendVerificationOTP(
  to: string,
  otp: string,
  name: string,
): Promise<void> {
  try {
    await sendEmail(
      to,
      'Verify your PrepSync account',
      `
        <div style="font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #0f172a; color: #e2e8f0; border-radius: 12px;">
          <h2 style="color: #38bdf8; margin-bottom: 8px;">Welcome to PrepSync!</h2>
          <p>Hi ${name},</p>
          <p>Your verification code is:</p>
          <div style="text-align: center; margin: 24px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #38bdf8; background: #1e293b; padding: 16px 32px; border-radius: 8px; display: inline-block;">${otp}</span>
          </div>
          <p style="color: #94a3b8; font-size: 14px;">This code expires in 10 minutes. If you didn't create an account, you can ignore this email.</p>
        </div>
      `,
    );
    console.log(`[Email] Verification OTP sent to ${to}`);
  } catch (error) {
    console.error(`[Email] Failed to send OTP to ${to}:`, error);
  }
}

export async function sendResendVerificationOTP(
  to: string,
  otp: string,
): Promise<void> {
  try {
    await sendEmail(
      to,
      'Your new PrepSync verification code',
      `
        <div style="font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #0f172a; color: #e2e8f0; border-radius: 12px;">
          <h2 style="color: #38bdf8;">New Verification Code</h2>
          <p>Here's your new verification code:</p>
          <div style="text-align: center; margin: 24px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #38bdf8; background: #1e293b; padding: 16px 32px; border-radius: 8px; display: inline-block;">${otp}</span>
          </div>
          <p style="color: #94a3b8; font-size: 14px;">This code expires in 10 minutes.</p>
        </div>
      `,
    );
    console.log(`[Email] Resend OTP sent to ${to}`);
  } catch (error) {
    console.error(`[Email] Failed to resend OTP to ${to}:`, error);
  }
}
