const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    isGuestBooking: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email'
        ]
    },
    phone: {
        type: String,
        required: [true, 'Please provide a phone number'],
        trim: true
    },
    service: {
        type: String,
        required: [true, 'Please select a service'],
        enum: ['Bridal Makeup', 'Mehndi Design', 'Hair Styling', 'Saree Draping', 'Family Package']
    },
    date: {
        type: Date,
        required: [true, 'Please select a date']
    },
    time: {
        type: String,
        required: [true, 'Please select a time']
    },
    additionalInfo: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'canceled'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Booking', BookingSchema); 