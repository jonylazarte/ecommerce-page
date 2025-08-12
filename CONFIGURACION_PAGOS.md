# Configuración de Métodos de Pago

## Variables de Entorno Necesarias

### 1. PayPal
```env
# .env (Backend)
PAYPAL_CLIENT_ID=tu_client_id_de_paypal
PAYPAL_CLIENT_SECRET=tu_client_secret_de_paypal

# .env.local (Frontend)
NEXT_PUBLIC_PAYPAL_CLIENT_ID=tu_client_id_de_paypal
```

### 2. MercadoPago
```env
# .env (Backend)
MERCADOPAGO_ACCESS_TOKEN=tu_access_token_de_mercadopago

# .env.local (Frontend)
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=tu_public_key_de_mercadopago
```

### 3. Stripe
```env
# .env (Backend)
STRIPE_SECRET_KEY=tu_stripe_secret_key
STRIPE_WEBHOOK_SECRET=tu_stripe_webhook_secret

# .env.local (Frontend)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=tu_stripe_publishable_key
```

### 4. URL Base
```env
# .env (Backend)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Configuración de Cada Método

### PayPal
1. Ve a [PayPal Developer](https://developer.paypal.com/)
2. Crea una cuenta de desarrollador
3. Crea una aplicación para obtener las credenciales
4. Usa las credenciales de sandbox para pruebas

### MercadoPago
1. Ve a [MercadoPago Developer](https://www.mercadopago.com.ar/developers)
2. Crea una cuenta de desarrollador
3. Obtén las credenciales de prueba
4. Configura las URLs de webhook

### Stripe
1. Ve a [Stripe Dashboard](https://dashboard.stripe.com/)
2. Crea una cuenta
3. Obtén las claves de API
4. Configura los webhooks

## Webhooks

### PayPal Webhook
- URL: `https://tu-dominio.com/api/payments/paypal/webhook`
- Eventos: `PAYMENT.CAPTURE.COMPLETED`

### MercadoPago Webhook
- URL: `https://tu-dominio.com/api/payments/mercadopago/webhook`
- Eventos: `payment`

### Stripe Webhook
- URL: `https://tu-dominio.com/api/webhooks/stripe`
- Eventos: `payment_intent.succeeded`

## Notas Importantes

1. **Para desarrollo**: Usa las credenciales de sandbox/prueba
2. **Para producción**: Cambia a las credenciales reales
3. **HTTPS**: Los webhooks requieren HTTPS en producción
4. **Validación**: Siempre valida los webhooks en el servidor
5. **Logs**: Mantén logs detallados de todos los pagos

## Pruebas

### PayPal
- Usa cuentas de sandbox de PayPal
- Prueba con diferentes escenarios (éxito, cancelación, error)

### MercadoPago
- Usa tarjetas de prueba de MercadoPago
- Prueba diferentes métodos de pago

### Stripe
- Usa las tarjetas de prueba de Stripe
- Prueba diferentes tipos de tarjetas y escenarios
