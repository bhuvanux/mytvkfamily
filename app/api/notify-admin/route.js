import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY); // ✅ Uses env variable

export async function POST(req) {
  const { name, email } = await req.json();

  try {
    // 1. Notify Admin
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'bhuvanux@gmail.com',
      subject: 'TVK Maanadu 2.0',
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p>🕒 Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
      `
    });

    // 2. Auto-confirmation to user
    await resend.emails.send({
      from: 'support@captionspark.in', // 🔁 Update if domain not verified
      to: [email],
      subject: '✨மிக்க மகிழ்ச்சி - TVK Maanadu 2.0!',
      html: `
        <h3>Hi ${name},</h3>
        <p>நம் TVK குடும்பத்தில் இணைந்ததற்கு நன்றி. </p>
        <p>மாநாட்டில் சந்திப்போம், வெற்றி வாகை சூடுவோம் ❤️</p>
        <p>Follow us on X (https://x.com/risingoftvk)</p>
        <br />
        <p>– Voice of TVK Team</p>
      `
    });

    console.log('✅ Admin + user emails sent');
    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (error) {
    console.error('❌ Email error:', error);
    return new Response(JSON.stringify({ error: 'Email send failed' }), { status: 500 });
  }
}