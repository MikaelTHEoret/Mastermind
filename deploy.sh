
#!/bin/bash
set -e

LOGFILE="build.log"
echo "Starting Mastermind Deployment..." | tee "$LOGFILE"

echo "Step 1: Installing dependencies..." | tee -a "$LOGFILE"
if ! npm install 2>&1 | tee -a "$LOGFILE"; then
    echo "Dependency installation failed. Check $LOGFILE for details." | tee -a "$LOGFILE"
    exit 1
fi

echo "Step 2: Building the application..." | tee -a "$LOGFILE"
if ! npm run build 2>&1 | tee -a "$LOGFILE"; then
    echo "Build failed. Check $LOGFILE for details." | tee -a "$LOGFILE"
    exit 1
fi

echo "Step 3: Starting the development server..." | tee -a "$LOGFILE"
npm run dev 2>&1 | tee -a "$LOGFILE"
