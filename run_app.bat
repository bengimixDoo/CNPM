@echo off
echo ========================================
echo Setting up Backend (Django)...
echo ========================================
cd backend
if not exist .venv (
    echo Creating virtual environment...
    python -m venv .venv
)
call .venv\Scripts\activate
echo Installing/Updating Django dependencies...
pip install -r requirements.txt
cd ..

echo.
echo ========================================
echo Setting up Frontend (React)...
echo ========================================
cd frontend
echo Installing/Updating npm dependencies...
call npm install
cd ..

echo.
echo ========================================
echo Starting Application...
echo ========================================
start "Backend Server" cmd /k "cd backend && call .venv\Scripts\activate && python manage.py runserver"

echo Starting Frontend...
start "Frontend Client" cmd /k "cd frontend && npm run dev"

echo Application launching...
