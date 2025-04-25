# Master setup script for appointment booking system

# Function to check if running as administrator
function Test-Admin {
    $currentUser = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
    return $currentUser.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

# Check if running as admin and elevate if needed
if (-not (Test-Admin)) {
    Write-Host "This script should be run as Administrator for full functionality." -ForegroundColor Yellow
    Write-Host "Some installation steps may fail without admin privileges." -ForegroundColor Yellow
    
    $elevate = Read-Host "Do you want to restart this script with admin privileges? (y/n)"
    if ($elevate -eq 'y' -or $elevate -eq 'Y') {
        # Try to restart script with elevated permissions
        Start-Process PowerShell -Verb RunAs -ArgumentList "-File `"$PSCommandPath`""
        exit
    } else {
        Write-Host "Continuing without admin privileges. Some operations may fail." -ForegroundColor Yellow
    }
}

# Display welcome message
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "    APPOINTMENT BOOKING SYSTEM - COMPLETE SETUP" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "This script will guide you through setting up the entire system:" -ForegroundColor White
Write-Host "1. Check and install Node.js" -ForegroundColor White
Write-Host "2. Check and set up MongoDB" -ForegroundColor White
Write-Host "3. Set up the backend server" -ForegroundColor White
Write-Host ""
Write-Host "You can choose which components to install." -ForegroundColor White
Write-Host ""

# Check Node.js
try {
    $nodeVersion = node -v
    Write-Host "✅ Node.js is already installed: $nodeVersion" -ForegroundColor Green
    $installNode = $false
} catch {
    Write-Host "❌ Node.js is not installed or not in PATH" -ForegroundColor Yellow
    $installNode = $true
}

# Check MongoDB
try {
    $mongoVersion = mongod --version
    Write-Host "✅ MongoDB is already installed" -ForegroundColor Green
    $installMongo = $false
} catch {
    Write-Host "❌ MongoDB is not installed or not in PATH" -ForegroundColor Yellow
    $installMongo = $true
}

# Ask user which components to install/setup
Write-Host ""
Write-Host "Please select which components to install/setup:" -ForegroundColor Cyan
Write-Host ""

if ($installNode) {
    $installNodeAnswer = Read-Host "Install Node.js? (y/n)"
    $installNode = ($installNodeAnswer -eq 'y' -or $installNodeAnswer -eq 'Y')
} else {
    Write-Host "Node.js is already installed, skipping installation."
}

if ($installMongo) {
    # Offer MongoDB options
    Write-Host ""
    Write-Host "For MongoDB, you have two options:" -ForegroundColor Cyan
    Write-Host "1. Install MongoDB locally (recommended for development)" -ForegroundColor White
    Write-Host "2. Use MongoDB Atlas (cloud service, requires sign up)" -ForegroundColor White
    Write-Host ""
    
    $mongoOption = Read-Host "Choose MongoDB option (1 or 2)"
    
    if ($mongoOption -eq "1") {
        $installMongoLocally = $true
        $useMongoAtlas = $false
    } elseif ($mongoOption -eq "2") {
        $installMongoLocally = $false
        $useMongoAtlas = $true
    } else {
        Write-Host "Invalid option. Defaulting to local MongoDB installation." -ForegroundColor Yellow
        $installMongoLocally = $true
        $useMongoAtlas = $false
    }
} else {
    Write-Host "MongoDB is already installed, skipping installation."
    $installMongoLocally = $false
    $useMongoAtlas = $false
}

$setupBackend = Read-Host "Set up the backend server? (y/n)"
$setupBackend = ($setupBackend -eq 'y' -or $setupBackend -eq 'Y')

# Execute installations based on user choices
if ($installNode) {
    Write-Host ""
    Write-Host "Installing Node.js..." -ForegroundColor Cyan
    & "$PSScriptRoot\install-nodejs.ps1"
    
    # Check if Node.js installation was successful
    try {
        $nodeVersion = node -v
        Write-Host "✅ Node.js installation successful: $nodeVersion" -ForegroundColor Green
    } catch {
        Write-Host "❌ Node.js installation may have failed. Please check and try installing manually." -ForegroundColor Red
        Write-Host "Download from: https://nodejs.org/" -ForegroundColor Yellow
    }
}

if ($installMongoLocally) {
    Write-Host ""
    Write-Host "Installing MongoDB locally..." -ForegroundColor Cyan
    & "$PSScriptRoot\install-mongodb.ps1"
    
    # Check if MongoDB installation was successful
    try {
        $mongoVersion = mongod --version
        Write-Host "✅ MongoDB installation successful" -ForegroundColor Green
    } catch {
        Write-Host "❌ MongoDB installation may have failed. Please check and try installing manually." -ForegroundColor Red
        Write-Host "Download from: https://www.mongodb.com/try/download/community" -ForegroundColor Yellow
    }
} elseif ($useMongoAtlas) {
    Write-Host ""
    Write-Host "MongoDB Atlas Setup Guide:" -ForegroundColor Cyan
    Write-Host "1. Go to https://www.mongodb.com/cloud/atlas/register to create a free account" -ForegroundColor White
    Write-Host "2. Create a new cluster (the free tier is sufficient)" -ForegroundColor White
    Write-Host "3. Create a database user with password" -ForegroundColor White
    Write-Host "4. Set up network access (allow access from anywhere for development)" -ForegroundColor White
    Write-Host "5. Get your connection string from the 'Connect' button" -ForegroundColor White
    Write-Host ""
    
    $useAtlas = Read-Host "Have you completed these steps and have your MongoDB Atlas connection string? (y/n)"
    
    if ($useAtlas -eq 'y' -or $useAtlas -eq 'Y') {
        $atlasConnString = Read-Host "Enter your MongoDB Atlas connection string (e.g., mongodb+srv://username:password@cluster0.mongodb.net/appointment-booking)"
        
        # Update .env file with MongoDB Atlas connection string
        $envFile = "$PSScriptRoot\backend\.env"
        if (Test-Path $envFile) {
            $envContent = Get-Content $envFile
            $updated = $false
            
            $newContent = $envContent | ForEach-Object {
                if ($_ -match "MONGO_URI=") {
                    $updated = $true
                    "MONGO_URI=$atlasConnString"
                } else {
                    $_
                }
            }
            
            if ($updated) {
                $newContent | Set-Content $envFile
                Write-Host "✅ Updated .env file with MongoDB Atlas connection string" -ForegroundColor Green
            }
        } else {
            Write-Host "❌ Could not find .env file to update" -ForegroundColor Red
        }
    } else {
        Write-Host "Please complete the MongoDB Atlas setup before continuing with the backend setup." -ForegroundColor Yellow
    }
}

if ($setupBackend) {
    Write-Host ""
    Write-Host "Setting up the backend server..." -ForegroundColor Cyan
    & "$PSScriptRoot\setup-backend.ps1"
}

Write-Host ""
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "            SETUP PROCESS COMPLETED" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor White
Write-Host "1. Make sure MongoDB is running" -ForegroundColor White
Write-Host "2. Navigate to the backend directory: cd backend" -ForegroundColor White
Write-Host "3. Start the backend server: npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "If you encounter any issues, please refer to the SETUP.md" -ForegroundColor White
Write-Host "and README.md files for troubleshooting." -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to exit" 