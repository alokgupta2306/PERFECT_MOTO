const Order = require('../models/Order');

const generateOrderNumber = async () => {
  try {
    const currentYear = new Date().getFullYear();
    
    // Look up the newest order containing the matching prefix system code layout
    const lastOrder = await Order.findOne({
      orderNumber: new RegExp(`^PM-${currentYear}-`, 'i')
    })
    .sort({ createdAt: -1 })
    .select('orderNumber');

    let nextSequenceNumber = 1;

    if (lastOrder && lastOrder.orderNumber) {
      // Pull out sequence code value from existing document tracking key text string
      const lastSequenceString = lastOrder.orderNumber.split('-')[2];
      nextSequenceNumber = parseInt(lastSequenceString, 10) + 1;
    }

    // Return structured text string mapping layout formatting rules (e.g. PM-2026-0001)
    const paddedSequence = String(nextSequenceNumber).padStart(4, '0');
    return `PM-${currentYear}-${paddedSequence}`;
  } catch (error) {
    throw new Error(`Order Number Generation Tracking System Error: ${error.message}`);
  }
};

module.exports = generateOrderNumber;