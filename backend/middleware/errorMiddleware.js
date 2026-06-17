const errorHandler = (err, req, res, next) => {
  console.error('SERVER_ERROR_TRACE:', err.stack);

  // Mongoose duplicate data key insertion exception handling code
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `Duplicate data entity value detected: '${field}' parameter must be unique.`
    });
  }

  // Mongoose dataset model formatting syntax parsing error handling
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({ success: false, message: messages.join(', ') });
  }

  // Mongoose CastError handling (e.g., passing a malformed hex string as an ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Resource parameters format error' });
  }

  // Generic system failure recovery configuration standard
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal processing error occurred in the motor engine server'
  });
};

module.exports = errorHandler;