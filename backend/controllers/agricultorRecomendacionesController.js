// controllers/agricultorRecomendacionesController.js
const pool = require('../config/db');

// Método para Registrar (Crear) una recomendación
const crearRecomendacion = async (req, res) => {
  try {
    const { usuario_id, titulo, descripcion, accion_recomendada, prioridad, color } = req.body;

    const nuevaRecomendacion = await pool.query(
      `INSERT INTO recomendaciones (usuario_id, titulo, descripcion, accion_recomendada, prioridad, color) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, titulo, descripcion, accion_recomendada, prioridad, color, creado_en`,
      [usuario_id, titulo, descripcion, accion_recomendada, prioridad, color]
    );

    res.status(201).json({
      mensaje: '¡Recomendación guardada con éxito!',
      recomendacion: nuevaRecomendacion.rows[0]
    });

  } catch (error) {
    console.error('Error al crear recomendación:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
  }
};

// Método para Editar una recomendación
const editarRecomendacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, accion_recomendada, prioridad, color } = req.body;

    const recomendacionActualizada = await pool.query(
      `UPDATE recomendaciones 
       SET titulo = $1, descripcion = $2, accion_recomendada = $3, prioridad = $4, color = $5, actualizado_en = CURRENT_TIMESTAMP
       WHERE id = $6 
       RETURNING id, titulo, descripcion, accion_recomendada, prioridad, color, actualizado_en`,
      [titulo, descripcion, accion_recomendada, prioridad, color, id]
    );

    if (recomendacionActualizada.rows.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontró esa recomendación' });
    }

    res.json({
      mensaje: '¡Recomendación editada correctamente!',
      recomendacion: recomendacionActualizada.rows[0]
    });

  } catch (error) {
    console.error('Error al editar recomendación:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
  }
};

// Método para Eliminar una recomendación
const eliminarRecomendacion = async (req, res) => {
  try {
    const { id } = req.params;

    const recomendacionEliminada = await pool.query(
      `DELETE FROM recomendaciones WHERE id = $1 RETURNING id, titulo`,
      [id]
    );

    if (recomendacionEliminada.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Esa recomendación no existe' });
    }

    res.json({
      mensaje: '¡Recomendación eliminada correctamente!',
      recomendacion: recomendacionEliminada.rows[0]
    });

  } catch (error) {
    console.error('Error al eliminar recomendación:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
  }
};

// Método para Listar todas las recomendaciones (o filtradas por usuario)
const listarRecomendaciones = async (req, res) => {
  try {
    const { usuario_id } = req.query;

    let query = `SELECT * FROM recomendaciones`;
    let params = [];

    if (usuario_id) {
      query += ` WHERE usuario_id = $1`;
      params = [usuario_id];
    }

    query += ` ORDER BY creado_en DESC`;

    const recomendaciones = await pool.query(query, params);

    res.json({
      mensaje: "Recomendaciones traídas con éxito",
      cantidad: recomendaciones.rows.length,
      recomendaciones: recomendaciones.rows,
    });
  } catch (error) {
    console.error("Error al listar recomendaciones:", error);
    res
      .status(500)
      .json({ mensaje: "Error interno del servidor", error: error.message });
  }
};

// Método para Obtener una recomendación específica
const obtenerRecomendacion = async (req, res) => {
  try {
    const { id } = req.params;

    const recomendacion = await pool.query(
      `SELECT * FROM recomendaciones WHERE id = $1`,
      [id]
    );

    if (recomendacion.rows.length === 0) {
      return res.status(404).json({ mensaje: "Recomendación no encontrada" });
    }

    res.json({
      mensaje: "Recomendación encontrada",
      recomendacion: recomendacion.rows[0],
    });
  } catch (error) {
    console.error("Error al obtener recomendación:", error);
    res
      .status(500)
      .json({ mensaje: "Error interno del servidor", error: error.message });
  }
};

// Método para Listar recomendaciones por usuario
const listarPorUsuario = async (req, res) => {
  try {
    const { usuario_id } = req.params;

    const recomendaciones = await pool.query(
      `SELECT * FROM recomendaciones WHERE usuario_id = $1 ORDER BY creado_en DESC`,
      [usuario_id]
    );

    res.json({
      mensaje: "Recomendaciones del usuario traídas correctamente",
      cantidad: recomendaciones.rows.length,
      recomendaciones: recomendaciones.rows,
    });
  } catch (error) {
    console.error("Error al listar recomendaciones por usuario:", error);
    res
      .status(500)
      .json({ mensaje: "Error interno del servidor", error: error.message });
  }
};

module.exports = {
  crearRecomendacion,
  editarRecomendacion,
  eliminarRecomendacion,
  listarRecomendaciones,
  obtenerRecomendacion,
  listarPorUsuario,
};
