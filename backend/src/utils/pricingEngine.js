/**
 * Centralized calculation engine for all rental metrics.
 * Server must be the Single Source of Truth for math.
 */
export const calculateRentalCost = (product, startDateParam, endDateParam, quantity) => {
  const start = new Date(startDateParam);
  start.setHours(0, 0, 0, 0);

  const end = new Date(endDateParam);
  end.setHours(0, 0, 0, 0);

  let duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  
  if (duration <= 0) {
    throw new Error('End date must be after start date');
  }

  // Ensure minimum constraints
  duration = Math.max(duration, product.minRentalDays || 1);

  // Reject violations immediately
  if (product.maxRentalDays && duration > product.maxRentalDays) {
    throw new Error(`Duration exceeds maximum permitted rental period of ${product.maxRentalDays} days`);
  }

  const baseRent = product.pricePerDay * duration * quantity;
  const deposit = product.securityDeposit * quantity;
  
  // Tax logic: Flat 18% GST typical for equipment rent (standard rule assigned)
  const tax = baseRent * 0.18;
  const delivery = 0; // standard mock variable
  
  const total = baseRent + tax + deposit + delivery;

  return {
    baseRent,
    deposit,
    tax,
    delivery,
    total,
    duration
  };
};
