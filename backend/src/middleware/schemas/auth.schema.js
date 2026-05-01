import validator from 'validator';

const toDetails = (errors) => ({ error: { details: errors.map(message => ({ message })) } });

export const registerBody = (data = {}) => {
  const errors = [];

  if (!data.name || String(data.name).trim().length < 2) errors.push('Name must be at least 2 characters');
  if (!data.email || !validator.isEmail(String(data.email))) errors.push('Valid email is required');
  if (!data.password || String(data.password).length < 6) errors.push('Password must be at least 6 characters');
  if (!data.phone || !validator.isMobilePhone(String(data.phone), 'any')) errors.push('Valid phone number is required');

  return errors.length ? toDetails(errors) : {};
};

export const loginBody = (data = {}) => {
  const errors = [];

  if (!data.email || !validator.isEmail(String(data.email))) errors.push('Valid email is required');
  if (!data.password) errors.push('Password is required');

  return errors.length ? toDetails(errors) : {};
};

export const googleLoginBody = (data = {}) => {
  const errors = [];
  if (!data.token || String(data.token).trim().length === 0) errors.push('Google token is required');
  return errors.length ? toDetails(errors) : {};
};

export const forgotPasswordBody = (data = {}) => {
  const errors = [];
  if (!data.email || !validator.isEmail(String(data.email))) errors.push('Valid email is required');
  return errors.length ? toDetails(errors) : {};
};

export const resetPasswordParams = (params = {}) => {
  const errors = [];
  if (!params.resetToken || String(params.resetToken).trim().length === 0) errors.push('Reset token is required');
  return errors.length ? toDetails(errors) : {};
};

export const resetPasswordBody = (data = {}) => {
  const errors = [];
  if (!data.password || String(data.password).length < 6) errors.push('Password must be at least 6 characters');
  return errors.length ? toDetails(errors) : {};
};

