@echo off
echo ============================================
echo   HoloQuant Backend Server
echo ============================================
echo.
cd /d "%~dp0"

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://python.org
    pause
    exit /b 1
)

REM Check if virtual environment exists
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo ERROR: Failed to create virtual environment
        pause
        exit /b 1
    )
    echo Virtual environment created successfully
    echo.
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat
if errorlevel 1 (
    echo ERROR: Failed to activate virtual environment
    pause
    exit /b 1
)

REM Install/upgrade dependencies
echo.
echo Checking and installing dependencies...
echo This may take a few minutes for first-time setup...
echo.
pip install --upgrade pip --quiet
pip install -r requirements.txt --quiet

if errorlevel 1 (
    echo.
    echo WARNING: Some packages failed to install
    echo Trying again with verbose output...
    pip install -r requirements.txt
)

REM Clear screen and show startup info
cls
echo ============================================
echo   HoloQuant Backend Server
echo ============================================
echo.
echo Backend API:  http://localhost:8000
echo API Docs:     http://localhost:8000/docs
echo.
echo Available Endpoints:
echo   GET /api/assets/{category}
echo   GET /api/screener/{asset_type}
echo   GET /api/analyze/{symbol}
echo   GET /api/news/{symbol}
echo.
echo CORS: Enabled for all origins
echo.
echo Press Ctrl+C to stop the server
echo ============================================
echo.

REM Start the server
python main.py

REM Catch any errors
if errorlevel 1 (
    echo.
    echo ERROR: Server crashed or failed to start
    echo Check the error messages above
    pause
)
