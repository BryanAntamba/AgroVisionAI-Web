const User = require('../models/User.model');
const PasswordReset = require('../models/PasswordReset.model');
const { generateSixDigitCode } = require('../utils/generateCode');
const { hashValue, compareValue } = require('../utils/hash');
const { sendRecoveryCodeEmail } = require('../config/mailer');

const CODE_EXPIRATION_MINUTES = 10;
const RESEND_COOLDOWN_SECONDS = 60;
const MAX_INTENTOS = 5;

// ──────────────────────────────────────────────
// PASO 1: Solicitar código (forgot-password)
// ──────────────────────────────────────────────
async function forgotPassword(req, res) {
  try {
    const { correo } = req.body;
    if (!correo) {
      return res.status(400).json({ message: 'El correo es obligatorio.' });
    }

    const user = await User.findOne({ correo: correo.toLowerCase() });

    // Por seguridad, respondemos igual exista o no el correo
    // (evita que alguien adivine qué correos están registrados)
    if (!user) {
      return res.status(200).json({
        message: 'Si el correo existe, se envió un código de verificación.',
      });
    }

    const code = generateSixDigitCode();
    const codeHash = await hashValue(code);
    const expiresAt = new Date(Date.now() + CODE_EXPIRATION_MINUTES * 60 * 1000);

    // Elimina cualquier código previo no usado para este usuario
    await PasswordReset.deleteMany({ userId: user._id, usado: false });

    await PasswordReset.create({
      userId: user._id,
      correo: user.correo,
      codeHash,
      expiresAt,
      ultimoEnvio: new Date(),
    });

    await sendRecoveryCodeEmail(user.correo, code);

    return res.status(200).json({
      message: 'Si el correo existe, se envió un código de verificación.',
    });
  } catch (error) {
    console.error('Error en forgotPassword:', error);
    return res.status(500).json({ message: 'Error al procesar la solicitud.' });
  }
}

// ──────────────────────────────────────────────
// PASO 1.b: Reenviar código (con cooldown)
// ──────────────────────────────────────────────
async function resendCode(req, res) {
  try {
    const { correo } = req.body;
    const user = await User.findOne({ correo: correo?.toLowerCase() });

    if (!user) {
      return res.status(200).json({
        message: 'Si el correo existe, se reenvió el código.',
      });
    }

    const existingReset = await PasswordReset.findOne({
      userId: user._id,
      usado: false,
    }).sort({ createdAt: -1 });

    // Si ya hay un código reciente, valida el cooldown
    if (existingReset) {
      const secondsSinceLastSend =
        (Date.now() - new Date(existingReset.ultimoEnvio).getTime()) / 1000;

      if (secondsSinceLastSend < RESEND_COOLDOWN_SECONDS) {
        const secondsLeft = Math.ceil(RESEND_COOLDOWN_SECONDS - secondsSinceLastSend);
        return res.status(429).json({
          message: `Espera ${secondsLeft} segundos antes de reenviar el código.`,
          secondsLeft,
        });
      }
    }

    const code = generateSixDigitCode();
    const codeHash = await hashValue(code);
    const expiresAt = new Date(Date.now() + CODE_EXPIRATION_MINUTES * 60 * 1000);

    await PasswordReset.deleteMany({ userId: user._id, usado: false });

    await PasswordReset.create({
      userId: user._id,
      correo: user.correo,
      codeHash,
      expiresAt,
      ultimoEnvio: new Date(),
    });

    await sendRecoveryCodeEmail(user.correo, code);

    return res.status(200).json({
      message: 'Código reenviado correctamente.',
      cooldownSeconds: RESEND_COOLDOWN_SECONDS,
    });
  } catch (error) {
    console.error('Error en resendCode:', error);
    return res.status(500).json({ message: 'Error al reenviar el código.' });
  }
}

// ──────────────────────────────────────────────
// PASO 2: Verificar código
// ──────────────────────────────────────────────
async function verifyCode(req, res) {
  try {
    const { correo, code } = req.body;
    if (!correo || !code) {
      return res.status(400).json({ message: 'Correo y código son obligatorios.' });
    }

    const user = await User.findOne({ correo: correo.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'Código inválido o expirado.' });
    }

    const reset = await PasswordReset.findOne({
      userId: user._id,
      usado: false,
    }).sort({ createdAt: -1 });

    if (!reset) {
      return res.status(400).json({ message: 'Código inválido o expirado.' });
    }

    if (reset.expiresAt < new Date()) {
      return res.status(400).json({ message: 'El código ha expirado, solicita uno nuevo.' });
    }

    if (reset.intentos >= MAX_INTENTOS) {
      return res.status(429).json({
        message: 'Demasiados intentos fallidos. Solicita un nuevo código.',
      });
    }

    const isValid = await compareValue(code, reset.codeHash);

    if (!isValid) {
      reset.intentos += 1;
      await reset.save();
      return res.status(400).json({ message: 'Código incorrecto.' });
    }

    // Marcamos el código como verificado (pero no "usado" hasta que cambie la contraseña)
    // Generamos un token temporal de corta duración para el siguiente paso
    const resetToken = await hashValue(`${user._id}-${reset._id}-${Date.now()}`);
    reset.resetToken = resetToken;
    await reset.save();

    return res.status(200).json({
      message: 'Código verificado correctamente.',
      resetId: reset._id,
    });
  } catch (error) {
    console.error('Error en verifyCode:', error);
    return res.status(500).json({ message: 'Error al verificar el código.' });
  }
}

// ──────────────────────────────────────────────
// PASO 3: Actualizar contraseña
// ──────────────────────────────────────────────
async function resetPassword(req, res) {
  try {
    const { correo, resetId, nuevaPassword, confirmarPassword } = req.body;

    if (!correo || !resetId || !nuevaPassword || !confirmarPassword) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    if (nuevaPassword !== confirmarPassword) {
      return res.status(400).json({ message: 'Las contraseñas no coinciden.' });
    }

    if (nuevaPassword.length < 8) {
      return res.status(400).json({
        message: 'La contraseña debe tener al menos 8 caracteres.',
      });
    }

    const user = await User.findOne({ correo: correo.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'Solicitud inválida.' });
    }

    const reset = await PasswordReset.findOne({
      _id: resetId,
      userId: user._id,
      usado: false,
    });

    if (!reset || reset.expiresAt < new Date()) {
      return res.status(400).json({ message: 'La sesión de recuperación expiró, repite el proceso.' });
    }

    // ── Validación clave que pediste: que NO sea la misma contraseña anterior ──
    const esLaMisma = await compareValue(nuevaPassword, user.password);
    if (esLaMisma) {
      return res.status(400).json({
        message: 'La nueva contraseña no puede ser igual a la anterior.',
      });
    }

    user.password = await hashValue(nuevaPassword);
    await user.save();

    reset.usado = true;
    await reset.save();

    return res.status(200).json({ message: 'Contraseña actualizada correctamente.' });
  } catch (error) {
    console.error('Error en resetPassword:', error);
    return res.status(500).json({ message: 'Error al actualizar la contraseña.' });
  }
}

module.exports = {
  forgotPassword,
  resendCode,
  verifyCode,
  resetPassword,
};
