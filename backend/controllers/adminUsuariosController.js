// controllers/adminUsuariosController.js
const pool = require("../config/db");
const bcrypt = require("bcrypt");

// Método para registrar un usuario (Admin)
const registrarUsuario = async (req, res) => {
  try {
    const {
      rol_id,
      nombres,
      apellidos,
      correo_empresarial,
      correo_personal,
      telefono,
      password,
    } = req.body;

    // Verificamos si el usuario ya existe
    const usuarioExistente = await pool.query(
      "SELECT * FROM usuarios WHERE correo_empresarial = $1",
      [correo_empresarial],
    );

    if (usuarioExistente.rows.length > 0) {
      return res
        .status(400)
        .json({
          mensaje: "Este correo empresarial ya está registrado",
        });
    }

    // Encriptamos la contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordEncriptada = await bcrypt.hash(password, salt);

    // Guardamos en la base de datos
    const nuevoUsuario = await pool.query(
      `INSERT INTO usuarios (
        rol_id, nombres, apellidos, correo_empresarial, correo_personal, telefono, password_hash, activo
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING id, nombres, apellidos, correo_empresarial, rol_id, activo`,
      [
        rol_id,
        nombres,
        apellidos,
        correo_empresarial,
        correo_personal,
        telefono,
        passwordEncriptada,
        true,
      ],
    );

    res.status(201).json({
      mensaje: "¡Usuario creado con éxito!",
      usuario: nuevoUsuario.rows[0],
    });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res
      .status(500)
      .json({ mensaje: "Error interno del servidor", error: error.message });
  }
};

// Método para Editar un usuario
const editarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      rol_id,
      nombres,
      apellidos,
      correo_empresarial,
      correo_personal,
      telefono,
    } = req.body;

    const usuarioActualizado = await pool.query(
      `UPDATE usuarios 
       SET rol_id = $1, nombres = $2, apellidos = $3, correo_empresarial = $4, correo_personal = $5, telefono = $6, actualizado_en = CURRENT_TIMESTAMP
       WHERE id = $7 
       RETURNING id, nombres, apellidos, correo_empresarial, rol_id, activo`,
      [
        rol_id,
        nombres,
        apellidos,
        correo_empresarial,
        correo_personal,
        telefono,
        id,
      ],
    );

    if (usuarioActualizado.rows.length === 0) {
      return res
        .status(404)
        .json({
          mensaje: "No se encontró el usuario para editarlo",
        });
    }

    res.json({
      mensaje: "¡Usuario editado correctamente!",
      usuario: usuarioActualizado.rows[0],
    });
  } catch (error) {
    console.error("Error al editar usuario:", error);
    res
      .status(500)
      .json({ mensaje: "Error interno del servidor", error: error.message });
  }
};

// Método para Alternar estado de un usuario (Activar/Desactivar)
const desactivarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    // Primero obtenemos el estado actual del usuario
    const usuarioActual = await pool.query(
      `SELECT activo FROM usuarios WHERE id = $1`,
      [id]
    );

    if (usuarioActual.rows.length === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    // Alternamos el estado (si está activo lo desactivamos, si está inactivo lo activamos)
    const nuevoEstado = !usuarioActual.rows[0].activo;

    const usuarioActualizado = await pool.query(
      `UPDATE usuarios SET activo = $1, actualizado_en = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, nombres, activo`,
      [nuevoEstado, id],
    );

    res.json({
      mensaje: nuevoEstado ? "¡Usuario activado correctamente!" : "¡Usuario desactivado correctamente!",
      usuario: usuarioActualizado.rows[0],
    });
  } catch (error) {
    console.error("Error al cambiar estado de usuario:", error);
    res
      .status(500)
      .json({ mensaje: "Error interno del servidor", error: error.message });
  }
};

// Método para Eliminar un usuario (Hard Delete)
const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuarioEliminado = await pool.query(
      `DELETE FROM usuarios WHERE id = $1 RETURNING id, nombres`,
      [id],
    );

    if (usuarioEliminado.rows.length === 0) {
      return res
        .status(404)
        .json({
          mensaje: "No existe ese usuario para eliminarlo",
        });
    }

    res.json({
      mensaje: "¡Usuario eliminado correctamente!",
      usuario: usuarioEliminado.rows[0],
    });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res
      .status(500)
      .json({ mensaje: "Error interno del servidor", error: error.message });
  }
};

// Método para Listar todos los usuarios
const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await pool.query(
      `SELECT u.id, u.nombres, u.apellidos, u.correo_empresarial, u.correo_personal, u.telefono, u.activo, u.creado_en, u.actualizado_en, r.nombre as rol
       FROM usuarios u
       LEFT JOIN roles r ON u.rol_id = r.id
       ORDER BY u.creado_en DESC`
    );

    res.json({
      mensaje: "Usuarios traídos con éxito",
      cantidad: usuarios.rows.length,
      usuarios: usuarios.rows,
    });
  } catch (error) {
    console.error("Error al listar usuarios:", error);
    res
      .status(500)
      .json({ mensaje: "Error interno del servidor", error: error.message });
  }
};

// Método para Obtener un usuario específico
const obtenerUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await pool.query(
      `SELECT u.id, u.nombres, u.apellidos, u.correo_empresarial, u.correo_personal, u.telefono, u.activo, u.creado_en, u.actualizado_en, r.nombre as rol
       FROM usuarios u
       LEFT JOIN roles r ON u.rol_id = r.id
       WHERE u.id = $1`,
      [id]
    );

    if (usuario.rows.length === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.json({
      mensaje: "Usuario encontrado",
      usuario: usuario.rows[0],
    });
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res
      .status(500)
      .json({ mensaje: "Error interno del servidor", error: error.message });
  }
};

// Método para Listar usuarios por rol
const listarPorRol = async (req, res) => {
  try {
    const { rolId } = req.params;

    const usuarios = await pool.query(
      `SELECT u.id, u.nombres, u.apellidos, u.correo_empresarial, u.correo_personal, u.telefono, u.activo, u.creado_en, u.actualizado_en, r.nombre as rol
       FROM usuarios u
       LEFT JOIN roles r ON u.rol_id = r.id
       WHERE u.rol_id = $1
       ORDER BY u.creado_en DESC`,
      [rolId]
    );

    res.json({
      mensaje: `Usuarios del rol ${rolId} traídos correctamente`,
      cantidad: usuarios.rows.length,
      usuarios: usuarios.rows,
    });
  } catch (error) {
    console.error("Error al listar usuarios por rol:", error);
    res
      .status(500)
      .json({ mensaje: "Error interno del servidor", error: error.message });
  }
};

module.exports = {
  registrarUsuario,
  editarUsuario,
  desactivarUsuario,
  eliminarUsuario,
  listarUsuarios,
  obtenerUsuario,
  listarPorRol,
};
