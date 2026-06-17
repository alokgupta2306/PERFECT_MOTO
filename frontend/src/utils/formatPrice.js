/**
 * Transforms numbers into formatted Indian Rupee strings (₹) matching Lakh/Crore grouping rules.
 * @param {number|string} amount - The pure numerical or string input.
 * @returns {string} Fully masked currency value string (e.g., ₹1,50,000).
 */
export const formatPrice = (amount) => {
  if (amount === undefined || amount === null) return "₹0";
  const numValue = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(numValue)) return "₹0";
  
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(numValue);
};

// FIXED (Issue 1): Appended explicit export matching the import signature expected across ProductCard components
export const formatIndianCurrency = (amount) => {
  return formatPrice(amount);
};

// Preserves default modular compatibility across fallback interface files
export default formatPrice;