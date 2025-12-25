# Script de instalacion completa de PostgreSQL para Nonini Store
# Este script instala PostgreSQL, crea la base de datos y configura todo automaticamente

Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "  INSTALACION AUTOMATICA DE POSTGRESQL - NONINI STORE" -ForegroundColor Cyan
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar si se esta ejecutando como administrador
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "[ADVERTENCIA] Este script requiere permisos de administrador" -ForegroundColor Yellow
    Write-Host "Por favor, ejecuta PowerShell como administrador y vuelve a intentarlo" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Presiona cualquier tecla para salir..." -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
    exit
}

# Funcion para verificar si PostgreSQL esta instalado
function Test-PostgreSQLInstalled {
    $pgPath = Get-Command psql -ErrorAction SilentlyContinue
    return $null -ne $pgPath
}

# Funcion para verificar si el servicio de PostgreSQL esta corriendo
function Test-PostgreSQLService {
    $service = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue
    return $null -ne $service -and $service.Status -eq 'Running'
}

Write-Host "[Paso 1] Verificando instalacion de PostgreSQL..." -ForegroundColor Yellow
Write-Host ""

if (Test-PostgreSQLInstalled) {
    Write-Host "[OK] PostgreSQL ya esta instalado" -ForegroundColor Green
    
    if (Test-PostgreSQLService) {
        Write-Host "[OK] El servicio de PostgreSQL esta corriendo" -ForegroundColor Green
    } else {
        Write-Host "[AVISO] El servicio de PostgreSQL no esta corriendo" -ForegroundColor Yellow
        Write-Host "Intentando iniciar el servicio..." -ForegroundColor Gray
        
        $service = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($service) {
            Start-Service $service.Name
            Write-Host "[OK] Servicio iniciado correctamente" -ForegroundColor Green
        }
    }
} else {
    Write-Host "[ERROR] PostgreSQL no esta instalado" -ForegroundColor Red
    Write-Host ""
    Write-Host "Opciones de instalacion:" -ForegroundColor Cyan
    Write-Host "1. Instalacion automatica con Chocolatey (recomendado)" -ForegroundColor White
    Write-Host "2. Instalacion manual" -ForegroundColor White
    Write-Host ""
    
    $choice = Read-Host "Elige una opcion (1 o 2)"
    
    if ($choice -eq '1') {
        # Verificar si Chocolatey esta instalado
        $chocoPath = Get-Command choco -ErrorAction SilentlyContinue
        
        if ($null -eq $chocoPath) {
            Write-Host ""
            Write-Host "Instalando Chocolatey..." -ForegroundColor Yellow
            Set-ExecutionPolicy Bypass -Scope Process -Force
            [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
            Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
        }
        
        Write-Host ""
        Write-Host "Instalando PostgreSQL 15..." -ForegroundColor Yellow
        Write-Host "Esto puede tomar varios minutos..." -ForegroundColor Gray
        choco install postgresql15 --params '/Password:nonini2024' -y
        
        # Actualizar variables de entorno
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
        
        Write-Host "[OK] PostgreSQL instalado correctamente" -ForegroundColor Green
        Write-Host "Usuario: postgres" -ForegroundColor Gray
        Write-Host "Contraseña: nonini2024" -ForegroundColor Gray
        
        $pgPassword = "nonini2024"
    } else {
        Write-Host ""
        Write-Host "Instalacion manual:" -ForegroundColor Cyan
        Write-Host "1. Descarga PostgreSQL desde: https://www.postgresql.org/download/windows/" -ForegroundColor White
        Write-Host "2. Ejecuta el instalador y sigue las instrucciones" -ForegroundColor White
        Write-Host "3. Anota la contraseña que configures para el usuario 'postgres'" -ForegroundColor White
        Write-Host "4. Vuelve a ejecutar este script despues de la instalacion" -ForegroundColor White
        Write-Host ""
        Write-Host "Presiona cualquier tecla para salir..." -ForegroundColor Gray
        $null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
        exit
    }
}

Write-Host ""
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host ""

# Solicitar la contraseña de PostgreSQL si no se configuro automaticamente
if (-not $pgPassword) {
    Write-Host "Configuracion de PostgreSQL" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Ingresa la contraseña del usuario 'postgres' de PostgreSQL:" -ForegroundColor White
    $securePassword = Read-Host -AsSecureString
    $pgPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword))
}

Write-Host ""
Write-Host "[Paso 2] Creando base de datos 'nonini_store'..." -ForegroundColor Yellow
Write-Host ""

# Crear variable de entorno para la contraseña
$env:PGPASSWORD = $pgPassword

# Verificar si la base de datos ya existe
$dbExists = & psql -U postgres -lqt | Select-String -Pattern "nonini_store"

