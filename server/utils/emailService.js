const nodemailer = require('nodemailer');

/**
 * Email Service for sending various notifications
 */
class EmailService {
    constructor() {
        // Create transporter with environment variables
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: process.env.EMAIL_PORT || 587,
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER, // Studio email address
                pass: process.env.EMAIL_PASS, // App password or regular password
            },
        });

        // Sender email (from address)
        this.senderEmail = process.env.EMAIL_FROM || 'studio@example.com';
        this.senderName = process.env.EMAIL_FROM_NAME || 'New Real Bridal Studio';
        
        // Admin email for notifications
        this.adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    }

    /**
     * Send booking confirmation email to customer
     * @param {Object} booking - Booking data
     * @returns {Promise} - Email send result
     */
    async sendBookingConfirmation(booking) {
        const { name, email, service, date, time, phone } = booking;

        // Format date for display
        const formattedDate = new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const mailOptions = {
            from: `"${this.senderName}" <${this.senderEmail}>`,
            to: email,
            subject: 'Booking Confirmation - New Real Bridal Studio',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 5px; color: #333;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h2 style="color: #f178b6;">New Real Bridal Studio</h2>
                        <p style="font-size: 18px; font-weight: bold;">Booking Confirmation</p>
                    </div>
                    
                    <p>Dear ${name},</p>
                    
                    <p>Thank you for booking an appointment with New Real Bridal Studio. We're excited to help you prepare for your special day!</p>
                    
                    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #f178b6;">Booking Details:</h3>
                        <p><strong>Service:</strong> ${service}</p>
                        <p><strong>Date:</strong> ${formattedDate}</p>
                        <p><strong>Time:</strong> ${time}</p>
                        <p><strong>Booking Reference:</strong> ${booking._id}</p>
                    </div>
                    
                    <p>If you need to make any changes to your booking, please contact us at least 24 hours before your appointment.</p>
                    
                    <p>Contact Information:</p>
                    <ul>
                        <li>Phone: +91-9925381942</li>
                        <li>Email: contact@Newrealbridalstudio.com</li>
                        <li>Address: New Real Bridal Studio, Surat, Gujarat, 395006</li>
                    </ul>
                    
                    <p>We look forward to seeing you!</p>
                    
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #777;">
                        <p>This is an automated email. Please do not reply directly to this message.</p>
                    </div>
                </div>
            `
        };

        return this.transporter.sendMail(mailOptions);
    }

    /**
     * Send booking notification to admin
     * @param {Object} booking - Booking data
     * @returns {Promise} - Email send result
     */
    async sendAdminNotification(booking) {
        const { name, email, service, date, time, phone, additionalInfo, isGuestBooking } = booking;

        // Format date for display
        const formattedDate = new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const mailOptions = {
            from: `"${this.senderName}" <${this.senderEmail}>`,
            to: this.adminEmail,
            subject: `New Booking: ${service} for ${name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 5px; color: #333;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h2 style="color: #f178b6;">New Real Bridal Studio</h2>
                        <p style="font-size: 18px; font-weight: bold;">New Booking Alert</p>
                    </div>
                    
                    <p>A new booking has been made with the following details:</p>
                    
                    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #f178b6;">Booking Details:</h3>
                        <p><strong>Customer:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Phone:</strong> ${phone}</p>
                        <p><strong>Service:</strong> ${service}</p>
                        <p><strong>Date:</strong> ${formattedDate}</p>
                        <p><strong>Time:</strong> ${time}</p>
                        <p><strong>Booking Type:</strong> ${isGuestBooking ? 'Guest Booking' : 'Registered User'}</p>
                        <p><strong>Booking ID:</strong> ${booking._id}</p>
                        ${additionalInfo ? `<p><strong>Additional Info:</strong> ${additionalInfo}</p>` : ''}
                    </div>
                    
                    <p>Please review and confirm this appointment at your earliest convenience.</p>
                    
                    <p>You can manage this booking in the admin dashboard.</p>
                </div>
            `
        };

        return this.transporter.sendMail(mailOptions);
    }
}

module.exports = new EmailService(); 