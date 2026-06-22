const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const { compareValue } = require('../utils/hash');

async function login(req, res) {
  try {
    const { correo, password } = req.body;

    const user = await User.findOne({ correo: correo?.toLowerCase() });
    if (!user || !user.activo) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    const isValid = await compareValue(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    // El "role" va dentro del token para que el frontend sepa
    // a dónde redirigir: /admin/dashboard o /agricultor/dashboard
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        correo: user.correo,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ message: 'Error al iniciar sesión.' });
  }
}

module.exports = { login };
