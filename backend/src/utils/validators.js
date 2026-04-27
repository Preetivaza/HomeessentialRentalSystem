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

  if (!data.pricePerDay || data.pricePerDay <= 0) {
    errors.push('Price per day must be greater than 0');
  }

  if (data.securityDeposit === undefined || data.securityDeposit < 0) {
    errors.push('Security deposit must be 0 or greater');
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
  } else {
    data.items.forEach((item, index) => {
      if (!item.startDate || !item.endDate) {
        errors.push(`Item ${index + 1} requires start and end dates`);
      } else {
        const startDate = new Date(item.startDate);
        const endDate = new Date(item.endDate);
        
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (startDate < today) {
          errors.push(`Item ${index + 1} start date cannot be in the past`);
        }

        if (endDate <= startDate) {
          errors.push(`Item ${index + 1} end date must be after start date`);
        }
      }
    });
  }

  if (errors.length > 0) {
    return { error: { details: errors.map(msg => ({ message: msg })) } };
  }

  return {};
};

export const validateBundle = (data) => {
  const errors = [];

  if (!data.name || data.name.trim().length < 3) {
    errors.push('Bundle name must be at least 3 characters');
  }

  if (!data.description || data.description.trim().length < 10) {
    errors.push('Description must be at least 10 characters');
  }

  if (!data.category) {
    errors.push('Category is required');
  }

  if (!data.pricePerMonth || data.pricePerMonth <= 0) {
    errors.push('Price per month must be greater than 0');
  }

  if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
    errors.push('Bundle must have at least one item');
  }

  if (errors.length > 0) {
    return { error: { details: errors.map(msg => ({ message: msg })) } };
  }

  return {};
};
