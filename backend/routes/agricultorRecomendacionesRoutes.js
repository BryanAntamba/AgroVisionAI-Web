// routes/agricultorRecomendacionesRoutes.js
const express = require('express');
const router = express.Router();
const { 
  crearRecomendacion, 
  editarRecomendacion, 
  eliminarRecomendacion,
  listarRecomendaciones,
  obtenerRecomendacion,
  listarPorUsuario
} = require('../controllers/agricultorRecomendacionesController');

// Ruta: POST /api/agricultor/recomendaciones
router.post('/', crearRecomendacion);

// Ruta: PUT /api/agricultor/recomendaciones/:id
router.put('/:id', editarRecomendacion);

// Ruta: DELETE /api/agricultor/recomendaciones/:id
router.delete('/:id', eliminarRecomendacion);

// Ruta: GET /api/agricultor/recomendaciones
router.get('/', listarRecomendaciones);

// Ruta: GET /api/agricultor/recomendaciones/:id
router.get('/:id', obtenerRecomendacion);

// Ruta: GET /api/agricultor/recomendaciones/usuario/:usuario_id
router.get('/usuario/:usuario_id', listarPorUsuario);

module.exports = router;
