
@echo off
set LOGFILE=build.log
echo Starting Mastermind Deployment... > %LOGFILE%

echo Step 1: Installing dependencies... >> %LOGFILE%
npm install >> %LOGFILE% 2>&1
if errorlevel 1 (
    echo Dependency installation failed. Check %LOGFILE% for details. >> %LOGFILE%
    exit /b 1
)

echo Step 2: Building the application... >> %LOGFILE%
npm run build >> %LOGFILE% 2>&1
if errorlevel 1 (
    echo Build failed. Check %LOGFILE% for details. >> %LOGFILE%
    exit /b 1
)

echo Step 3: Starting the development server... >> %LOGFILE%
npm run dev >> %LOGFILE% 2>&1
