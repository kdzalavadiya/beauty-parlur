/**
 * Backend Startup Helper
 * Provides easy way to start the backend server
 */
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Check if backend directory exists
const backendDir = path.join(__dirname, 'backend');
if (!fs.existsSync(backendDir)) {
  console.error('Backend directory not found. Please make sure the backend folder exists.');
  process.exit(1);
}

// Check if .env file exists, if not copy from example
const envFile = path.join(backendDir, '.env');
const envExampleFile = path.join(backendDir, '.env.example');
if (!fs.existsSync(envFile) && fs.existsSync(envExampleFile)) {
  console.log('Creating .env file from .env.example...');
  fs.copyFileSync(envExampleFile, envFile);
  console.log('.env file created. Please check the file and update any necessary values.');
}

// Check for MongoDB running
console.log('Please ensure MongoDB is running on your system.');

// Check if dependencies are installed
const nodeModulesDir = path.join(backendDir, 'node_modules');
if (!fs.existsSync(nodeModulesDir)) {
  console.log('Installing dependencies...');
  const install = spawn('npm', ['install'], { cwd: backendDir, stdio: 'inherit' });
  
  install.on('close', (code) => {
    if (code !== 0) {
      console.error('Failed to install dependencies. Please run "npm install" in the backend directory.');
      process.exit(1);
    }
    startServer();
  });
} else {
  startServer();
}

function startServer() {
  console.log('Starting backend server...');
  const server = spawn('npm', ['run', 'dev'], { cwd: backendDir, stdio: 'inherit' });
  
  server.on('close', (code) => {
    if (code !== 0) {
      console.error(`Backend server exited with code ${code}`);
    }
  });

  process.on('SIGINT', () => {
    console.log('Stopping backend server...');
    server.kill('SIGINT');
  });
} 