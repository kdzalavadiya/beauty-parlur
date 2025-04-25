# PowerShell script to check for and download MongoDB

# Define MongoDB version to download
$mongoVersion = "6.0.8"
$architecture = "x64"

# Define download URLs and paths
$mongoUrl = "https://fastdl.mongodb.org/windows/mongodb-windows-$architecture-$mongoVersion-signed.msi"
$downloadPath = "$env:TEMP\mongodb-installer.msi"
$mongoInstallDir = "C:\Program Files\MongoDB\Server\6.0"
$mongoDataDir = "C:\data\db"
$mongoConfigDir = "C:\Program Files\MongoDB\Server\6.0\bin\mongod.cfg"
$mongoLogDir = "C:\data\log"

Write-Host "MongoDB Installation Helper" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host ""

# Check if MongoDB is already installed
try {
    $existingMongoDB = mongod --version
    Write-Host "MongoDB is already installed:" -ForegroundColor Green
    Write-Host $existingMongoDB -ForegroundColor Green
    Write-Host "No need to install."
    
    $proceed = Read-Host "Do you want to proceed with the backend setup anyway? (y/n)"
    if ($proceed -eq 'y' -or $proceed -eq 'Y') {
        Write-Host "Starting backend setup script..." -ForegroundColor Green
        & "$PSScriptRoot\setup-backend.ps1"
    } else {
        Write-Host "Exiting script..."
    }
    
    exit 0
} catch {
    Write-Host "MongoDB is not installed or not in PATH." -ForegroundColor Yellow
    Write-Host "Will attempt to download and install MongoDB v$mongoVersion" -ForegroundColor Cyan
}

