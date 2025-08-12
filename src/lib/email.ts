import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export interface OrderEmailData {
  orderId: string
  customerName: string
  customerEmail: string
  total: number
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  shippingAddress: string
}

export async function sendOrderConfirmationEmail(data: OrderEmailData): Promise<void> {
  const itemsHtml = data.items
    .map(item => `
      <tr>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>¥${item.price.toFixed(2)}</td>
        <td>¥${(item.quantity * item.price).toFixed(2)}</td>
      </tr>
    `)
    .join('')

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Confirmación de Pedido</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .order-details { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #f5f5f5; }
        .total { font-weight: bold; font-size: 1.2em; text-align: right; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>红辣椒商店 - RedChilli Store</h1>
          <h2>Confirmación de Pedido</h2>
        </div>
        
        <div class="content">
          <p>Hola ${data.customerName},</p>
          
          <p>Gracias por tu compra. Tu pedido ha sido confirmado y está siendo procesado.</p>
          
          <div class="order-details">
            <h3>Detalles del Pedido #${data.orderId}</h3>
            
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            
            <div class="total">
              <p>Total: ¥${data.total.toFixed(2)}</p>
            </div>
            
            <h4>Dirección de Envío:</h4>
            <p>${data.shippingAddress}</p>
          </div>
          
          <p>Te enviaremos una notificación cuando tu pedido sea enviado.</p>
          
          <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
          
          <p>Saludos,<br>El equipo de RedChilli Store</p>
        </div>
      </div>
    </body>
    </html>
  `

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: data.customerEmail,
    subject: `Confirmación de Pedido #${data.orderId} - RedChilli Store`,
    html: emailHtml,
  })
}

export async function sendPaymentConfirmationEmail(data: OrderEmailData): Promise<void> {
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Pago Confirmado</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .success { background: #d4edda; color: #155724; padding: 15px; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>红辣椒商店 - RedChilli Store</h1>
          <h2>Pago Confirmado</h2>
        </div>
        
        <div class="content">
          <div class="success">
            <h3>¡Pago Exitoso!</h3>
            <p>Tu pago por ¥${data.total.toFixed(2)} ha sido procesado correctamente.</p>
          </div>
          
          <p>Hola ${data.customerName},</p>
          
          <p>Tu pago para el pedido #${data.orderId} ha sido confirmado. Tu pedido está siendo preparado para el envío.</p>
          
          <p>Gracias por confiar en RedChilli Store.</p>
          
          <p>Saludos,<br>El equipo de RedChilli Store</p>
        </div>
      </div>
    </body>
    </html>
  `

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: data.customerEmail,
    subject: `Pago Confirmado - Pedido #${data.orderId}`,
    html: emailHtml,
  })
}
