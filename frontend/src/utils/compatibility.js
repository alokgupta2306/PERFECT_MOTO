/**
 * Cross-references a product's fitment mappings against a rider's active vehicle parameters.
 */
export const checkVehicleFitment = (productCompatibleBikes, activeGarageBike) => {
  if (!activeGarageBike || !productCompatibleBikes) return "neutral";
  
  const isCompatible = productCompatibleBikes.some(
    (bike) =>
      bike.brand.toLowerCase() === activeGarageBike.brand.toLowerCase() &&
      bike.model.toLowerCase() === activeGarageBike.model.toLowerCase()
  );
  
  return isCompatible ? "compatible" : "misfit";
};