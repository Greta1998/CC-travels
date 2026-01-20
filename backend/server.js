import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Resend } from 'resend';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// CORS configuration - allow requests from frontend
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or same-origin)
    if (!origin) return callback(null, true);
    
    // Allow requests from localhost (development)
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    
    // Allow requests from Render frontend domains
    if (origin.includes('onrender.com')) {
      return callback(null, true);
    }
    
    // Allow all origins in development, or add your specific frontend domain
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Resend API email configuration
let resend = null;
if (process.env.RESEND_API_KEY) {
  try {
    resend = new Resend(process.env.RESEND_API_KEY);
    console.log('Resend API configured successfully');
  } catch (error) {
    console.error('Error creating Resend client:', error);
    console.warn('Email functionality will not work.');
  }
} else {
  console.warn('Warning: Resend API key not configured. Email functionality will not work.');
  console.warn('Please set RESEND_API_KEY in your environment variables');
  console.warn('Get your API key at: https://resend.com/api-keys');
  console.warn('You also need to verify your domain or use the default sending domain.');
}

// Routes
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to CC Travels API' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    emailConfigured: !!resend,
    hasResendApiKey: !!process.env.RESEND_API_KEY
  });
});

// Book flight endpoint
app.post('/api/book-flight', async (req, res) => {
  try {
    console.log('Received flight booking request:', {
      tripType: req.body.tripType,
      departure: req.body.departure,
      customerEmail: req.body.customerEmail
    });

    // Check if Resend is configured
    if (!resend) {
      console.error('Email service not configured. RESEND_API_KEY must be set in environment variables');
      console.error('RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
      return res.status(500).json({ 
        success: false, 
        message: 'Email service not configured. Please contact the administrator.' 
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

    // Use Resend API to send email
    // From address: Use your verified domain
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'info@cctravels.org';
    const toEmail = email || 'info@cctravels.org';

    console.log('Attempting to send email via Resend API...');
    console.log('Email from:', fromEmail);
    console.log('Email to:', toEmail);
    
    try {
      const { data, error } = await resend.emails.send({
        from: `CC Travels <${fromEmail}>`,
        to: [toEmail],
        replyTo: customerEmail || undefined,
        subject: 'New Flight Booking Request - CC Travels',
        text: emailContent,
        html: htmlContent,
      });

      if (error) {
        console.error('Resend API error:', error);
        throw new Error(error.message || 'Failed to send email via Resend');
      }

      console.log('Email sent successfully via Resend API');
      console.log('Email ID:', data?.id);

      // Make sure response is sent
      if (!res.headersSent) {
        res.json({ 
          success: true, 
          message: 'Thank you! Your flight booking request has been submitted successfully.' 
        });
      }
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      console.error('Email error code:', emailError.code);
      console.error('Email error command:', emailError.command);
      console.error('Email error response:', emailError.response);
      console.error('Email error message:', emailError.message);
      console.error('Full error:', JSON.stringify(emailError, Object.getOwnPropertyNames(emailError)));
      
      // Make sure to send a response even if there's an error
      if (!res.headersSent) {
        // Provide more helpful error message based on error type
        let errorMessage = 'There was an error sending your booking request. Please try again later or contact us directly.';
        
        if (emailError.message && emailError.message.includes('domain')) {
          errorMessage = 'Email domain not verified. Please contact the administrator.';
        } else if (emailError.message && (emailError.message.includes('API key') || emailError.message.includes('unauthorized'))) {
          errorMessage = 'Email service configuration error. Please contact the administrator.';
        }
        
        res.status(500).json({ 
          success: false, 
          message: errorMessage,
          error: process.env.NODE_ENV === 'development' ? emailError.message : undefined
        });
      }
    }
  } catch (error) {
    console.error('Unexpected error in /api/book-flight:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Full error:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    
    // Make sure to send a response even if there's an error
    if (!res.headersSent) {
      res.status(500).json({ 
        success: false, 
        message: 'An unexpected error occurred. Please try again later.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    } else {
      console.error('Response already sent, cannot send error response');
    }
  }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    if (!resend) {
      console.error('Email service not configured. RESEND_API_KEY must be set in environment variables');
      console.error('RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
      return res.status(500).json({ 
        success: false, 
        message: 'Email service not configured. Please contact the administrator.' 
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

    // Use Resend API to send email
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'info@cctravels.org';
    const toEmail = to || 'info@cctravels.org';

    console.log('Attempting to send contact email via Resend API...');
    console.log('Email from:', fromEmail);
    console.log('Email to:', toEmail);
    
    try {
      const { data, error } = await resend.emails.send({
        from: `CC Travels <${fromEmail}>`,
        to: [toEmail],
        replyTo: email,
        subject: `Contact Form: ${subject}`,
        text: emailContent,
        html: htmlContent,
      });

      if (error) {
        console.error('Resend API error:', error);
        throw new Error(error.message || 'Failed to send email via Resend');
      }

      console.log('Contact email sent successfully via Resend API');
      console.log('Email ID:', data?.id);

      // Make sure response is sent
      if (!res.headersSent) {
        res.json({ 
          success: true, 
          message: 'Message sent successfully' 
        });
      }
    } catch (emailError) {
      console.error('Error sending contact email:', emailError);
      console.error('Email error message:', emailError.message);
      console.error('Full error:', JSON.stringify(emailError, Object.getOwnPropertyNames(emailError)));
      
      // Make sure to send a response even if there's an error
      if (!res.headersSent) {
        let errorMessage = 'There was an error sending your message. Please try again later or contact us directly.';
        
        if (emailError.message && emailError.message.includes('domain')) {
          errorMessage = 'Email domain not verified. Please contact the administrator.';
        }
        
        res.status(500).json({ 
          success: false, 
          message: errorMessage,
          error: process.env.NODE_ENV === 'development' ? emailError.message : undefined
        });
      }
    }
  } catch (error) {
    console.error('Unexpected error in /api/contact:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Make sure to send a response even if there's an error
    if (!res.headersSent) {
      res.status(500).json({ 
        success: false, 
        message: 'An unexpected error occurred. Please try again later.' 
      });
    } else {
      console.error('Response already sent, cannot send error response');
    }
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Environment check:');
  console.log('- RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✓ Set' : '✗ Not set');
  console.log('- RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL || 'Using default (info@cctravels.org)');
  console.log('- Resend configured:', resend ? '✓ Yes' : '✗ No');
});
