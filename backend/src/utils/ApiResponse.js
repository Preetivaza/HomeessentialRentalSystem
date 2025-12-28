class ApiResponse {
  constructor(statusCode, data, message = 'Success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

export const sendResponse = (res, statusCode, data, message) => {
  const response = new ApiResponse(statusCode, data, message);
  return res.status(statusCode).json(response);
};

export default ApiResponse;
