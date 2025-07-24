import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  const { name, email } = await req.json();

  try {
    // 1. Notify you (Admin)
    const adminEmail = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'bhuvanux@gmail.com',
      subject: '📩 New Waitlist Signup',
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p>🕒 Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
      `
    });

 // 2. Confirmation to User
const userEmail = await resend.emails.send({
  from: 'onboarding@resend.dev',
  to: ['bhuvanux@gmail.com', email],
  subject: '✨ You’re on the CaptionSpark Waitlist!',
  html: `
    <h3>Hi ${name},</h3>
    <p>Thanks for joining the waitlist for <strong>CaptionSpark</strong>! 🚀</p>
    <p>You’ll be the first to know when we launch.</p>
    <br />
    <p>– The CaptionSpark Team</p>
  `
});

    console.log('Admin + User emails sent');
    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (error) {
    console.error('Email error:', error);
    return new Response(JSON.stringify({ error: 'Email send failed' }), { status: 500 });
  }
}