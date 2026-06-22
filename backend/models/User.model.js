const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    correo: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true }, // hash con bcrypt, nunca texto plano
    role: {
      type: String,
      enum: ['admin', 'agricultor'],
      required: true,
      default: 'agricultor',
    },
    activo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
