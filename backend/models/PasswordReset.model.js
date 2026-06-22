const mongoose = require('mongoose');

// Guardamos el HASH del código, nunca el código en texto plano,
// igual que hacemos con las contraseñas.
const PasswordResetSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    correo: { type: String, required: true, lowercase: true },
    codeHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    intentos: { type: Number, default: 0 }, // intentos fallidos al verificar el código
    usado: { type: Boolean, default: false },
    ultimoEnvio: { type: Date, default: Date.now }, // para controlar el botón "reenviar"
  },
  { timestamps: true }
);

// Auto-elimina documentos vencidos después de 1 hora extra de cortesía
PasswordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 3600 });

module.exports = mongoose.model('PasswordReset', PasswordResetSchema);
