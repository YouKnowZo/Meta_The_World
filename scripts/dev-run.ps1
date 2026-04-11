# Dev helper for Windows PowerShell
# Usage: Open PowerShell at repo root and run: .\scripts\dev-run.ps1

# Check for Node
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js not found in PATH." -ForegroundColor Red
    Write-Host "Please install Node 18 LTS (recommended) from https://nodejs.org/ or use nvm-windows (https://github.com/coreybutler/nvm-windows)."
    exit 1
}

# Ensure npm exists
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "npm not found. Make sure Node.js installation added npm to PATH." -ForegroundColor Red
    exit 1
}

# Install root deps
Write-Host "Installing root dependencies..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) { Write-Host "npm install failed (root)." -ForegroundColor Red; exit $LASTEXITCODE }

# Modern workspace install
Write-Host "Using npm workspaces: root 'npm install' will install workspace packages." -ForegroundColor Cyan

# Install server/dev deps
Write-Host "Installing server dependencies..." -ForegroundColor Cyan
Push-Location server
npm install
if ($LASTEXITCODE -ne 0) { Pop-Location; Write-Host "npm install failed in server." -ForegroundColor Red; exit $LASTEXITCODE }
Pop-Location

# Install web deps
Write-Host "Installing web dependencies..." -ForegroundColor Cyan
Push-Location apps\web
npm install
if ($LASTEXITCODE -ne 0) { Pop-Location; Write-Host "npm install failed in apps/web." -ForegroundColor Red; exit $LASTEXITCODE }
Pop-Location

# Start both services concurrently
Write-Host "Starting server and web concurrently (dev:local)..." -ForegroundColor Green
npm run dev:local

# End of script
