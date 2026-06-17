const axios = require('axios');

const sendWhatsAppNotification = async (phone, templateName, parametersArray) => {
  try {
    if (!process.env.WATI_API_KEY || !process.env.WATI_BASE_URL) {
      console.log('WhatsApp credentials missing. Skipping.');
      return false;
    }

    const cleanedPhone = phone.replace(/\D/g, '');
    const indianPhone = cleanedPhone.startsWith('91') ? cleanedPhone : `91${cleanedPhone}`;

    const response = await axios.post(
      `${process.env.WATI_BASE_URL}/api/v1/sendTemplateMessage?whatsappNumber=${indianPhone}`,
      {
        template_name: templateName,
        broadcast_name: templateName,
        parameters: parametersArray
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WATI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(`WhatsApp sent to ${indianPhone} | Template: ${templateName}`);
    return true;
  } catch (error) {
    console.error(`WhatsApp failed: ${error.message}`);
    return false; // Never block order processing
  }
};

// Order confirmed
const sendOrderConfirmedWhatsApp = async (phone, name, orderNumber) => {
  return sendWhatsAppNotification(phone, 'order_confirmed', [
    { name: 'name', value: name },
    { name: 'order_number', value: orderNumber }
  ]);
};

// Order shipped
const sendOrderShippedWhatsApp = async (phone, name, orderNumber, trackingNumber) => {
  return sendWhatsAppNotification(phone, 'order_shipped', [
    { name: 'name', value: name },
    { name: 'order_number', value: orderNumber },
    { name: 'tracking_number', value: trackingNumber }
  ]);
};

// Order delivered
const sendOrderDeliveredWhatsApp = async (phone, name, orderNumber) => {
  return sendWhatsAppNotification(phone, 'order_delivered', [
    { name: 'name', value: name },
    { name: 'order_number', value: orderNumber }
  ]);
};

// Notify me — back in stock
const sendNotifyMeWhatsApp = async (phone, productName) => {
  return sendWhatsAppNotification(phone, 'notify_me_alert', [
    { name: 'product_name', value: productName }
  ]);
};

// Review request
const sendReviewRequestWhatsApp = async (phone, name, orderNumber) => {
  return sendWhatsAppNotification(phone, 'review_request', [
    { name: 'name', value: name },
    { name: 'order_number', value: orderNumber }
  ]);
};

module.exports = {
  sendWhatsAppNotification,
  sendOrderConfirmedWhatsApp,
  sendOrderShippedWhatsApp,
  sendOrderDeliveredWhatsApp,
  sendNotifyMeWhatsApp,
  sendReviewRequestWhatsApp
};