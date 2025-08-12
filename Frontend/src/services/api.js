const API_BASE = 'http://localhost:8080/api';

export const fetchProducts = async () => {
  const res = await fetch(`${API_BASE}/products`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
};

export const fetchProductById = async (id) => {
  const res = await fetch(`${API_BASE}/products/${id}`);
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
};

export const fetchCart = async (token) => {
  const res = await fetch(`${API_BASE}/user/cart`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch cart');
  return res.json();
};

export const addToCart = async (productId, quantity, token) => {
  const res = await fetch(`${API_BASE}/user/cart/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ productId, quantity }),
  });
  if (!res.ok) throw new Error('Failed to add to cart');
  return res.json();
};

export const removeFromCart = async (cartItemId, token) => {
  const res = await fetch(`${API_BASE}/user/cart/delete/${cartItemId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to remove from cart');
  // Only parse JSON if there is content
  const text = await res.text();
  return text ? JSON.parse(text) : null;
};

export const fetchOrders = async (token) => {
  const res = await fetch(`${API_BASE}/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
};

export const cancelOrder = async (orderId, token) => {
  const res = await fetch(`${API_BASE}/orders/${orderId}/cancel`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to cancel order');
  }
  return res.json();
};

export const placeOrder = async (orderData, token) => {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) throw new Error('Failed to place order');
  return res.json();
};

export const fetchAddresses = async (token) => {
  const res = await fetch(`${API_BASE}/addresses`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch addresses');
  return res.json();
};

export const addAddress = async (address, token) => {
  const res = await fetch(`${API_BASE}/addresses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(address),
  });
  if (!res.ok) throw new Error('Failed to add address');
  return res.json();
};

export const deleteAddress = async (addressId, token) => {
  const res = await fetch(`${API_BASE}/addresses/${addressId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete address');
  return res.json();
};

export const fetchReviews = async (productId) => {
  const res = await fetch(`${API_BASE}/products/${productId}/reviews`);
  if (!res.ok) throw new Error('Failed to fetch reviews');
  return res.json();
};

export const addReview = async (productId, review, token) => {
  const res = await fetch(`${API_BASE}/products/${productId}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(review),
  });
  if (!res.ok) throw new Error('Failed to add review');
  return res.json();
};

export const fetchAdminDashboard = async (token) => {
  const res = await fetch(`${API_BASE}/admin/dashboard`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch admin dashboard');
  return res.json();
};
