# Email Setup Guide - Booking Confirmations

Complete guide for configuring automatic email confirmations for hotel bookings.

---

## 📧 Email Feature Overview

When a guest completes a booking and selects a payment method, the system automatically sends a beautifully formatted confirmation email containing:

- Booking ID and confirmation details
- Hotel and room information
- Check-in/check-out dates
- Guest information
- Payment details
- Environmental benefits information
- Link to view live room metrics

---

## 🔧 Setup Instructions

### Option 1: Gmail (Recommended for Testing)

#### Step 1: Enable 2-Step Verification

1. Go to your Google Account: https://myaccount.google.com/
2. Select **Security** from the left menu
3. Under "Signing in to Google", click **2-Step Verification**
4. Follow the steps to enable it

#### Step 2: Generate App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Sign in if prompted
3. Under "Select app", choose **Mail**
4. Under "Select device", choose **Other (Custom name)**
5. Enter name: `WAKENS Hotel Booking`
6. Click **Generate**
7. Copy the 16-character password (format: `xxxx xxxx xxxx xxxx`)

#### Step 3: Configure Environment Variables

Create or update `d:\Hari\Hari\.env.local`:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
```

Replace:
- `your-email@gmail.com` with your actual Gmail address
- `xxxx xxxx xxxx xxxx` with the App Password you generated

#### Step 4: Restart Development Server

```powershell
# Stop current server (Ctrl+C)
npm run dev
```

---

### Option 2: Other Email Providers

#### Outlook/Hotmail

```javascript
// In app/api/send-booking-email/route.ts, change:
service: 'outlook',
auth: {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASSWORD,
},
```

#### Custom SMTP Server

```javascript
// Replace the transporter configuration with:
const transporter = nodemailer.createTransport({
  host: 'smtp.yourprovider.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
```

---

## 🧪 Testing

### 1. Complete a Test Booking

1. Start dev server: `npm run dev`
2. Navigate to: http://localhost:3000
3. Select a hotel and room
4. Click "Book Now"
5. Fill in booking form with **your real email address**
6. Complete payment selection
7. Check your email inbox

### 2. Check Server Logs

Watch the terminal for:
```
✓ Booking confirmation email sent successfully
```

Or if there's an error:
```
✗ Email send error: [error details]
```

### 3. Email Delivery Time

- Gmail: Usually instant (within 5-10 seconds)
- Other providers: May take up to 1 minute

---

## 📋 Email Template Preview

The confirmation email includes:

**Header Section:**
- Colorful gradient header with "Booking Confirmed!" message
- WAKENS branding

**Booking ID:**
- Large, prominent booking reference number

**Details Tables:**
- Hotel and room information
- Check-in/check-out dates with full date formatting
- Number of guests
- Guest contact information
- Payment method with status badge
- Total amount paid

**Environmental Benefits:**
- Highlighted section explaining eco-friendly features

**Call-to-Action:**
- Button linking to live room metrics dashboard

**Footer:**
- Contact information
- Support details

---

## 🛠️ Customization

### Change Email Template

Edit `app/api/send-booking-email/route.ts`:

```javascript
const emailHtml = `
  // Modify HTML template here
  // Use inline CSS for best email client compatibility
`;
```

### Update From Name

```javascript
from: `"Your Hotel Name" <${process.env.EMAIL_USER}>`,
```

### Add Attachments (e.g., PDF Receipt)

```javascript
const mailOptions = {
  // ...existing options
  attachments: [
    {
      filename: 'booking-receipt.pdf',
      content: pdfBuffer, // Buffer containing PDF
    }
  ],
};
```

### Change Email Subject

```javascript
subject: `Your Custom Subject - ${bookingData.bookingId}`,
```

---

## 🔒 Security Best Practices

### 1. Protect Environment Variables

✅ **DO:**
- Keep `.env.local` in `.gitignore`
- Use different credentials for production
- Rotate App Passwords regularly

❌ **DON'T:**
- Commit `.env.local` to Git
- Share App Passwords
- Use your actual Gmail password

### 2. Production Deployment

For production (Vercel/Netlify):

1. Add environment variables in dashboard:
   - `EMAIL_USER`
   - `EMAIL_PASSWORD`

2. Use a dedicated email service:
   - **SendGrid** (Recommended)
   - **AWS SES**
   - **Mailgun**
   - **Postmark**

Example with SendGrid:

```javascript
// Install: npm install @sendgrid/mail
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: bookingData.email,
  from: 'bookings@yourdomain.com', // Use your verified domain
  subject: `Booking Confirmed - ${bookingData.bookingId}`,
  html: emailHtml,
};

await sgMail.send(msg);
```

---

## 🐛 Troubleshooting

### Issue: Email Not Sending

**Check 1: Environment Variables**
```powershell
# Verify variables are loaded
# Add this temporarily to route.ts:
console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Not set');
```

**Check 2: App Password**
- Ensure no spaces in password in `.env.local`
- Regenerate App Password if needed

**Check 3: Gmail Security**
- Verify 2-Step Verification is enabled
- Check Gmail "Less secure app access" (should be OFF, use App Password instead)

---

### Issue: Email Goes to Spam

**Solutions:**
1. **Add to Safe Senders**: Have recipients add your email to contacts
2. **Use Custom Domain**: Set up SPF/DKIM records
3. **Professional Email Service**: Use SendGrid/AWS SES for production
4. **Improve Content**: Avoid spam trigger words

---

### Issue: "Invalid Login" Error

**Causes:**
- Wrong App Password
- 2-Step Verification not enabled
- Using regular Gmail password instead of App Password

**Solution:**
1. Delete old App Password in Google Account settings
2. Generate new App Password
3. Update `.env.local`
4. Restart dev server

---

### Issue: Email Sends But Has Wrong Content

**Check:**
- `bookingData` object structure in `BookingForm.tsx`
- Template variables in email HTML
- Data formatting (dates, prices, etc.)

**Debug:**
```javascript
// In route.ts, before sending:
console.log('Booking Data:', bookingData);
```

---

## 📊 Email Analytics (Optional)

Track email opens and clicks:

### With SendGrid:
```javascript
const msg = {
  // ...other options
  trackingSettings: {
    clickTracking: { enable: true },
    openTracking: { enable: true },
  },
};
```

### With Custom Tracking:
Add tracking pixel to HTML:
```html
<img src="https://yourapi.com/track/open/${bookingId}" width="1" height="1" />
```

---

## 🌐 Multi-Language Support

For sending emails in different languages:

```javascript
// Detect user's preferred language
const language = bookingData.language || 'en';

const templates = {
  en: { subject: 'Booking Confirmed', greeting: 'Dear' },
  hi: { subject: 'बुकिंग की पुष्टि', greeting: 'प्रिय' },
  ta: { subject: 'முன்பதிவு உறுதி', greeting: 'அன்புள்ள' },
};

const t = templates[language];
```

---

## 📞 Support

**Email not working?**
1. Check terminal logs for errors
2. Verify `.env.local` configuration
3. Test with a simple email first
4. Review Gmail App Password settings

**Production issues?**
1. Check deployment platform environment variables
2. Review email service provider status
3. Check rate limits

---

## 🚀 Advanced Features

### 1. Email Queue System

For high-volume bookings, use a queue:

```bash
npm install bull redis
```

### 2. Email Templates Engine

Use Handlebars for better template management:

```bash
npm install handlebars
```

### 3. Scheduled Reminders

Send reminder emails before check-in:

```javascript
// Create a cron job or use Vercel Cron Jobs
// Send reminder 1 day before check-in
```

### 4. Email Notifications for Admin

CC or BCC admin on all bookings:

```javascript
const mailOptions = {
  // ...
  bcc: 'admin@wakens.com',
};
```

---

## ✅ Quick Checklist

Before going live:

- [ ] Gmail App Password generated
- [ ] `.env.local` configured correctly
- [ ] Email sending successfully in development
- [ ] Email template looks good in Gmail, Outlook, and mobile
- [ ] Proper error handling implemented
- [ ] Production email service configured (SendGrid/AWS SES)
- [ ] Environment variables set in deployment platform
- [ ] Tested with multiple email providers
- [ ] From address uses verified domain (production)
- [ ] Spam score checked (use mail-tester.com)

---

**Happy Emailing! 📧**
