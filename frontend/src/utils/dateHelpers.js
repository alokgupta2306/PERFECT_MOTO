/**
 * Transforms raw database date items into structured local time logs.
 */
export const formatLogTimestamp = (dateString) => {
  if (!dateString) return "Recent Log";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
};

/**
 * Calculates time differences to confirm 7-day product change return policy windows.
 */
export const verifyReturnPolicyEligibility = (deliveryDateString, policyDaysLimit = 7) => {
  if (!deliveryDateString) return false;
  const currentTimestamp = new Date();
  const deliveryTimestamp = new Date(deliveryDateString);
  
  const timeDifference = currentTimestamp.getTime() - deliveryTimestamp.getTime();
  const calculatedDays = timeDifference / (1000 * 3600 * 24);
  
  return calculatedDays <= policyDaysLimit;
};