if ($dbExists) {
    Write-Host "[AVISO] La base de datos 'nonini_store' ya existe" -ForegroundColor Yellow
    $recreate = Read-Host "Deseas recrearla? Esto eliminara todos los datos (s/n)"
    
    if ($recreate -eq 's' -or $recreate -eq 'S') {
        Write-Host "Eliminando base de datos existente..." -ForegroundColor Gray
        & psql -U postgres -c "DROP DATABASE nonini_store;" 2>$null
        
        Write-Host "Creando base de datos nueva..." -ForegroundColor Gray
        & psql -U postgres -c "CREATE DATABASE nonini_store;"
        
        Write-Host "[OK] Base de datos recreada correctamente" -ForegroundColor Green
    } else {
        Write-Host "[OK] Usando base de datos existente" -ForegroundColor Green
    }
} else {
    & psql -U postgres -c "CREATE DATABASE nonini_store;"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Base de datos 'nonini_store' creada correctamente" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] Error al crear la base de datos" -ForegroundColor Red
        Write-Host "Verifica que PostgreSQL este corriendo y que la contraseña sea correcta" -ForegroundColor Yellow
        exit
    }
}

Write-Host ""
Write-Host "[Paso 3] Configurando archivo .env del backend..." -ForegroundColor Yellow
Write-Host ""

# Actualizar el archivo .env con la contraseña correcta
$envPath = Join-Path $PSScriptRoot ".env"
$envContent = Get-Content $envPath -Raw

# Reemplazar la contraseña en DATABASE_URL
$newDatabaseUrl = "DATABASE_URL=`"postgresql://postgres:$pgPassword@localhost:5432/nonini_store?schema=public`""
$envContent = $envContent -replace 'DATABASE_URL="postgresql://postgres:.*?@localhost:5432/nonini_store\?schema=public"', $newDatabaseUrl

# Actualizar FRONTEND_URL con el puerto correcto
$envContent = $envContent -replace 'FRONTEND_URL="http://localhost:5173"', 'FRONTEND_URL="http://localhost:5174"'

Set-Content -Path $envPath -Value $envContent

Write-Host "[OK] Archivo .env configurado correctamente" -ForegroundColor Green
Write-Host ""

Write-Host "[Paso 4] Instalando dependencias de Node.js..." -ForegroundColor Yellow
Write-Host ""

npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Error al instalar dependencias" -ForegroundColor Red
    exit
}

Write-Host "[OK] Dependencias instaladas correctamente" -ForegroundColor Green
Write-Host ""

Write-Host "[Paso 5] Generando cliente de Prisma..." -ForegroundColor Yellow
Write-Host ""

npx prisma generate

Write-Host "[OK] Cliente de Prisma generado" -ForegroundColor Green
Write-Host ""

Write-Host "[Paso 6] Ejecutando migraciones de base de datos..." -ForegroundColor Yellow
Write-Host ""

npx prisma migrate dev --name init

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Error al ejecutar migraciones" -ForegroundColor Red
    exit
}

Write-Host "[OK] Migraciones ejecutadas correctamente" -ForegroundColor Green
Write-Host ""

Write-Host "[Paso 7] Poblando base de datos con datos iniciales..." -ForegroundColor Yellow
Write-Host ""

node seed.js

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Error al poblar la base de datos" -ForegroundColor Red
    exit
}

Write-Host "[OK] Base de datos poblada con datos de prueba" -ForegroundColor Green
Write-Host ""

Write-Host "==================================================================" -ForegroundColor Green
Write-Host "  [OK] INSTALACION COMPLETADA EXITOSAMENTE" -ForegroundColor Green
Write-Host "==================================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Informacion importante:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Base de datos: nonini_store" -ForegroundColor White
Write-Host "  Usuario: postgres" -ForegroundColor White
Write-Host "  Contraseña: $pgPassword" -ForegroundColor White
Write-Host "  Puerto PostgreSQL: 5432" -ForegroundColor White
Write-Host "  Puerto Backend: 5000" -ForegroundColor White
Write-Host ""
Write-Host "Credenciales del Admin Panel:" -ForegroundColor Cyan
Write-Host "  Contraseña: mollydraco" -ForegroundColor White
Write-Host ""
Write-Host "Para configurar pagos (opcional):" -ForegroundColor Cyan
Write-Host "  - Stripe: Agrega tu clave en .env (STRIPE_SECRET_KEY)" -ForegroundColor White
Write-Host "  - MercadoPago: Agrega tu token en .env (MERCADOPAGO_ACCESS_TOKEN)" -ForegroundColor White
Write-Host "  - Ver guia completa: PAGOS_GUIDE.md" -ForegroundColor White
Write-Host ""
Write-Host "Proximos pasos:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  1. Iniciar el backend:" -ForegroundColor Yellow
Write-Host "     npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "  2. En otra terminal, iniciar el frontend:" -ForegroundColor Yellow
Write-Host "     cd .." -ForegroundColor White
Write-Host "     npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "  3. Abrir en el navegador:" -ForegroundColor Yellow
Write-Host "     http://localhost:5174" -ForegroundColor White
Write-Host ""
Write-Host "  4. Explorar el API con Prisma Studio:" -ForegroundColor Yellow
Write-Host "     npm run prisma:studio" -ForegroundColor White
Write-Host ""
Write-Host "Documentacion:" -ForegroundColor Cyan
Write-Host "  - API completa: server/README.md" -ForegroundColor White
Write-Host "  - Experiencia de usuario: EXPERIENCIA_USUARIO.md" -ForegroundColor White
Write-Host "  - Panel admin: ADMIN_PANEL_GUIDE.md" -ForegroundColor White
Write-Host ""
Write-Host "==================================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Presiona cualquier tecla para iniciar el servidor backend..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')

# Iniciar el servidor
npm run dev
