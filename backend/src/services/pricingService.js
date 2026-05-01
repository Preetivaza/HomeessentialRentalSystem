import { ErrorResponse } from '../middleware/errorHandler.js';

class PricingService {
  calculateRentalCost(product, startDateParam, endDateParam, quantity) {
    const start = new Date(startDateParam);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDateParam);
    end.setHours(0, 0, 0, 0);

    let duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    if (duration <= 0) {
      throw new ErrorResponse('End date must be after start date', 400);
    }

    duration = Math.max(duration, product.minRentalDays || 1);

    if (product.maxRentalDays && duration > product.maxRentalDays) {
      throw new ErrorResponse(
        `Duration exceeds maximum permitted rental period of ${product.maxRentalDays} days`,
        400
      );
    }

    const baseRent = product.pricePerDay * duration * quantity;
    const deposit = product.securityDeposit * quantity;

    const tax = baseRent * 0.18;
    const delivery = 0;

    const total = baseRent + tax + deposit + delivery;

    return {
      baseRent,
      deposit,
      tax,
      delivery,
      total,
      duration,
    };
  }

  calculateInsuranceAmount(rentTotal, insuranceOpted) {
    if (!insuranceOpted) return 0;
    return Math.round(rentTotal * 0.05 * 100) / 100;
  }
}

export default new PricingService();

