const API_BASE = 'http://localhost:8080/api';

export const fetchLowStockAnalytics = async (token) => {
  const res = await fetch(`${API_BASE}/admin/analytics/low-stock`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch low stock analytics');
  return res.json();
};

export const fetchOrderStatusHistory = async (orderId, token) => {
  const res = await fetch(`${API_BASE}/orders/${orderId}/status-history`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch order status history');
  return res.json();
};

export const updateOrderStatus = async (orderId, status, token) => {
  const res = await fetch(`${API_BASE}/orders/${orderId}/status?status=${status}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to update order status');
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

export const updateAddress = async (id, address, token) => {
  const res = await fetch(`${API_BASE}/addresses/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(address),
  });
  if (!res.ok) throw new Error('Failed to update address');
  return res.json();
};

export const deleteAddress = async (id, token) => {
  const res = await fetch(`${API_BASE}/addresses/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete address');
  return res;
};
