const toDetails = (errors) => ({ error: { details: errors.map(message => ({ message })) } });

export const createOrderBody = (data = {}) => {
  const errors = [];

  if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
    errors.push('Order must have at least one item');
  } else {
    data.items.forEach((item, index) => {
      if (!item.productId) errors.push(`Item ${index + 1} requires productId`);
      if (!item.startDate || !item.endDate) {
        errors.push(`Item ${index + 1} requires start and end dates`);
      } else {
        const startDate = new Date(item.startDate);
        const endDate = new Date(item.endDate);

        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (startDate < today) errors.push(`Item ${index + 1} start date cannot be in the past`);
        if (endDate <= startDate) errors.push(`Item ${index + 1} end date must be after start date`);
      }

      if (item.quantity !== undefined) {
        const q = Number(item.quantity);
        if (!Number.isInteger(q) || q <= 0) errors.push(`Item ${index + 1} quantity must be a positive integer`);
      }
    });
  }

  return errors.length ? toDetails(errors) : {};
};

export const paginationQuery = (query = {}) => {
  const errors = [];
  const page = query.page !== undefined ? Number(query.page) : undefined;
  const limit = query.limit !== undefined ? Number(query.limit) : undefined;

  if (page !== undefined && (!Number.isInteger(page) || page <= 0)) errors.push('page must be a positive integer');
  if (limit !== undefined && (!Number.isInteger(limit) || limit <= 0)) errors.push('limit must be a positive integer');

  return errors.length ? toDetails(errors) : {};
};

export const listOrdersQuery = (query = {}) => {
  const base = paginationQuery(query);
  if (base.error) return base;

  const errors = [];
  if (query.status !== undefined) {
    const valid = ['pending', 'confirmed', 'active', 'completed', 'cancelled'];
    if (!valid.includes(String(query.status))) errors.push('status must be one of pending, confirmed, active, completed, cancelled');
  }

  return errors.length ? toDetails(errors) : {};
};

export const updateOrderStatusBody = (data = {}) => {
  const errors = [];
  const valid = ['pending', 'confirmed', 'active', 'completed', 'cancelled'];
  if (!data.status || !valid.includes(String(data.status))) errors.push('Invalid status');
  return errors.length ? toDetails(errors) : {};
};

