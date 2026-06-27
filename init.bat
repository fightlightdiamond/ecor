@echo off
setlocal enabledelayedexpansion

echo ==========================================
echo Initializing Thang Long Che Viet (FE ^& BE)
echo ==========================================

echo 1. Setting up environment files...
if not exist ".env" (
    copy .env.example .env >nul
    echo [OK] Created root .env
) else (
    echo [INFO] Root .env already exists. Skipping.
)

if not exist "be\.env" (
    copy be\.env.example be\.env >nul
    
    rem Use PowerShell to replace string values in .env for Docker environment
    powershell -Command "(gc be\.env) -replace 'DB_HOST=tl_che_viet_db', 'DB_HOST=db' | Out-File -encoding ASCII be\.env"
    
    echo [OK] Created and configured be/.env for Docker
) else (
    echo [INFO] be/.env already exists. Skipping.
)

echo.
echo 2. Starting Docker containers...
docker compose up -d

echo.
echo 3. Waiting for Database to be ready...
:loop
docker compose exec db mysqladmin ping -h localhost -uroot -proot --silent >nul 2>&1
if errorlevel 1 (
    <nul set /p =.
    timeout /t 1 /nobreak >nul
    goto loop
)
echo.
echo -^> Database is ready!

echo.
echo 4. Initializing Backend (Laravel)...
docker compose exec app sh -c "echo '-> Installing Composer dependencies...' && composer install --no-interaction && echo '-> Generating application key...' && php artisan key:generate && echo '-> Running database migrations and seeders...' && php artisan migrate:fresh --seed --force && echo '-> Creating storage link...' && php artisan storage:link || true && echo '-> Generating Swagger API documentation...' && php artisan l5-swagger:generate || true"

echo.
echo ==========================================
echo Initialization completed successfully!
echo ==========================================
echo Frontend (Nuxt) is running at: http://localhost:3000
echo Backend (Laravel) is running at: http://localhost:8000
echo API Documentation (Swagger): http://localhost:8000/api/documentation
echo Mailpit (Email testing): http://localhost:8025
echo ==========================================
echo Note: The Frontend might take an additional minute to install npm packages
echo       and start the Nuxt dev server.
echo ==========================================
pause
