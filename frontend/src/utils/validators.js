/**
 * Evaluates text to confirm standard email schema.
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(String(email).toLowerCase());
};

/**
 * Validates standard 10-digit Indian mobile number strings.
 */
export const validateIndianPhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(String(phone));
};

/**
 * Evaluates password length parameters for security compliance.
 */
export const validatePasswordStrength = (password) => {
  // Enforces a minimum 6-character length string limit
  return String(password).length >= 6;
};

/**
 * Sweeps input parameters to protect against empty spacing strings.
 */
export const isRequiredFieldPresent = (value) => {
  if (value === undefined || value === null) return false;
  return String(value).trim().length > 0;
};