# Guía de Configuración de PayPal

## 🔧 Configuración en el Panel de Administración

### 1. Obtener Credenciales de PayPal

Para configurar PayPal en tu tienda, necesitas:

1. **Crear una cuenta de PayPal Business** (si no tienes una)
2. **Acceder al PayPal Developer Dashboard**
3. **Crear una aplicación** para obtener las credenciales

### 2. Credenciales Necesarias

En el panel de administración (`/admin/settings`), necesitas completar:

#### **Client ID**
- Es tu identificador público de PayPal
- Formato: `AeA...` (cadena larga de caracteres)
- Se obtiene del PayPal Developer Dashboard

#### **Client Secret**
- Es tu clave secreta de PayPal
- Formato: `EF...` (cadena larga de caracteres)
- Se obtiene del PayPal Developer Dashboard

#### **Modo**
- **Sandbox**: Para pruebas (recomendado al inicio)
- **Live**: Para producción (cuando estés listo para recibir pagos reales)

### 3. Cómo Obtener las Credenciales

1. Ve a [developer.paypal.com](https://developer.paypal.com)
2. Inicia sesión con tu cuenta de PayPal
3. Ve a "My Apps & Credentials"
4. Crea una nueva aplicación o usa una existente
5. Copia el **Client ID** y **Client Secret**

### 4. Configuración en el Panel

1. Inicia sesión como administrador
2. Ve a `/admin/settings`
3. Completa la sección "Configuración de PayPal":
   - **Client ID**: Tu Client ID de PayPal
   - **Client Secret**: Tu Client Secret de PayPal
   - **Modo**: Selecciona "Sandbox" para pruebas
4. Haz clic en "Guardar Configuración"

### 5. Verificación

- Si ves "Configuración guardada exitosamente", todo está bien
- Si ves un error, verifica que:
  - Los campos no estén vacíos
  - Las credenciales sean correctas
  - Tengas permisos de administrador

### 6. Pruebas

Una vez configurado:
1. Ve a la tienda
2. Agrega productos al carrito
3. Ve al checkout
4. Selecciona "PayPal" como método de pago
5. Completa el proceso de pago

### 7. Notas Importantes

- **Sandbox**: Usa cuentas de prueba para simular pagos
- **Live**: Solo activa cuando estés listo para recibir pagos reales
- **Seguridad**: Las credenciales se almacenan de forma segura en la base de datos
- **Backup**: Guarda tus credenciales en un lugar seguro

### 8. Soporte

Si tienes problemas:
1. Verifica que las credenciales sean correctas
2. Asegúrate de estar usando el modo correcto (Sandbox/Live)
3. Revisa los logs del servidor para errores específicos
4. Contacta a PayPal Developer Support si es necesario

---

**¡Tu configuración de PayPal debería funcionar correctamente ahora!** 🎉


