import api from './api';

export const productService = {
  getProducts: async (filters = {}, options = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/products?${params}`, options);
    return response.data;
  },

  getProduct: async (id, options = {}) => {
    const response = await api.get(`/products/${id}`, options);
    return response.data;
  },

  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  calculateCost: async (id, data, options = {}) => {
    const response = await api.post(`/products/${id}/calculate`, data, options);
    return response.data;
  }
};
