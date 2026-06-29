// Uso: router.get('/admin/algo', verifyToken, requireRole('admin'), handler)
function requireRole(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.user || !rolesPermitidos.includes(req.user.role)) {
      return res.status(403).json({ message: 'No tienes permisos para esta acción.' });
    }
    next();
  };
}

module.exports = { requireRole };
