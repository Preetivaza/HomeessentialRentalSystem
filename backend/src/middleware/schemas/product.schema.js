const toDetails = (errors) => ({ error: { details: errors.map(message => ({ message })) } });

export const productBody = (data = {}) => {
  const errors = [];

  if (!data.name || String(data.name).trim().length < 3) errors.push('Product name must be at least 3 characters');
  if (!data.description || String(data.description).trim().length < 10) errors.push('Description must be at least 10 characters');
  if (!data.category) errors.push('Category is required');

  if (data.pricePerDay === undefined || Number(data.pricePerDay) <= 0) errors.push('Price per day must be greater than 0');
  if (data.securityDeposit === undefined || Number(data.securityDeposit) < 0) errors.push('Security deposit must be 0 or greater');

  return errors.length ? toDetails(errors) : {};
};

export const listProductsQuery = (query = {}) => {
  const errors = [];

  const page = query.page !== undefined ? Number(query.page) : undefined;
  const limit = query.limit !== undefined ? Number(query.limit) : undefined;
  const minPrice = query.minPrice !== undefined ? Number(query.minPrice) : undefined;
  const maxPrice = query.maxPrice !== undefined ? Number(query.maxPrice) : undefined;

  if (page !== undefined && (!Number.isInteger(page) || page <= 0)) errors.push('page must be a positive integer');
  if (limit !== undefined && (!Number.isInteger(limit) || limit <= 0)) errors.push('limit must be a positive integer');

  if (minPrice !== undefined && Number.isNaN(minPrice)) errors.push('minPrice must be a number');
  if (maxPrice !== undefined && Number.isNaN(maxPrice)) errors.push('maxPrice must be a number');
  if (!Number.isNaN(minPrice) && !Number.isNaN(maxPrice) && minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    errors.push('minPrice cannot be greater than maxPrice');
  }

  return errors.length ? toDetails(errors) : {};
};

export const availabilityQuery = (query = {}) => {
  const errors = [];
  if (!query.startDate) errors.push('Start date is required');
  if (!query.endDate) errors.push('End date is required');

  if (query.quantity !== undefined) {
    const q = Number(query.quantity);
    if (!Number.isInteger(q) || q <= 0) errors.push('quantity must be a positive integer');
  }

  return errors.length ? toDetails(errors) : {};
};

export const calculateCostBody = (data = {}) => {
  const errors = [];
  if (!data.startDate) errors.push('Start date is required');
  if (!data.endDate) errors.push('End date is required');

  if (data.quantity !== undefined) {
    const q = Number(data.quantity);
    if (!Number.isInteger(q) || q <= 0) errors.push('quantity must be a positive integer');
  }

  return errors.length ? toDetails(errors) : {};
};

