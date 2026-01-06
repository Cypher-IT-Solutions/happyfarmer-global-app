import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log("Attaching token to request:", token.substring(0, 10) + "...");
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle unauthorized errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If we get a 401 Unauthorized (invalid/expired token)
    if (error.response && error.response.status === 401) {
      console.error("Session expired or invalid token. Redirecting to login...");

      // Clear sensitive auth info
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('viewMode');

      // Force redirect to login page
      // Note: We use window.location because this code is outside of the React lifecycle/routing hooks
      if (window.location.pathname !== '/login') {
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export const getFarmers = async () => {
  try {
    const response = await api.get('/farmers');
    return response.data;
  } catch (error) {
    console.error("Error fetching farmers:", error);
    throw error;
  }
};

export const getFarmerById = async (id) => {
  try {
    const response = await api.get(`/farmers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching farmer ${id}:`, error);
    throw error;
  }
}

export const getProducts = async () => {
  try {
    const response = await api.get('/products');
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getProductsByFarmer = async (farmerId) => {
  try {
    const response = await api.get(`/products/farmer/${farmerId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching products for farmer ${farmerId}:`, error);
    throw error;
  }
}

export const createFarmer = async (farmerData) => {
  const response = await api.post('/farmers', farmerData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const getFarmerOrders = async () => {
  const response = await api.get('/orders/farmer-orders');
  return response.data;
}

export const getMyOrders = async () => {
  const response = await api.get('/orders/my-orders');
  return response.data;
}

export const updateOrderStatus = async (id, status) => {
  const response = await api.put(`/orders/${id}/status`, { status });
  return response.data;
};

export const getMyProducts = async () => {
  const response = await api.get('/products/my-products');
  return response.data;
}

export const upgradeToFarmer = async (farmerData) => {
  const response = await api.post('/farmers/upgrade', farmerData);
  return response.data;
};

export const addProduct = async (productData) => {
  const response = await api.post('/products', productData);
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

// Cart API
export const getCart = async () => {
  const response = await api.get('/cart');
  return response.data;
}

export const addToCartDB = async (productId, quantity = 1) => {
  const response = await api.post('/cart', { productId, quantity });
  return response.data;
}

export const updateCartQuantityDB = async (productId, quantity) => {
  const response = await api.put(`/cart/${productId}`, { quantity });
  return response.data;
}

export const removeFromCartDB = async (productId) => {
  const response = await api.delete(`/cart/${productId}`);
  return response.data;
}

export const clearCartDB = async () => {
  const response = await api.delete('/cart');
  return response.data;
}

// User Profile & Settings API
export const getUserProfile = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};

export const updateUserAddress = async (address) => {
  const response = await api.put('/users/address', { address });
  return response.data;
};

export const changePassword = async (oldPassword, newPassword) => {
  const response = await api.put('/users/password', { oldPassword, newPassword });
  return response.data;
};

export default api;
