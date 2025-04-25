@echo off
echo.
echo ======================================
echo   Appointment Booking Database Setup
echo ======================================
echo.

echo Checking MongoDB connection...
cd backend
call npm run test-db

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo MongoDB connection failed!
    echo Please make sure MongoDB is running before continuing.
    echo.
    pause
    exit /b
)

echo.
echo Would you like to initialize the database with sample data? (Y/N)
set /p INIT_DB="Enter Y or N: "

if /I "%INIT_DB%"=="Y" (
    echo.
    echo Initializing database with sample data...
    call npm run init-db
    
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo Database initialization failed!
        echo.
        pause
        exit /b
    )
    
    echo.
    echo Database initialized successfully!
    echo.
    echo The following test accounts have been created:
    echo.
    echo Admin Account:
    echo   Email: admin@example.com
    echo   Password: admin123
    echo.
    echo User Account:
    echo   Email: user@example.com
    echo   Password: user123
    echo.
) else (
    echo.
    echo Skipping database initialization.
    echo.
)

echo Database setup complete!
echo You can now start the application with: npm run dev
echo.

pause 