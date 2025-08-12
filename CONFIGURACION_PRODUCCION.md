# 🚀 Configuración para Producción - RedChilli Store

## 📋 Variables de Entorno Requeridas

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Database
DATABASE_URL="file:./dev.db"

# JWT Secret (genera uno aleatorio para producción)
JWT_SECRET="tu-jwt-secret-super-seguro-aqui-cambialo-en-produccion"

# Stripe Configuration
STRIPE_PUBLISHABLE_KEY="pk_test_tu_stripe_publishable_key_aqui"
STRIPE_SECRET_KEY="sk_test_tu_stripe_secret_key_aqui"
STRIPE_WEBHOOK_SECRET="whsec_tu_stripe_webhook_secret_aqui"

# PayPal Configuration
PAYPAL_CLIENT_ID="tu_paypal_client_id_aqui"
PAYPAL_CLIENT_SECRET="tu_paypal_client_secret_aqui"
PAYPAL_MODE="sandbox" # Cambiar a "live" para producción

# Email Configuration (Gmail example)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="tu_email@gmail.com"
EMAIL_PASSWORD="tu_password_de_aplicacion_gmail"
EMAIL_FROM="noreply@tutienda.com"

# Bank Transfer Configuration
BANK_NAME="Banco de la Nación Argentina"
BANK_ACCOUNT_TYPE="Cuenta Corriente"
BANK_ACCOUNT_NUMBER="1234-5678-9012-3456"
BANK_CBU="0110123456789012345678"
BANK_HOLDER="RedChilli Store S.A."
BANK_CUIT="30-12345678-9"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-nextauth-secret-aqui"

# Rate Limiting
RATE_LIMIT_WINDOW_MS="900000" # 15 minutes
RATE_LIMIT_MAX_REQUESTS="100" # 100 requests per window

# Security
CSRF_SECRET="tu-csrf-secret-aqui"
```

## 🔑 Configuración de Stripe

### 1. Crear cuenta en Stripe
- Ve a [stripe.com](https://stripe.com)
- Crea una cuenta de desarrollador
- Obtén tus claves de API desde el Dashboard

### 2. Configurar las claves
```env
STRIPE_PUBLISHABLE_KEY="pk_test_..." # Clave pública para el frontend
STRIPE_SECRET_KEY="sk_test_..." # Clave secreta para el backend
```

### 3. Configurar Webhooks
- En el Dashboard de Stripe, ve a Webhooks
- Crea un endpoint: `https://tudominio.com/api/webhooks/stripe`
- Copia el webhook secret y configúralo en `STRIPE_WEBHOOK_SECRET`

## 💳 Configuración de PayPal

### 1. Crear cuenta en PayPal Developer
- Ve a [developer.paypal.com](https://developer.paypal.com)
- Crea una cuenta de desarrollador
- Crea una aplicación para obtener las credenciales

### 2. Configurar las credenciales
```env
PAYPAL_CLIENT_ID="tu_client_id_aqui"
PAYPAL_CLIENT_SECRET="tu_client_secret_aqui"
PAYPAL_MODE="sandbox" # Cambiar a "live" para producción
```

## 📧 Configuración de Email

### Opción 1: Gmail
1. Activa la verificación en 2 pasos en tu cuenta de Gmail
2. Genera una contraseña de aplicación
3. Configura las variables:

```env
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="tu_email@gmail.com"
EMAIL_PASSWORD="tu_password_de_aplicacion"
EMAIL_FROM="noreply@tutienda.com"
```

### Opción 2: Otros proveedores
- **Outlook/Hotmail**: `smtp-mail.outlook.com`
- **Yahoo**: `smtp.mail.yahoo.com`
- **Proveedores empresariales**: Consulta con tu proveedor

## 🏦 Configuración Bancaria

Actualiza los datos bancarios reales en las variables:

```env
BANK_NAME="Nombre Real del Banco"
BANK_ACCOUNT_TYPE="Tipo de Cuenta Real"
BANK_ACCOUNT_NUMBER="Número de cuenta real"
BANK_CBU="CBU real"
BANK_HOLDER="Nombre del titular real"
BANK_CUIT="CUIT real"
```

## 🔐 Configuración de Seguridad

### 1. Generar JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2. Generar NextAuth Secret
```bash
openssl rand -base64 32
```

### 3. Generar CSRF Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 👨‍💼 Acceso al Panel de Administración

### Credenciales por defecto:
- **Email**: `admin@redchilli.com`
- **Contraseña**: `admin123`
- **URL**: `http://localhost:3000/admin`

### Cambiar credenciales:
1. Ve a `/admin`
2. Inicia sesión con las credenciales por defecto
3. Ve a Configuración
4. Actualiza las credenciales desde la base de datos

## 🚀 Despliegue en Producción

### 1. Base de datos
- Cambia `DATABASE_URL` a tu base de datos de producción (PostgreSQL recomendado)
- Ejecuta las migraciones: `npx prisma db push`

### 2. Variables de producción
- Cambia `NEXTAUTH_URL` a tu dominio real
- Cambia `PAYPAL_MODE` a "live"
- Usa claves de Stripe de producción (sin `_test`)

### 3. HTTPS
- Configura SSL/TLS en tu servidor
- El middleware ya incluye redirección HTTPS

### 4. Rate Limiting
- Ajusta `RATE_LIMIT_MAX_REQUESTS` según tus necesidades
- Monitorea el uso de la API

## 🔧 Comandos Útiles

### Crear usuario admin
```bash
npx tsx src/lib/create-admin.ts
```

### Poblar base de datos
```bash
npx tsx src/lib/seed.ts
```

### Generar cliente Prisma
```bash
npx prisma generate
```

### Ejecutar migraciones
```bash
npx prisma db push
```

## 📱 Panel de Administración

### Funcionalidades disponibles:
- **Dashboard**: Estadísticas generales
- **Productos**: Gestionar catálogo
- **Pedidos**: Ver y actualizar pedidos
- **Usuarios**: Administrar usuarios
- **Configuración**: Configurar pagos, email y datos bancarios

### Navegación:
- Ve a `/admin` para acceder al panel
- Solo usuarios con rol `ADMIN` pueden acceder
- Todas las configuraciones se guardan desde el panel

## 🛠️ Solución de Problemas

### Error en proceso de pago
1. Verifica que las claves de Stripe/PayPal estén correctas
2. Asegúrate de que el usuario esté autenticado
3. Revisa los logs del servidor para más detalles

### Error de email
1. Verifica las credenciales SMTP
2. Asegúrate de que el puerto esté abierto
3. Para Gmail, usa contraseña de aplicación

### Error de base de datos
1. Verifica la conexión a la base de datos
2. Ejecuta las migraciones: `npx prisma db push`
3. Verifica que el archivo `.env` esté configurado

## 📞 Soporte

Para soporte técnico o preguntas:
- Email: soporte@redchilli.com
- Documentación: Revisa este archivo
- Logs: Revisa la consola del servidor

---

**⚠️ Importante**: Nunca compartas las claves secretas ni las subas a repositorios públicos. Usa variables de entorno y archivos `.env` que estén en `.gitignore`.
