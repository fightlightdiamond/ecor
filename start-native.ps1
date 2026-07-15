# Native dev: Postgres in Docker, everything else on the host.
# Usage: .\start-native.ps1

$ErrorActionPreference = "Stop"
$Root = $PSScriptRoot

Write-Host "==> Starting Postgres (Docker)..."
docker compose -f "$Root\infra\docker-compose.db.yml" --env-file "$Root\.env.dev" up -d

Write-Host "==> Waiting for Postgres..."
$deadline = (Get-Date).AddMinutes(2)
while ((Get-Date) -lt $deadline) {
  $status = docker inspect tlcv-postgres --format "{{.State.Health.Status}}" 2>$null
  if ($status -eq "healthy") { break }
  Start-Sleep -Seconds 2
}

Write-Host ""
Write-Host "Start each service in its own terminal:"
Write-Host "  Backend:    cd apps\backend && npm run dev"
Write-Host "  Strapi:     cd strapi && npm run start:api    # fast API (~25ms; avoid develop ~2s)"
Write-Host "              Server-side storefront uses 127.0.0.1 (see STRAPI_API_URL_SERVER in .env.local)"
Write-Host "  Storefront: cd apps\storefront && npm run dev"
Write-Host ""
Write-Host "After Strapi + Medusa are up, warm APIs (optional):"
Write-Host "  node scripts/warm-apis.mjs"
Write-Host ""
Write-Host "URLs:"
Write-Host "  Storefront:  http://localhost:8000/vn"
Write-Host "  Medusa Admin http://localhost:9000/app"
Write-Host "  Strapi Admin http://localhost:1337/admin"
Write-Host ""
Write-Host "Login: admin@medusa.local / supersecret123"
Write-Host ""
Write-Host "Note: use 'npm run develop' in strapi only when editing content-type schemas."
