// Vercel Serverless Function - Contact Form API
// File: api/contact.js

const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);

const RECIPIENT_EMAILS = [
  'contact@mbouma-kohomm-holding.com',
  'info@mbouma-kohomm-holding.com',
];

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Save contact message to database
    const { error: dbError } = await supabase
      .from('contact_messages')
      .insert({
        name,
        email,
        subject,
        message,
        created_at: new Date().toISOString(),
      });

    if (dbError) {
      console.error('Contact DB error:', dbError);
    }

    // Send email notification via Resend
    try {
      await resend.emails.send({
        from: 'MKH Contact Form <onboarding@resend.dev>',
        to: RECIPIENT_EMAILS,
        replyTo: email,
        subject: `[MKH Contact] ${subject}`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #f5f0e6; padding: 32px; border-radius: 8px;">
            <h2 style="color: #1A1A1A; border-bottom: 2px solid #D4AF37; padding-bottom: 12px;">
              Nouveau message — Formulaire de contact MKH
            </h2>
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <tr>
                <td style="padding: 8px 0; color: #888; width: 100px;"><strong>Nom :</strong></td>
                <td style="padding: 8px 0; color: #1A1A1A;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #888;"><strong>Email :</strong></td>
                <td style="padding: 8px 0; color: #1A1A1A;"><a href="mailto:${email}" style="color: #D4AF37;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #888;"><strong>Sujet :</strong></td>
                <td style="padding: 8px 0; color: #1A1A1A;">${subject}</td>
              </tr>
            </table>
            <div style="margin-top: 24px; background: white; padding: 20px; border-radius: 6px; border-left: 4px solid #D4AF37;">
              <p style="color: #888; margin: 0 0 8px 0;"><strong>Message :</strong></p>
              <p style="color: #1A1A1A; white-space: pre-line; margin: 0;">${message}</p>
            </div>
            <p style="color: #aaa; font-size: 12px; margin-top: 24px;">
              Ce message a été envoyé depuis le formulaire de contact du site mbouma-kohomm-holding.com
            </p>
          </div>
        `,
      });

      console.log('Email sent successfully via Resend');
    } catch (emailError) {
      console.error('Failed to send email via Resend:', emailError);
      // Don't fail the request if email fails — message is saved in DB
    }

    res.json({ success: true, message: 'Message envoyé avec succès.' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
