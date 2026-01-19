import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Gmail SMTP email configuration
let transporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  try {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000
    });
    console.log('Gmail SMTP transporter configured successfully');
    console.log('Email user:', process.env.EMAIL_USER);
  } catch (error) {
    console.error('Error creating email transporter:', error);
    console.warn('Email functionality will not work.');
  }
} else {
  console.warn('Warning: Email credentials not configured. Email functionality will not work.');
  console.warn('Please set EMAIL_USER and EMAIL_PASS in your .env file');
  console.warn('Example:');
  console.warn('  EMAIL_USER=gretatunga@gmail.com');
  console.warn('  EMAIL_PASS=your_gmail_app_password');
  console.warn('');
  console.warn('Note: For Gmail, you need to use an App Password, not your regular password.');
  console.warn('Get one at: https://myaccount.google.com/apppasswords');
}

// Routes
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to CC Travels API' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Book flight endpoint
app.post('/api/book-flight', async (req, res) => {
  try {
    console.log('Received flight booking request:', {
      tripType: req.body.tripType,
      departure: req.body.departure,
      customerEmail: req.body.customerEmail
    });

    if (!transporter) {
      console.error('Email service not configured. EMAIL_USER and EMAIL_PASS must be set in .env file');
      return res.status(500).json({ 
        success: false, 
        message: 'Email service not configured. Please set up EMAIL_USER and EMAIL_PASS in the backend .env file.' 
      });
    }

    const {
      tripType,
      departure,
      destinations,
      departureDate,
      returnDate,
      adults,
      kids,
      customerEmail,
      description,
      email
    } = req.body;

    // Validate required fields
    if (!tripType || !departure || !departureDate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields. Please fill in all required information.'
      });
    }

    // Format destinations
    const destinationsText = Array.isArray(destinations) 
      ? destinations.filter(d => d).join(', ')
      : destinations || 'Not specified';

    // Build email content
    const emailContent = `
      New Flight Booking Request

      Customer Email: ${customerEmail || 'Not provided'}
      Trip Type: ${tripType === 'round' ? 'Round Trip' : tripType === 'one-way' ? 'One-Way' : 'Multi-City'}
      Departure From: ${departure}
      ${tripType === 'multi-city' ? 'Destinations:' : 'Destination:'} ${destinationsText}
      Departure Date: ${departureDate}
      ${returnDate ? `Return Date: ${returnDate}` : ''}
      Number of Adults: ${adults}
      Number of Kids: ${kids}
      ${description ? `Additional Preferences:\n${description}` : ''}
    `;

    const htmlContent = `
      <h2>New Flight Booking Request</h2>
      <p><strong>Customer Email:</strong> ${customerEmail || 'Not provided'}</p>
      <p><strong>Trip Type:</strong> ${tripType === 'round' ? 'Round Trip' : tripType === 'one-way' ? 'One-Way' : 'Multi-City'}</p>
      <p><strong>Departure From:</strong> ${departure}</p>
      <p><strong>${tripType === 'multi-city' ? 'Destinations:' : 'Destination:'}</strong> ${destinationsText}</p>
      <p><strong>Departure Date:</strong> ${departureDate}</p>
      ${returnDate ? `<p><strong>Return Date:</strong> ${returnDate}</p>` : ''}
      <p><strong>Number of Adults:</strong> ${adults}</p>
      <p><strong>Number of Kids:</strong> ${kids}</p>
      ${description ? `<p><strong>Additional Preferences:</strong><br>${description.replace(/\n/g, '<br>')}</p>` : ''}
    `;

    const mailOptions = {
      from: `"Support" <${process.env.EMAIL_USER || 'gretatunga@gmail.com'}>`,
      to: email || 'info@cctravels.org',
      subject: 'New Flight Booking Request - CC Travels',
      text: emailContent,
      html: htmlContent,
      replyTo: customerEmail || undefined
    };

    console.log('Attempting to send email via Gmail SMTP...');
    console.log('Email from:', mailOptions.from);
    console.log('Email to:', mailOptions.to);
    
    // Add timeout to prevent hanging
    const emailPromise = transporter.sendMail(mailOptions);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Email sending timeout')), 30000)
    );
    
    await Promise.race([emailPromise, timeoutPromise]);
    console.log('Email sent successfully via Gmail SMTP');

    // Make sure response is sent
    if (!res.headersSent) {
      res.json({ 
        success: true, 
        message: 'Thank you! Your flight booking request has been submitted successfully.' 
      });
    }
  } catch (error) {
    console.error('Error sending email:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    
    // Make sure to send a response even if there's an error
    if (!res.headersSent) {
      res.status(500).json({ 
        success: false, 
        message: `Error submitting booking request: ${error.message || 'Please try again later.'}` 
      });
    } else {
      console.error('Response already sent, cannot send error response');
    }
  }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    if (!transporter) {
      console.error('Email service not configured. EMAIL_USER and EMAIL_PASS must be set in .env file');
      return res.status(500).json({ 
        success: false, 
        message: 'Email service not configured. Please set up EMAIL_USER and EMAIL_PASS in the backend .env file.' 
      });
    }

    const {
      name,
      email,
      subject,
      message,
      to
    } = req.body;

    const emailContent = `
      New Contact Form Submission

      Name: ${name}
      Email: ${email}
      Subject: ${subject}
      
      Message:
      ${message}
    `;

    const htmlContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `;

    const mailOptions = {
      from: `"Support" <${process.env.EMAIL_USER || 'gretatunga@gmail.com'}>`,
      to: to || 'info@cctravels.org',
      subject: `Contact Form: ${subject}`,
      text: emailContent,
      html: htmlContent,
      replyTo: email
    };

    console.log('Attempting to send contact email via Gmail SMTP...');
    console.log('Email from:', mailOptions.from);
    console.log('Email to:', mailOptions.to);
    
    // Add timeout to prevent hanging
    const emailPromise = transporter.sendMail(mailOptions);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Email sending timeout')), 30000)
    );
    
    await Promise.race([emailPromise, timeoutPromise]);
    console.log('Contact email sent successfully via Gmail SMTP');

    // Make sure response is sent
    if (!res.headersSent) {
      res.json({ 
        success: true, 
        message: 'Message sent successfully' 
      });
    }
  } catch (error) {
    console.error('Error sending email:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    
    // Make sure to send a response even if there's an error
    if (!res.headersSent) {
      res.status(500).json({ 
        success: false, 
        message: `Error sending message: ${error.message || 'Please try again later.'}` 
      });
    } else {
      console.error('Response already sent, cannot send error response');
    }
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
