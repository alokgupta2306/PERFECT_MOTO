const express = require('express');
const {
  createAppointment,
  getMyAppointments,
  getAppointmentById,
  getAllAppointments,
  updateAppointmentStatus
} = require('../controllers/serviceAppointmentController');
const { verifyToken } = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/adminMiddleware');

const router = express.Router();

// ============================================================================
// 🔧 PROTECTED CUSTOMER SERVICE APPOINTMENT ROUTES
// ============================================================================

// ⚠️ ORDER OF EXECUTION NOTICE: Static path /my MUST be initialized
// before dynamic parameter endpoint /:id to prevent parameter string hijacking.

router.post('/', verifyToken, createAppointment);
router.get('/my', verifyToken, getMyAppointments);
router.get('/:id', verifyToken, getAppointmentById);

// ============================================================================
// 🛠️ PROTECTED ADMINISTRATIVE SERVICE APPOINTMENT ROUTES
// ============================================================================

router.get('/', verifyToken, requireAdmin, getAllAppointments);
router.put('/:id/status', verifyToken, requireAdmin, updateAppointmentStatus);

module.exports = router;