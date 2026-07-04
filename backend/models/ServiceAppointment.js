const mongoose = require('mongoose');

const serviceAppointmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bikeBrand: { type: String, required: true },
  bikeModel: { type: String, required: true },
  bikeYear: { type: Number, required: true },
  serviceType: {
    type: String,
    enum: ['General Service', 'Repair', 'Tyre Change', 'Oil Change', 'Full Checkup', 'Other'],
    required: true
  },
  preferredDate: { type: Date, required: true },
  timeSlot: { type: String, required: true }, // e.g. "9AM-11AM"
  deliveryMode: { type: String, enum: ['pickup', 'drop'], required: true },
  address: { type: String }, // required only if deliveryMode === 'pickup', validate in controller
  notes: { type: String },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  adminRemarks: { type: String },
  whatsappSent: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Index for admin filtering by status and date
serviceAppointmentSchema.index({ status: 1, preferredDate: -1 });
// Index for customer's own appointments
serviceAppointmentSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('ServiceAppointment', serviceAppointmentSchema);