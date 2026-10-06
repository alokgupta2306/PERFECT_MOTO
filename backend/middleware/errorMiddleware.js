const multer = require("multer");

const errorHandler = (err, req, res, next) => {
  // Safe logging: prints stack if available, otherwise dumps the full error object/string
  console.error('SERVER_ERROR_TRACE:', err?.stack || err);

  // 1. Handle Multer-Specific Errors (File size limit, unexpected field, etc.)
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size limit exceeded. Please upload an image under 5MB.'
      });
    }
    return res.status(400).json({
      success: false,
      message: `Upload error: ${err.message}`
    });
  }

  // Extract message safely from Error instances or Cloudinary raw object rejections
  const errorMessage = err?.message || (typeof err === 'string' ? err : null);

  // 2. Handle Custom File Filter Errors (Mimetype mismatch from mechanicalImageFilter)
  if (errorMessage && errorMessage.includes("Mimetype mismatch")) {
    return res.status(400).json({
      success: false,
      message: errorMessage
    });
  }

  // 3. Mongoose duplicate data key insertion exception handling code
  if (err?.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(400).json({
      success: false,
      message: `Duplicate data entity value detected: '${field}' parameter must be unique.`
    });
  }

  // 4. Mongoose dataset model formatting syntax parsing error handling
  if (err?.name === 'ValidationError') {
    const messages = Object.values(err.errors || {}).map(val => val.message);
    return res.status(400).json({ success: false, message: messages.join(', ') });
  }

  // 5. Mongoose CastError handling (e.g., passing a malformed hex string as an ObjectId)
  if (err?.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Resource parameters format error' });
  }

  // 6. Generic system failure recovery (Handles Cloudinary rejection objects & unexpected errors)
  const statusCode = err?.status || err?.http_code || 500;
  res.status(statusCode).json({
    success: false,
    message: errorMessage || 'Internal processing error occurred in the motor engine server'
  });
};

module.exports = errorHandler;