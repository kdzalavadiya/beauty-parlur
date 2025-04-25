const Booking = require('../models/Booking');
const emailService = require('../utils/emailService');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
    try {
        // Add user to req.body
        req.body.user = req.user.id;

        const booking = await Booking.create(req.body);

        // Send email confirmation to customer
        try {
            await emailService.sendBookingConfirmation(booking);
            console.log(`Booking confirmation email sent to ${booking.email}`);
        } catch (emailError) {
            console.error('Failed to send booking confirmation email:', emailError);
        }

        // Send notification to admin
        try {
            await emailService.sendAdminNotification(booking);
            console.log('Admin notification email sent');
        } catch (emailError) {
            console.error('Failed to send admin notification email:', emailError);
        }

        res.status(201).json({
            success: true,
            data: booking
        });
    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private (Admin)
exports.getBookings = async (req, res) => {
    try {
        // If user is admin, get all bookings, otherwise get only user's bookings
        let query;
        if (req.user.role === 'admin') {
            query = Booking.find().populate({
                path: 'user',
                select: 'name email'
            });
        } else {
            query = Booking.find({ user: req.user.id });
        }

        const bookings = await query;

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'No booking found with that ID'
            });
        }

        // Make sure user is booking owner or admin
        if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this booking'
            });
        }

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private
exports.updateBooking = async (req, res) => {
    try {
        let booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'No booking found with that ID'
            });
        }

        // Make sure user is booking owner or admin
        if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to update this booking'
            });
        }

        const oldStatus = booking.status;
        booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        // If status changed to confirmed, send an email notification
        if (oldStatus !== 'confirmed' && booking.status === 'confirmed') {
            try {
                await emailService.sendBookingConfirmation(booking);
                console.log(`Booking confirmation email sent to ${booking.email}`);
            } catch (emailError) {
                console.error('Failed to send booking confirmation email:', emailError);
            }
        }

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private
exports.deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'No booking found with that ID'
            });
        }

        // Make sure user is booking owner or admin
        if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to delete this booking'
            });
        }

        await booking.remove();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Create new booking as guest (no auth)
// @route   POST /api/bookings/guest
// @access  Public
exports.createGuestBooking = async (req, res) => {
    try {
        // Validate required fields for guest booking
        const { name, email, phone, service, date, time } = req.body;
        
        if (!name || !email || !phone || !service || !date || !time) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields: name, email, phone, service, date, and time'
            });
        }
        
        // Create a booking without user reference
        const booking = await Booking.create({
            ...req.body,
            status: 'pending',
            // No user field needed since this is a guest booking
            isGuestBooking: true // Optional: flag to indicate this is a guest booking
        });

        // Send email confirmation to customer
        try {
            await emailService.sendBookingConfirmation(booking);
            console.log(`Booking confirmation email sent to ${booking.email}`);
        } catch (emailError) {
            console.error('Failed to send booking confirmation email:', emailError);
        }

        // Send notification to admin
        try {
            await emailService.sendAdminNotification(booking);
            console.log('Admin notification email sent');
        } catch (emailError) {
            console.error('Failed to send admin notification email:', emailError);
        }

        res.status(201).json({
            success: true,
            data: booking
        });
    } catch (error) {
        console.error('Guest booking error:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
}; 