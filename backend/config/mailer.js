const nodemailer = require('nodemailer');

const mailUser = process.env.MAIL_USER;
const mailPass = process.env.MAIL_PASS;
const mailHost = process.env.MAIL_HOST || 'smtp.gmail.com';
const mailPort = Number(process.env.MAIL_PORT) || 587;
const mailFrom = process.env.MAIL_FROM || `"AgroVisionAI" <${mailUser}>`;

let transporter = null;
if (mailUser && mailPass) {
  transporter = nodemailer.createTransport({
    host: mailHost,
    port: mailPort,
    secure: mailPort === 465, // true para puerto 465, false para otros
    auth: {
      user: mailUser,
      pass: mailPass,
    },
  });
} else {
  console.warn('MAIL_USER or MAIL_PASS not configured. Recovery codes will be logged instead of sent.');
}

async function sendRecoveryCodeEmail(toEmail, code) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color:#1f7a3f;">AgroVisionAI</h2>
      <p>Recibimos una solicitud para recuperar tu contraseña.</p>
      <p>Tu código de verificación es:</p>
      <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; padding: 16px; background:#f0f0f0; text-align:center; border-radius:8px;">
        ${code}
      </div>
      <p>Este código expira en <strong>10 minutos</strong>.</p>
      <p>Si no solicitaste esto, puedes ignorar este correo.</p>
    </div>
  `;

  if (!transporter) {
    console.log(`Recovery code for ${toEmail}: ${code}`);
    return;
  }

  try {
    await transporter.sendMail({
      from: mailFrom,
      to: toEmail,
      subject: 'Código de recuperación de contraseña',
      html,
    });
  } catch (error) {
    console.error('Error enviando correo de recuperación:', error);
    console.log(`Recovery code for ${toEmail}: ${code}`);
  }
}

module.exports = { sendRecoveryCodeEmail };