#!/bin/bash

# Exit on error
set -e

echo "=========================================="
echo "🚀 Initializing Thăng Long Chè Việt (FE & BE)"
echo "=========================================="

echo "1. Setting up environment files..."

# Root .env (Frontend / Docker config)
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "✅ Created root .env"
else
    echo "ℹ️  Root .env already exists. Skipping."
fi

# Backend .env
if [ ! -f "be/.env" ]; then
    cp be/.env.example be/.env
    # Ensure DB_HOST is set to db (the service name in docker-compose.yml)
    sed -i.bak -e 's/DB_HOST=tl_che_viet_db/DB_HOST=db/' be/.env 2>/dev/null || sed -i '' -e 's/DB_HOST=tl_che_viet_db/DB_HOST=db/' be/.env
    rm -f be/.env.bak
    echo "✅ Created and configured be/.env for Docker"
else
    echo "ℹ️  be/.env already exists. Skipping."
fi

echo "2. Starting Docker containers..."
docker compose up -d

echo ""
echo "3. Waiting for Database to be ready..."
# Smart wait for MySQL instead of hardcoded 10s sleep
until docker compose exec db mysqladmin ping -h localhost -uroot -proot --silent 2>/dev/null; do
    echo -n "."
    sleep 1
done
echo -e "\n-> Database is ready!"

echo ""
echo "4. Initializing Backend (Laravel) in a single Docker exec session..."
docker compose exec app sh -c '
    echo "-> Installing Composer dependencies..."
    composer install --no-interaction
    
    echo "-> Generating application key..."
    php artisan key:generate
    
    echo "-> Running database migrations and seeders..."
    php artisan migrate:fresh --seed --force
    
    echo "-> Creating storage link..."
    php artisan storage:link || true
    
    echo "-> Generating Swagger API documentation..."
    php artisan l5-swagger:generate || true
'

echo ""
echo "=========================================="
echo "✅ Initialization completed successfully!"
echo "=========================================="
echo "🌐 Frontend (Nuxt) is running at: http://localhost:3000"
echo "🔌 Backend (Laravel) is running at: http://localhost:8000"
echo "📚 API Documentation (Swagger): http://localhost:8000/api/documentation"
echo "📧 Mailpit (Email testing): http://localhost:8025"
echo ""
echo "Note: The Frontend might take an additional minute to install npm packages"
echo "      and start the Nuxt dev server. Check logs using: docker compose logs -f web"
echo "=========================================="
