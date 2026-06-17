// backend/utils/email.js
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Safe template loader wrapper that falls back gracefully if flat template files are missing
const loadTemplate = (templateName, variables) => {
  try {
    const templatePath = path.join(__dirname, '../templates', `${templateName}.html`);
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Target HTML file template missing from directory node: ${templateName}.html`);
    }
    
    let html = fs.readFileSync(templatePath, 'utf8');
    
    // Replace all {{variable}} placeholders mapping
    Object.keys(variables).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      html = html.replace(regex, variables[key] || '');
    });
    
    return html;
  } catch (fsError) {
    console.warn(`[Template Warning] ${fsError.message}. Generating inline semantic layout instead.`);
    // Fallback minimal safe markup layout frame if .html templates are broken on the disk
    return `
      <div style="font-family:sans-serif; background:#0F0F0F; color:#FFF; padding:30px; border-radius:12px;">
        <h2 style="color:#FFB800; text-transform:uppercase;">Perfect Moto Updates</h2>
        <p>Hello, your order status milestone has advanced.</p>
        <p><b>Context Reference details values map:</b> ${JSON.stringify(variables)}</p>
      </div>
    `;
  }
};

// Generic send function
const sendEmail = async ({ to, subject, htmlTemplate }) => {
  try {
    if (!to) {
      console.error("❌ Email delivery halted: No dispatch email coordinate was supplied.");
      return false;
    }

    const transporter = createTransporter();
    const mailOptions = {
      from: `"Perfect Moto" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlTemplate
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`❌ Email delivery subsystem failure: ${error.message}`);
    return false;
  }
};

// Welcome email
const sendWelcomeEmail = async (user) => {
  const html = loadTemplate('welcomeEmail', {
    name: user.name,
    shopUrl: `${process.env.FRONTEND_URL}/shop`
  });
  return sendEmail({
    to: user.email,
    subject: 'Welcome to Perfect Moto! 🏍️',
    htmlTemplate: html
  });
};

// Order confirmed email
const sendOrderConfirmedEmail = async (order) => {
  const itemsRows = order.items.map(item => `
    <tr style="border-bottom: 1px solid #2A2A2A;">
      <td style="padding: 10px; color: #FFFFFF;">${item.name}</td>
      <td style="padding: 10px; color: #FFB800; font-family: monospace;">${item.quantity}</td>
      <td style="padding: 10px; color: #FFFFFF; font-family: monospace;">₹${item.price.toLocaleString('en-IN')}</td>
    </tr>
  `).join('');

  const html = loadTemplate('orderConfirmedEmail', {
    name: order.user?.name || "Rider",
    orderNumber: order.orderNumber,
    paymentMethod: 'Shiprocket Prepaid Checkout',
    estimatedDelivery: 'Within 7 Working Days (Promise Guaranteed)',
    itemsRows,
    totalAmount: order.totalAmount.toLocaleString('en-IN'),
    deliveryAddress: `${order.shippingAddress.addressLine1}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}`,
    trackUrl: `${process.env.FRONTEND_URL}/track?orderNumber=${order.orderNumber}&phone=${order.shippingAddress.phone}`
  });

  return sendEmail({
    to: order.user?.email,
    subject: `Order Confirmed — ${order.orderNumber} ✅`,
    htmlTemplate: html
  });
};

// Order shipped email
const sendOrderShippedEmail = async (order) => {
  const html = loadTemplate('orderShippedEmail', {
    name: order.user?.name || "Rider",
    orderNumber: order.orderNumber,
    trackingNumber: order.awbCode || order.trackingNumber || 'Processing via Express Hub',
    courierName: 'Shiprocket Express Delivery (BlueDart / DTDC / Delhivery)',
    trackingUrl: order.trackingUrl || `https://track.shiprocket.in/${order.awbCode || order.trackingNumber || ''}`
  });

  return sendEmail({
    to: order.user?.email,
    subject: `Your Order is Shipped! 🚚 — ${order.orderNumber}`,
    htmlTemplate: html
  });
};

// Order delivered email
const sendOrderDeliveredEmail = async (order) => {
  const html = loadTemplate('orderDeliveredEmail', {
    name: order.user?.name || "Rider",
    orderNumber: order.orderNumber,
    deliveredDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
    reviewUrl: `${process.env.FRONTEND_URL}/account/orders/${order._id}`,
    shopUrl: `${process.env.FRONTEND_URL}/shop`
  });

  return sendEmail({
    to: order.user?.email,
    subject: `Delivered! How's your gear? 🎉 — ${order.orderNumber}`,
    htmlTemplate: html
  });
};

// Order cancelled email
const sendOrderCancelledEmail = async (order) => {
  const html = loadTemplate('orderCancelledEmail', {
    name: order.user?.name || "Rider",
    orderNumber: order.orderNumber,
    refundInfo: 'Your prepaid transaction will be fully reversed back to your original source channel within 3-5 business days under our 7-day promise assurance system protocols.'
  });

  return sendEmail({
    to: order.user?.email,
    subject: `Order Cancelled — ${order.orderNumber} ❌`,
    htmlTemplate: html
  });
};

// Review request email
const sendReviewRequestEmail = async (order, user) => {
  const productNames = order.items.map(i => i.name).join(', ');
  const html = loadTemplate('reviewRequestEmail', {
    name: user.name,
    orderNumber: order.orderNumber,
    productNames,
    reviewUrl: `${process.env.FRONTEND_URL}/account/orders/${order._id}`
  });
  return sendEmail({
    to: user.email,
    subject: `How's your Perfect Moto gear? Leave a review ⭐`,
    htmlTemplate: html
  });
};

// Password reset email
const sendPasswordResetEmail = async (user, resetUrl) => {
  const html = loadTemplate('passwordResetEmail', {
    name: user.name,
    resetUrl
  });
  return sendEmail({
    to: user.email,
    subject: 'Reset Your Perfect Moto Password 🔐',
    htmlTemplate: html
  });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendOrderConfirmedEmail,
  sendOrderShippedEmail,
  sendOrderDeliveredEmail,
  sendOrderCancelledEmail, 
  sendReviewRequestEmail,
  sendPasswordResetEmail
};