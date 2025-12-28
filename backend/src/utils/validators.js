import validator from 'validator';

export const validateRegister = (data) => {
  const errors = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }

  if (!data.email || !validator.isEmail(data.email)) {
    errors.push('Valid email is required');
  }

  if (!data.password || data.password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  if (!data.phone || !validator.isMobilePhone(data.phone, 'any')) {
    errors.push('Valid phone number is required');
  }

  if (errors.length > 0) {
    return { error: { details: errors.map(msg => ({ message: msg })) } };
  }

  return {};
};

export const validateLogin = (data) => {
  const errors = [];

  if (!data.email || !validator.isEmail(data.email)) {
    errors.push('Valid email is required');
  }

  if (!data.password) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return { error: { details: errors.map(msg => ({ message: msg })) } };
  }

  return {};
};

export const validateProduct = (data) => {
  const errors = [];

  if (!data.name || data.name.trim().length < 3) {
    errors.push('Product name must be at least 3 characters');
  }

  if (!data.description || data.description.trim().length < 10) {
    errors.push('Description must be at least 10 characters');
  }

  if (!data.category) {
    errors.push('Category is required');
  }

  if (!data.dailyRate || data.dailyRate <= 0) {
    errors.push('Daily rate must be greater than 0');
  }

  if (!data.deposit || data.deposit < 0) {
    errors.push('Deposit must be 0 or greater');
  }

  if (errors.length > 0) {
    return { error: { details: errors.map(msg => ({ message: msg })) } };
  }

  return {};
};

export const validateOrder = (data) => {
  const errors = [];

  if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
    errors.push('Order must have at least one item');
  }

  if (!data.rentalPeriod || !data.rentalPeriod.startDate || !data.rentalPeriod.endDate) {
    errors.push('Rental period with start and end dates is required');
  }

  if (data.rentalPeriod) {
    const startDate = new Date(data.rentalPeriod.startDate);
    const endDate = new Date(data.rentalPeriod.endDate);

    if (startDate >= endDate) {
      errors.push('End date must be after start date');
    }

    if (startDate < new Date()) {
      errors.push('Start date cannot be in the past');
    }
  }

  if (errors.length > 0) {
    return { error: { details: errors.map(msg => ({ message: msg })) } };
  }

  return {};
};
