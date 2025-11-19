import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const bookingData = await request.json();

    // Configure email transporter
    // For Gmail: Enable 2-step verification and create an App Password
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASSWORD, // Your Gmail App Password
      },
    });

    // Email HTML template
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
          .booking-id { background: #667eea; color: white; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; border-radius: 8px; margin: 20px 0; }
          .details-table { width: 100%; background: white; border-radius: 8px; overflow: hidden; margin: 20px 0; }
          .details-table tr { border-bottom: 1px solid #e5e7eb; }
          .details-table tr:last-child { border-bottom: none; }
          .details-table td { padding: 12px 15px; }
          .details-table td:first-child { font-weight: 600; color: #667eea; width: 40%; }
          .footer { background: #374151; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 14px; }
          .badge { display: inline-block; background: #10b981; color: white; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">🎉 Booking Confirmed!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Your eco-friendly stay at WAKENS</p>
          </div>
          
          <div class="content">
            <div class="booking-id">
              Booking ID: ${bookingData.bookingId}
            </div>
            
            <p>Dear <strong>${bookingData.name}</strong>,</p>
            <p>Thank you for choosing an eco-friendly stay with us! Your booking has been successfully confirmed.</p>
            
            <h3 style="color: #667eea; margin-top: 30px;">📋 Booking Details</h3>
            <table class="details-table">
              <tr>
                <td>Hotel</td>
                <td>${bookingData.hotelName}</td>
              </tr>
              <tr>
                <td>Room</td>
                <td>${bookingData.roomName}</td>
              </tr>
              <tr>
                <td>Check-in</td>
                <td>${new Date(bookingData.checkIn).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
              </tr>
              <tr>
                <td>Check-out</td>
                <td>${new Date(bookingData.checkOut).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
              </tr>
              <tr>
                <td>Guests</td>
                <td>${bookingData.guests} Guest${bookingData.guests > 1 ? 's' : ''}</td>
              </tr>
            </table>

            <h3 style="color: #667eea; margin-top: 30px;">👤 Guest Information</h3>
            <table class="details-table">
              <tr>
                <td>Name</td>
                <td>${bookingData.name}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>${bookingData.email}</td>
              </tr>
              <tr>
                <td>Phone</td>
                <td>${bookingData.phone}</td>
              </tr>
            </table>

            <h3 style="color: #667eea; margin-top: 30px;">💳 Payment Details</h3>
            <table class="details-table">
              <tr>
                <td>Payment Method</td>
                <td><span class="badge">${bookingData.paymentMethod}</span></td>
              </tr>
              <tr>
                <td>Total Amount</td>
                <td style="font-size: 20px; font-weight: bold; color: #667eea;">₹${bookingData.totalPrice.toLocaleString()}</td>
              </tr>
              <tr>
                <td>Payment Status</td>
                <td><span class="badge">PAID</span></td>
              </tr>
            </table>

            <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; margin: 30px 0; border-radius: 4px;">
              <h4 style="margin: 0 0 10px 0; color: #059669;">🌱 Environmental Benefits</h4>
              <p style="margin: 0; color: #065f46; font-size: 14px;">
                By staying with us, you're supporting sustainable tourism! This property features:
                <br>• Live air quality monitoring
                <br>• Solar power and smart automation
                <br>• Rainwater harvesting and filtered water
                <br>• Eco-friendly amenities
              </p>
            </div>

            <h3 style="color: #667eea; margin-top: 30px;">📱 What's Next?</h3>
            <ul style="color: #4b5563;">
              <li>Keep this email for your records</li>
              <li>Bring a valid photo ID at check-in</li>
              <li>View live environmental metrics for your room on our website</li>
              <li>Contact us anytime for assistance</li>
            </ul>

            <div style="text-align: center; margin-top: 30px;">
              <a href="http://localhost:3000/room/${bookingData.roomId}/metrics" 
                 style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                View Live Room Metrics
              </a>
            </div>
          </div>

          <div class="footer">
            <p style="margin: 0 0 10px 0;"><strong>WAKENS - Eco-Friendly Stays</strong></p>
            <p style="margin: 0; opacity: 0.8; font-size: 12px;">
              Erode, Tamil Nadu | 3D Previews & Environmental Monitoring
            </p>
            <p style="margin: 15px 0 0 0; font-size: 12px; opacity: 0.7;">
              Need help? Contact us at support@wakens.com or call +91 98765 43210
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email
    const mailOptions = {
      from: `"WAKENS Hotel Booking" <${process.env.EMAIL_USER}>`,
      to: bookingData.email,
      subject: `Booking Confirmed - ${bookingData.bookingId} - ${bookingData.hotelName}`,
      html: emailHtml,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ 
      success: true, 
      message: 'Booking confirmation email sent successfully' 
    });

  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to send email',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
