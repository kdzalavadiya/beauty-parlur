const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        // Support both MONGODB_URI and MONGO_URI for compatibility
        const uri = process.env.MONGODB_URI  || 'mongodb://localhost:27017/appointment-booking';
        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected With ${uri} on: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB; 