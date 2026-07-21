const express = require('express');
const router = express.Router();

const adminController =
    require('../controllers/admin.controller');

const verificarToken =
    require('../middleware/verificarToken');

const verificarAdmin =
    require('../middleware/verificarAdmin');

router.use(verificarToken);
router.use(verificarAdmin);

router.get(
    '/dashboard',
    adminController.obtenerDashboard
);

router.get(
    '/usuarios',
    adminController.listarUsuarios
);

router.patch(
    '/usuarios/:id/estado',
    adminController.cambiarEstadoUsuario
);

// LISTAR VIDEOJUEGOS
router.get(
    '/videojuegos',
    adminController.listarVideojuegos
);

// OBTENER VIDEOJUEGO POR ID
router.get(
    '/videojuegos/:id',
    adminController.obtenerVideojuegoPorId
);

// AGREGAR VIDEOJUEGO
router.post(
    '/videojuegos',
    adminController.agregarVideojuego
);

// EDITAR VIDEOJUEGO
router.put(
    '/videojuegos/:id',
    adminController.editarVideojuego
);

// ELIMINAR VIDEOJUEGO
router.delete(
    '/videojuegos/:id',
    adminController.eliminarVideojuego
);

// ==========================================
// RUTAS DE PREGUNTAS Y RESPUESTAS
// ==========================================

router.get(
  '/preguntas',
  verificarToken,
  verificarAdmin,
  adminController.listarPreguntas
);

router.post(
  '/preguntas',
  verificarToken,
  verificarAdmin,
  adminController.agregarPregunta
);

router.put(
  '/preguntas/:id',
  verificarToken,
  verificarAdmin,
  adminController.editarPregunta
);

router.delete(
  '/preguntas/:id',
  verificarToken,
  verificarAdmin,
  adminController.eliminarPregunta
);

router.get(
  '/historial',
  verificarToken,
  verificarAdmin,
  adminController.listarHistorial
);

router.delete(
  '/historial/:id',
  verificarToken,
  verificarAdmin,
  adminController.eliminarHistorial
);

router.get(
  "/sesiones",
  verificarToken,
  verificarAdmin,
  adminController.listarSesiones
);

router.delete(
  '/sesiones/:id',
  verificarToken,
  verificarAdmin,
  adminController.eliminarSesion
);


module.exports = router;