# Function to check if running as administrator
function Test-Admin {
    $currentUser = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
    return $currentUser.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

# Check if running as admin
if (-not (Test-Admin)) {
    Write-Host "This script needs to be run as Administrator to install MongoDB." -ForegroundColor Red
    Write-Host "Please right-click on the PowerShell icon and select 'Run as Administrator'" -ForegroundColor Yellow
    
    $elevate = Read-Host "Do you want to try to elevate this script now? (y/n)"
    if ($elevate -eq 'y' -or $elevate -eq 'Y') {
        # Try to restart script with elevated permissions
        Start-Process PowerShell -Verb RunAs -ArgumentList "-File `"$PSCommandPath`""
        exit
    } else {
        Write-Host "Installation cancelled. Please run as Administrator to install MongoDB." -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

# Download MongoDB installer
Write-Host "Downloading MongoDB installer (this may take a while)..." -ForegroundColor Cyan
try {
    # Create a new WebClient and specify TLS 1.2
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    $webClient = New-Object System.Net.WebClient
    $webClient.DownloadFile($mongoUrl, $downloadPath)
    Write-Host "Download completed successfully" -ForegroundColor Green
} catch {
    Write-Host "Failed to download MongoDB: $_.Exception.Message" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Install MongoDB
Write-Host "Installing MongoDB..." -ForegroundColor Cyan
try {
    $arguments = "/i `"$downloadPath`" /quiet /norestart INSTALLLOCATION=`"$mongoInstallDir`" ADDLOCAL=`"all`""
    Start-Process -FilePath "msiexec.exe" -ArgumentList $arguments -Wait
    Write-Host "MongoDB installation completed" -ForegroundColor Green
} catch {
    Write-Host "Failed to install MongoDB: $_.Exception.Message" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Clean up the downloaded installer
Remove-Item $downloadPath

# Create data directory if it doesn't exist
if (-not (Test-Path -Path $mongoDataDir)) {
    Write-Host "Creating MongoDB data directory..." -ForegroundColor Cyan
    New-Item -ItemType Directory -Path $mongoDataDir -Force | Out-Null
    Write-Host "Data directory created" -ForegroundColor Green
} else {
    Write-Host "MongoDB data directory already exists" -ForegroundColor Green
}

# Create log directory if it doesn't exist
if (-not (Test-Path -Path $mongoLogDir)) {
    Write-Host "Creating MongoDB log directory..." -ForegroundColor Cyan
    New-Item -ItemType Directory -Path $mongoLogDir -Force | Out-Null
    Write-Host "Log directory created" -ForegroundColor Green
} else {
    Write-Host "MongoDB log directory already exists" -ForegroundColor Green
}

# Update PATH environment variable to include MongoDB
Write-Host "Updating PATH environment variable..." -ForegroundColor Cyan
$mongoPath = "$mongoInstallDir\bin"
$env:Path = "$env:Path;$mongoPath"
[Environment]::SetEnvironmentVariable("Path", $env:Path, [EnvironmentVariableTarget]::Machine)
Write-Host "PATH updated" -ForegroundColor Green

# Refresh the PATH in the current session
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Create MongoDB configuration file
Write-Host "Creating MongoDB configuration file..." -ForegroundColor Cyan
$configContent = @"
# mongod.conf

# where to write logging data
systemLog:
  destination: file
  logAppend: true
  path: $($mongoLogDir -replace '\\', '/')/mongod.log

# Where and how to store data
storage:
  dbPath: $($mongoDataDir -replace '\\', '/')
  journal:
    enabled: true

# network interfaces
net:
  port: 27017
  bindIp: 127.0.0.1
"@

try {
    if (-not (Test-Path -Path "$mongoInstallDir\bin")) {
        New-Item -ItemType Directory -Path "$mongoInstallDir\bin" -Force | Out-Null
    }
    $configContent | Out-File -FilePath $mongoConfigDir -Encoding ASCII
    Write-Host "Configuration file created" -ForegroundColor Green
} catch {
    Write-Host "Failed to create MongoDB configuration file: $_.Exception.Message" -ForegroundColor Red
}

# Create MongoDB Windows Service
Write-Host "Installing MongoDB as a Windows service..." -ForegroundColor Cyan
try {
    & "$mongoInstallDir\bin\mongod.exe" --config "$mongoConfigDir" --install
    Write-Host "MongoDB service installed" -ForegroundColor Green
    
    # Start the MongoDB service
    Start-Service MongoDB
    Write-Host "MongoDB service started" -ForegroundColor Green
} catch {
    Write-Host "Failed to install MongoDB as a service: $_.Exception.Message" -ForegroundColor Red
    Write-Host "You'll need to manually start MongoDB using: mongod --dbpath $mongoDataDir" -ForegroundColor Yellow
}

# Verify installation
Write-Host "Verifying MongoDB installation..." -ForegroundColor Cyan
try {
    $mongoVersion = & "$mongoInstallDir\bin\mongod.exe" --version
    Write-Host "MongoDB installed successfully:" -ForegroundColor Green
    Write-Host $mongoVersion -ForegroundColor Green
    
    Write-Host "MongoDB is now running as a Windows service on port 27017." -ForegroundColor Green
    Write-Host "Connection string for local development: mongodb://localhost:27017" -ForegroundColor Green
    
    # Update .env file with MongoDB connection string
    $envFile = "$PSScriptRoot\backend\.env"
    if (Test-Path $envFile) {
        $envContent = Get-Content $envFile
        $updated = $false
        
        $newContent = $envContent | ForEach-Object {
            if ($_ -match "MONGO_URI=") {
                $updated = $true
                "MONGO_URI=mongodb://localhost:27017/appointment-booking"
            } else {
                $_
            }
        }
        
        if ($updated) {
            $newContent | Set-Content $envFile
            Write-Host "Updated .env file with local MongoDB connection string" -ForegroundColor Green
        }
    }
    
    $setupBackend = Read-Host "Do you want to set up the backend now? (y/n)"
    if ($setupBackend -eq 'y' -or $setupBackend -eq 'Y') {
        Write-Host "Starting backend setup script..." -ForegroundColor Green
        & "$PSScriptRoot\setup-backend.ps1"
    } else {
        Write-Host "You can run setup-backend.ps1 later to set up the backend."
    }
} catch {
    Write-Host "Failed to verify MongoDB installation." -ForegroundColor Red
    Write-Host "Please restart your computer and try running 'mongod --version' in a new command prompt." -ForegroundColor Yellow
}

Read-Host "Press Enter to exit" 