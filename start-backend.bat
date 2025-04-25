@echo off
echo Starting Backend Server Setup...

cd backend

echo Installing dependencies...
call npm install

echo Starting server...
call npm run dev

pause 