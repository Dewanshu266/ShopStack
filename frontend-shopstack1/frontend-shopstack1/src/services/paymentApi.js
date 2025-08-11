const API_BASE = 'http://localhost:8080/api';

export const createPaymentOrder = async (cartItems, paymentMethod, token, addressId) => {
  const res = await fetch(`${API_BASE}/payment/create-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ items: cartItems, paymentMethod, addressId }),
  });
  if (!res.ok) throw new Error('Failed to create payment order');
  return res.json();
};
