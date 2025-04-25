# MongoDB Database Setup Guide

This guide will help you set up and connect to the MongoDB database for the Appointment Booking System.

## Connection Information

### Local MongoDB Connection

If you're running MongoDB locally:

- **Connection String**: `mongodb://localhost:27017/appointment-booking`
- **Database Name**: `appointment-booking`

### MongoDB Compass Connection

To connect using MongoDB Compass:

1. Open MongoDB Compass
2. In the "New Connection" screen, enter the connection string:
   ```
   mongodb://localhost:27017/appointment-booking
   ```
3. Click "Connect"

## Database Initialization

After connecting to MongoDB and setting up the backend, you can initialize the database with test data by running:

```
cd backend
npm run init-db
```

This will:
- Create an admin user
- Create a test user
- Create sample bookings

## Database Structure

The database contains the following collections:

### Users Collection

Stores user information including:
- Name
- Email
- Password (hashed)
- Phone number
- Role (admin/user)

### Bookings Collection

Stores appointment booking information including:
- User reference
- Name
- Email
- Phone
- Service type
- Date
- Time
- Additional information
- Status (pending/confirmed/completed/cancelled)

## Test Accounts

After initialization, the following test accounts will be available:

### Admin Account
- **Email**: admin@example.com
- **Password**: admin123
- **Role**: admin

### User Account
- **Email**: user@example.com
- **Password**: user123
- **Role**: user

## Database Backup

To back up your MongoDB database:

```
mongodump --db appointment-booking --out ./backup
```

## Database Restore

To restore from a backup:

```
mongorestore --db appointment-booking ./backup/appointment-booking
``` 