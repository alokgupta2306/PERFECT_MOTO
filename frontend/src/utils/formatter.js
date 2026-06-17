/**
 * Formats numbers into clean Indian Rupee text strings (₹).
 */
export const formatIndianCurrency = (value) => {
  if (value === undefined || value === null) return "₹0";
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(numValue);
};