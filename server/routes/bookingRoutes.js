const express = require('express');
const router = express.Router();
const { 
    createBooking, 
    getBookings, 
    getBooking, 
    updateBooking, 
    deleteBooking,
    createGuestBooking 
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

// Guest booking route - no auth required
router.post('/guest', createGuestBooking);

// Booking routes
router.route('/')
    .post(protect, createBooking)
    .get(protect, getBookings);

router.route('/:id')
    .get(protect, getBooking)
    .put(protect, updateBooking)
    .delete(protect, deleteBooking);

module.exports = router; 