// routes/adminUsuariosRoutes.js
const express = require("express");
const router = express.Router();
const {
  registrarUsuario,
  editarUsuario,
  desactivarUsuario,
  eliminarUsuario,
  listarUsuarios,
  obtenerUsuario,
  listarPorRol,
} = require("../controllers/adminUsuariosController");

// GET - Listar todos los usuarios
router.get("/", listarUsuarios);

// GET - Obtener un usuario específico
router.get("/:id", obtenerUsuario);

// GET - Listar usuarios por rol
router.get("/rol/:rolId", listarPorRol);

// POST - Registrar usuario
router.post("/", registrarUsuario);

// PUT - Editar usuario
router.put("/:id", editarUsuario);

// PATCH - Desactivar usuario
router.patch("/:id/estado", desactivarUsuario);

// DELETE - Eliminar usuario
router.delete("/:id", eliminarUsuario);

module.exports = router;
