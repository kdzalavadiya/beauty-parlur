# PowerShell script to check for and download Node.js

# Define Node.js version to download (LTS version)
$nodeVersion = "18.17.1"
$npmVersion = "10.2.4"
$architecture = "x64"

# Define download URLs
$nodeUrl = "https://nodejs.org/dist/v$nodeVersion/node-v$nodeVersion-win-$architecture.msi"
$downloadPath = "$env:TEMP\node-installer.msi"

Write-Host "Node.js Installation Helper" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is already installed
try {
    $existingNodeVersion = node -v
    Write-Host "Node.js is already installed: $existingNodeVersion" -ForegroundColor Green
    Write-Host "No need to install."
    
    # Check for npm version
    try {
        $existingNpmVersion = npm -v
        Write-Host "npm is installed: $existingNpmVersion" -ForegroundColor Green
    } catch {
        Write-Host "npm not found or not in PATH" -ForegroundColor Yellow
    }

    $proceed = Read-Host "Do you want to proceed with the backend setup anyway? (y/n)"
    if ($proceed -eq 'y' -or $proceed -eq 'Y') {
        Write-Host "Starting backend setup script..." -ForegroundColor Green
        & "$PSScriptRoot\setup-backend.ps1"
    } else {
        Write-Host "Exiting script..."
    }
    
    exit 0
} catch {
    Write-Host "Node.js is not installed or not in PATH." -ForegroundColor Yellow
    Write-Host "Will attempt to download and install Node.js v$nodeVersion" -ForegroundColor Cyan
}

# Function to check if running as administrator
function Test-Admin {
    $currentUser = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
    return $currentUser.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

# Check if running as admin
if (-not (Test-Admin)) {
    Write-Host "This script needs to be run as Administrator to install Node.js." -ForegroundColor Red
    Write-Host "Please right-click on the PowerShell icon and select 'Run as Administrator'" -ForegroundColor Yellow
    
    $elevate = Read-Host "Do you want to try to elevate this script now? (y/n)"
    if ($elevate -eq 'y' -or $elevate -eq 'Y') {
        # Try to restart script with elevated permissions
        Start-Process PowerShell -Verb RunAs -ArgumentList "-File `"$PSCommandPath`""
        exit
    } else {
        Write-Host "Installation cancelled. Please run as Administrator to install Node.js." -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

# Download Node.js installer
Write-Host "Downloading Node.js installer..." -ForegroundColor Cyan
try {
    # Create a new WebClient and specify TLS 1.2
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    $webClient = New-Object System.Net.WebClient
    $webClient.DownloadFile($nodeUrl, $downloadPath)
    Write-Host "Download completed successfully" -ForegroundColor Green
} catch {
    Write-Host "Failed to download Node.js: $_.Exception.Message" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Install Node.js
Write-Host "Installing Node.js..." -ForegroundColor Cyan
try {
    $arguments = "/i `"$downloadPath`" /quiet /norestart ADDLOCAL=ALL"
    Start-Process -FilePath "msiexec.exe" -ArgumentList $arguments -Wait
    Write-Host "Node.js installation completed" -ForegroundColor Green
} catch {
    Write-Host "Failed to install Node.js: $_.Exception.Message" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Clean up the downloaded installer
Remove-Item $downloadPath

# Update PATH environment variable to include Node.js
Write-Host "Updating PATH environment variable..." -ForegroundColor Cyan
$nodePath = "C:\Program Files\nodejs"
$env:Path = "$env:Path;$nodePath"
[Environment]::SetEnvironmentVariable("Path", $env:Path, [EnvironmentVariableTarget]::Machine)
Write-Host "PATH updated" -ForegroundColor Green

# Refresh the PATH in the current session
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Verify installation
Write-Host "Verifying Node.js installation..." -ForegroundColor Cyan
try {
    $installedNodeVersion = node -v
    Write-Host "Node.js installed successfully: $installedNodeVersion" -ForegroundColor Green
    
    $installedNpmVersion = npm -v
    Write-Host "npm installed successfully: $installedNpmVersion" -ForegroundColor Green
    
    Write-Host "Node.js installation completed successfully!" -ForegroundColor Green
    
    $setupBackend = Read-Host "Do you want to set up the backend now? (y/n)"
    if ($setupBackend -eq 'y' -or $setupBackend -eq 'Y') {
        Write-Host "Starting backend setup script..." -ForegroundColor Green
        & "$PSScriptRoot\setup-backend.ps1"
    } else {
        Write-Host "You can run setup-backend.ps1 later to set up the backend."
    }
} catch {
    Write-Host "Failed to verify Node.js installation." -ForegroundColor Red
    Write-Host "Please restart your computer and try running 'node -v' in a new command prompt." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Read-Host "Press Enter to exit" 