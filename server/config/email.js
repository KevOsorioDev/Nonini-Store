import nodemailer from 'nodemailer';

// Configuración para SendGrid
const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY
  }
});

// Función para enviar email de recuperación
export const enviarEmailRecuperacion = async (email, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@noninistore.com',
    to: email,
    subject: 'Recuperación de Contraseña - Nonini Store',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #701A75;">Recuperación de Contraseña</h2>
        <p>Has solicitado restablecer tu contraseña en Nonini Store.</p>
        <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>
        <a href="${resetUrl}" 
           style="display: inline-block; padding: 12px 24px; background-color: #701A75; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0;">
          Restablecer Contraseña
        </a>
        <p style="color: #666; font-size: 14px;">
          Este enlace expirará en 1 hora.
        </p>
        <p style="color: #666; font-size: 14px;">
          Si no solicitaste este cambio, ignora este email.
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Email de recuperación enviado a:', email);
  } catch (error) {
    console.error('❌ Error al enviar email:', error);
    throw error;
  }
};

// Función para enviar confirmación de orden
export const enviarEmailOrden = async (email, orden) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@noninistore.com',
    to: email,
    subject: `Confirmación de Orden #${orden.id} - Nonini Store`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #701A75;">¡Gracias por tu compra!</h2>
        <p>Tu orden #${orden.id} ha sido confirmada.</p>
        <p><strong>Total:</strong> $${orden.total}</p>
        <p><strong>Estado:</strong> ${orden.estado}</p>
        <p>Te mantendremos informado sobre el estado de tu pedido.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Email de orden enviado a:', email);
  } catch (error) {
    console.error('❌ Error al enviar email de orden:', error);
  }
};
