# Appointment Booking Application

A full-stack web application for managing appointments and bookings.

## Features

- User authentication (register, login, logout)
- User role-based authorization (admin, user)
- Appointment booking system
- Booking management (create, read, update, delete)
- Admin dashboard for managing all bookings
- User dashboard for managing personal bookings

## Tech Stack

### Backend
- Node.js & Express.js
- MongoDB & Mongoose
- JWT Authentication
- RESTful API

### Frontend
- React.js
- Context API for state management
- React Router for navigation
- Styled Components for styling

## Installation & Setup

### Prerequisites
- Node.js (v14 or later)
- MongoDB

### Backend Setup
1. Navigate to the backend directory
   ```
   cd backend
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example`
   ```
   cp .env.example .env
   ```

4. Update the environment variables in the `.env` file

5. Start the development server
   ```
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory
   ```
   cd frontend
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/logout` - Logout a user
- `GET /api/auth/me` - Get current logged-in user

### Bookings
- `GET /api/bookings` - Get all bookings (admin) or user's bookings
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings/:id` - Get a single booking
- `PUT /api/bookings/:id` - Update a booking
- `DELETE /api/bookings/:id` - Delete a booking

## License

MIT 