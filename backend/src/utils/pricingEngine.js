import pricingService from '.000./services/pricingService.js';

// Back-compat export: logic now lives in pricingService.
export const calculateRentalCost = (...args) => pricingService.calculateRentalCost(...args);
