import { createTransport } from 'nodemailer';

// Create reusable transporter object using SMTP transport
const transporter = createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com', // Default to Gmail SMTP
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Hardcoded recipient for testing - replace with environment variable in production
const RECIPIENT_EMAIL = 'hello@demomailtrap.com';

export async function POST(request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, subject, message } = body;

    console.log(body);

    // Input validation
    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return new Response(
        JSON.stringify({ error: 'All fields are required and cannot be empty' }),
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { status: 400 }
      );
    }

    // Configure email content
    const htmlContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;

    // Configure email sending with explicit from and to addresses
    const mailOptions = {
      from: {
        name: 'Contact Form',
        address: process.env.SMTP_USER || 'your-email@gmail.com' // Use authenticated email as sender
      },
      to: RECIPIENT_EMAIL, // Explicit recipient
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      html: htmlContent,
      text: `New Contact Form Submission\n\nName: ${firstName} ${lastName}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
    };

    // Verify email configuration before sending
    console.log('Sending email with config:', {
      to: mailOptions.to,
      from: mailOptions.from,
      subject: mailOptions.subject
    });

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info);

    return new Response(
      JSON.stringify({ message: 'Email sent successfully' }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    
    // More detailed error response
    const errorMessage = error.code === 'EAUTH' 
      ? 'Email authentication failed. Please check SMTP credentials.'
      : error.code === 'ECONNREFUSED'
      ? 'Could not connect to email server. Please check SMTP settings.'
      : 'Failed to send email. Please try again later.';

    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        code: error.code 
      }),
      { status: 500 }
    );
  }
}