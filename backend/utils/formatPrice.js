/**
 * Processes database values into formatted Indian pricing output vectors.
 * @param {number} rawNumericalAmount 
 * @returns {string} Formatted Indian Rupee currency layout text notation string.
 */
const formatPriceBackend = (rawNumericalAmount) => {
  if (rawNumericalAmount === undefined || rawNumericalAmount === null) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(rawNumericalAmount);
};

module.exports = formatPriceBackend;