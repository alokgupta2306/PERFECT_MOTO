const ServiceAppointment = require('../models/ServiceAppointment');
const sendWhatsApp = require('../utils/whatsapp');
// Assuming you'll add these two functions to utils/email.js following your existing pattern
const { sendServiceAppointmentEmail } = require('../utils/email');

// @desc    Create a new service appointment
// @route   POST /api/service-appointments
// @access  Auth
exports.createAppointment = async (req, res, next) => {
  try {
    const {
      bikeBrand, bikeModel, bikeYear,
      serviceType, preferredDate, timeSlot,
      deliveryMode, address, notes
    } = req.body;

    if (!bikeBrand || !bikeModel || !bikeYear || !serviceType || !preferredDate || !timeSlot || !deliveryMode) {
      return res.status(400).json({ success: false, message: 'Please fill all required appointment fields.' });
    }

    if (deliveryMode === 'pickup' && !address) {
      return res.status(400).json({ success: false, message: 'Address is required for home pickup.' });
    }

    const appointment = new ServiceAppointment({
      user: req.user._id,
      bikeBrand, bikeModel, bikeYear,
      serviceType, preferredDate, timeSlot,
      deliveryMode, address, notes
    });

    await appointment.save();

    try {
      await sendWhatsApp(req.user.phone, 'service_appointment_booked', [
        { key: 'service_type', value: serviceType },
        { key: 'date', value: new Date(preferredDate).toDateString() }
      ]);
      appointment.whatsappSent = true;
      await appointment.save();
    } catch (whatsappError) {
      console.error('WhatsApp notification failed for service appointment:', whatsappError);
    }

    try {
      await sendServiceAppointmentEmail(appointment, req.user);
    } catch (emailErr) {
      console.error('Service appointment confirmation email failed:', emailErr);
    }

    return res.status(201).json({
      success: true,
      message: 'Service appointment booked successfully.',
      appointment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's service appointments
// @route   GET /api/service-appointments/my
// @access  Auth
exports.getMyAppointments = async (req, res, next) => {
  try {
    const appointments = await ServiceAppointment.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: appointments.length, appointments });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single appointment by ID
// @route   GET /api/service-appointments/:id
// @access  Auth
exports.getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await ServiceAppointment.findById(req.params.id).populate('user', 'name email phone');
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    if (appointment.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    return res.status(200).json({ success: true, appointment });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all service appointments — Admin
// @route   GET /api/service-appointments
// @access  Admin
exports.getAllAppointments = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    let query = {};
    if (status) query.status = status;

    const skipIndex = (Number(page) - 1) * Number(limit);
    const total = await ServiceAppointment.countDocuments(query);
    const appointments = await ServiceAppointment.find(query)
      .sort({ createdAt: -1 })
      .skip(skipIndex)
      .limit(Number(limit))
      .populate('user', 'name email phone');

    return res.status(200).json({
      success: true,
      count: appointments.length,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      appointments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update appointment status — Admin
// @route   PUT /api/service-appointments/:id/status
// @access  Admin
exports.updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status, adminRemarks } = req.body;

    const appointment = await ServiceAppointment.findById(req.params.id).populate('user', 'name email phone');
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    if (status) appointment.status = status.trim().toLowerCase();
    if (adminRemarks !== undefined) appointment.adminRemarks = adminRemarks;

    await appointment.save();

    return res.status(200).json({
      success: true,
      message: `Appointment status updated to ${appointment.status}`,
      appointment
    });
  } catch (error) {
    next(error);
  }
};