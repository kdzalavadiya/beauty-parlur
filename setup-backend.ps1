# PowerShell script to set up and start the backend server

Write-Host "Appointment Booking Backend Setup" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node -v
    Write-Host "Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js is not installed or not in PATH." -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    Write-Host "After installation, close this window and run the script again." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit
}

# Navigate to backend directory
Set-Location -Path ".\backend"
Write-Host "Changed directory to backend folder" -ForegroundColor Green

# Setup backend dependencies and environmental configs
Write-Host "Setting up backend dependencies..." -ForegroundColor Green

# Create .env file if it doesn't exist
if (-not (Test-Path ./.env)) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    @"
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/bridal-studio

# JWT
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
EMAIL_FROM_NAME=New Real Bridal Studio
ADMIN_EMAIL=admin@example.com
"@ | Out-File -FilePath ./.env -Encoding ASCII
    Write-Host ".env file created successfully!" -ForegroundColor Green
}
else {
    Write-Host ".env file already exists. Skipping creation." -ForegroundColor Yellow
}

# Check if npm is installed
if (Get-Command npm -ErrorAction SilentlyContinue) {
    Write-Host "Installing backend dependencies with npm..." -ForegroundColor Yellow
    npm install express mongoose bcryptjs jsonwebtoken cookie-parser dotenv cors express-validator nodemailer
    Write-Host "Backend dependencies installed successfully!" -ForegroundColor Green
}
else {
    Write-Host "npm is not installed or not in PATH. Please install Node.js and npm first." -ForegroundColor Red
    exit 1
}

# Create scripts directory if it doesn't exist
if (-not (Test-Path ./scripts)) {
    Write-Host "Creating scripts directory..." -ForegroundColor Yellow
    New-Item -Path ./scripts -ItemType Directory
    Write-Host "Scripts directory created successfully!" -ForegroundColor Green
}

# Output success message
Write-Host "`nBackend setup completed successfully!`nStart the server with 'npm run dev' or 'node server/server.js'" -ForegroundColor Cyan

# Start the server
Write-Host "Starting the backend server..." -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
npm run dev 