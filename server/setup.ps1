# Script de instalacion automatica para Nonini Store Backend
# Ejecutar con: .\setup.ps1

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  NONINI STORE - SETUP BACKEND" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Stop"

Write-Host "[1/6] Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js instalado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js no encontrado. Descargalo de: https://nodejs.org" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[2/6] Verificando PostgreSQL..." -ForegroundColor Yellow
try {
    $pgVersion = psql --version
    Write-Host "✓ PostgreSQL instalado: $pgVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠ PostgreSQL no encontrado en PATH. Asegurate de que este instalado." -ForegroundColor Yellow
    Write-Host "  Descarga: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    $continue = Read-Host "Continuar de todos modos? (s/n)"
    if ($continue -ne "s") { exit 1 }
}

Write-Host ""
Write-Host "[3/6] Instalando dependencias npm..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Dependencias instaladas correctamente" -ForegroundColor Green
} else {
    Write-Host "✗ Error al instalar dependencias" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[4/6] Configurando variables de entorno..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "⚠ El archivo .env ya existe" -ForegroundColor Yellow
    $overwrite = Read-Host "Sobreescribir? (s/n)"
    if ($overwrite -ne "s") {
        Write-Host "✓ Usando .env existente" -ForegroundColor Green
    } else {
        Copy-Item ".env.example" ".env" -Force
        Write-Host "✓ Archivo .env creado desde .env.example" -ForegroundColor Green
    }
} else {
    Copy-Item ".env.example" ".env"
    Write-Host "✓ Archivo .env creado desde .env.example" -ForegroundColor Green
}

Write-Host ""
Write-Host "IMPORTANTE: Edita el archivo .env y configura:" -ForegroundColor Cyan
Write-Host "  - DATABASE_URL (tu password de PostgreSQL)" -ForegroundColor White
Write-Host "  - STRIPE_SECRET_KEY (opcional, para pagos)" -ForegroundColor White
Write-Host "  - MERCADOPAGO_ACCESS_TOKEN (opcional, para pagos)" -ForegroundColor White

Write-Host ""
$editNow = Read-Host "Abrir .env para editar ahora? (s/n)"
if ($editNow -eq "s") {
    notepad .env
    Write-Host "Presiona Enter cuando termines de editar..." -ForegroundColor Yellow
    Read-Host
}

Write-Host ""
Write-Host "[5/6] Ejecutando migraciones de Prisma..." -ForegroundColor Yellow
try {
    npx prisma migrate dev --name init
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Migraciones ejecutadas correctamente" -ForegroundColor Green
    } else {
        throw "Error en migraciones"
    }
} catch {
    Write-Host "✗ Error al ejecutar migraciones" -ForegroundColor Red
    Write-Host "  Verifica que PostgreSQL este corriendo y que DATABASE_URL sea correcto" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "[6/6] Cargando datos iniciales (seed)..." -ForegroundColor Yellow
try {
    node seed.js
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Datos iniciales cargados correctamente" -ForegroundColor Green
    } else {
        throw "Error en seed"
    }
} catch {
    Write-Host "✗ Error al cargar datos iniciales" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  ✓ INSTALACION COMPLETADA" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Comandos utiles:" -ForegroundColor Yellow
Write-Host "  npm run dev              Iniciar servidor en desarrollo" -ForegroundColor White
Write-Host "  npm start                Iniciar servidor en produccion" -ForegroundColor White
Write-Host "  npm run prisma:studio    Ver base de datos (GUI)" -ForegroundColor White
Write-Host ""
Write-Host "El servidor estara disponible en: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Password de admin: mollydraco" -ForegroundColor Cyan
Write-Host ""
$startNow = Read-Host "Iniciar servidor ahora? (s/n)"
if ($startNow -eq "s") {
    Write-Host ""
    Write-Host "Iniciando servidor..." -ForegroundColor Green
    npm run dev
}
