/**
 * Parses cloud-hosted graphic keys to extract optimized rendering dimensions.
 * @param {string} rawImageUrl - Original asset network address string.
 * @param {string} configurationTransformations - Desired visual scaling rules (e.g., w_300,c_fill).
 * @returns {string} Sanitized remote image delivery URL.
 */
export const getOptimizedCloudinaryUrl = (rawImageUrl, configurationTransformations = "q_auto,f_auto") => {
  if (!rawImageUrl) return "";
  if (!rawImageUrl.includes("res.cloudinary.com")) return rawImageUrl;

  // Split paths directly at the upload signature divider
  const targetTokenSeparator = "/upload/";
  const pathParts = rawImageUrl.split(targetTokenSeparator);
  
  if (pathParts.length !== 2) return rawImageUrl;
  
  return `${pathParts[0]}${targetTokenSeparator}${configurationTransformations}/${pathParts[1]}`;
};

export default getOptimizedCloudinaryUrl;