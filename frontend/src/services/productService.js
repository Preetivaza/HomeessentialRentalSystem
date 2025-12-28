import api from './api';

export const productService = {
  getProducts: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/products?${params}`);
    return response.data;
  },

  getProduct: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
};
