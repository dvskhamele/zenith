import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { recipientEmail, pitchContent, blogName } = await request.json();

    if (!recipientEmail || !pitchContent || !blogName) {
      return NextResponse.json({ error: 'Recipient email, pitch content, and blog name are required' }, { status: 400 });
    }

    const emailSubject = `Guest Post Pitch for ${blogName}: ${pitchContent.substring(0, 50)}...`;

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM || 'onboarding@resend.dev',
      to: recipientEmail,
      subject: emailSubject,
      html: `<p>Dear ${blogName} Team,</p>
             <p>${pitchContent.replace(/\n/g, '<br/>')}</p>
             <p>Looking forward to your response.</p>
             <p>Best regards,</p>
             <p>Zenith Team</p>`,
    });

    if (error) {
      console.error('Resend email error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Guest post pitch sent successfully', data }, { status: 200 });
  } catch (error) {
    console.error('Error sending guest post pitch:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
