import axios from 'axios';

const API_BASE_URL = `${process.env.REACT_APP_BASE_URL}/api`;

// Company API calls
export const companyServices = {
  // Get all companies
  getCompanies: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/companies/get-companies`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add new company
  addCompany: async (companyData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/companies/add-company`, companyData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update company
  updateCompany: async (id, companyData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/companies/update-company/${id}`, companyData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete company
  deleteCompany: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/companies/delete-company/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Add Company Stock API calls
export const addCompanyStockServices = {
  // Get all add stock entries
  getAddStocks: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/add-company-stock/get-company-stock`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add new stock entry
  addStock: async (stockData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/add-company-stock/add-company-stock`, stockData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update stock entry
  updateStock: async (id, stockData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/add-company-stock/update-company-stock/${id}`, stockData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete stock entry
  deleteStock: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/add-company-stock/delete-company-stock/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Sale Company Stock API calls
export const saleCompanyStockServices = {
  // Get all sale stock entries
  getSaleStocks: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/sale-company-stock/get-sale-company-stock`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add new sale entry
  addSaleStock: async (saleData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/sale-company-stock/add-sale-company-stock`, saleData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update sale entry
  updateSaleStock: async (id, saleData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/sale-company-stock/update-sale-company-stock/${id}`, saleData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete sale entry
  deleteSaleStock: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/sale-company-stock/delete-sale-company-stock/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}; 