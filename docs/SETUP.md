# Backend Setup Guide

This guide will help you set up the backend for the Appointment Booking application.

## Prerequisites

1. **Node.js and npm**
   - Download and install Node.js (v14 or later) from [nodejs.org](https://nodejs.org/)
   - Make sure to check the option to add Node.js to your PATH during installation

2. **MongoDB**
   - Option A: Install MongoDB Community Edition locally
     - Download from [mongodb.com](https://www.mongodb.com/try/download/community)
     - Follow installation instructions for your OS
     - Start the MongoDB service
   
   - Option B: Use MongoDB Atlas (cloud)
     - Sign up for a free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
     - Create a new cluster
     - Create a database user
     - Get your connection string

## Step-by-Step Setup

1. **Install Node.js**
   - After installation, verify it's working by opening Command Prompt or PowerShell
   - Run `node -v` - should display the Node.js version
   - Run `npm -v` - should display the npm version

2. **Setup MongoDB**
   - If using local MongoDB:
     - Start the MongoDB service (should start automatically after installation)
     - The default connection string will be `mongodb://localhost:27017/appointment-booking`
   
   - If using MongoDB Atlas:
     - Get your connection string from Atlas dashboard
     - It will look like: `mongodb+srv://username:password@cluster0.mongodb.net/appointment-booking`

3. **Configure Environment Variables**
   - In the backend folder, check if `.env` file exists
   - If not, copy `.env.example` to `.env`
   - Update `MONGO_URI` with your MongoDB connection string
   - Update `JWT_SECRET` with a secure random string

4. **Install Dependencies**
   - Open Command Prompt or PowerShell
   - Navigate to the backend folder: `cd path\to\project\backend`
   - Run: `npm install`
   - This will install all required packages

5. **Start the Server**
   - In the backend folder, run: `npm run dev`
   - You should see a message that the server is running
   - You should also see a message that MongoDB is connected

## Testing the API

Once the server is running, you can test the API endpoints:

1. Use Postman or any API testing tool
2. Test the registration endpoint:
   - Method: POST
   - URL: http://localhost:5000/api/auth/register
   - Body (JSON):
   ```json
   {
     "name": "Test User",
     "email": "test@example.com",
     "password": "password123",
     "phone": "1234567890"
   }
   ```

3. Test the login endpoint:
   - Method: POST
   - URL: http://localhost:5000/api/auth/login
   - Body (JSON):
   ```json
   {
     "email": "test@example.com",
     "password": "password123"
   }
   ```

## Troubleshooting

- **Node.js not recognized**: Make sure Node.js is installed and added to your PATH
- **MongoDB connection error**: Check your connection string and make sure MongoDB is running
- **Port already in use**: Change the PORT value in your .env file
- **npm install fails**: Check your internet connection and try again 