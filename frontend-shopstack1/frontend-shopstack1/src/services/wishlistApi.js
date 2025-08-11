const API_BASE = 'http://localhost:8080/api';

export const fetchWishlist = async (token) => {
  const res = await fetch(`${API_BASE}/wishlist`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch wishlist');
  return res.json();
};

export const addToWishlist = async (productId, token) => {
  const res = await fetch(`${API_BASE}/wishlist/add/${productId}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to add to wishlist');
  return res.json();
};

export const removeFromWishlist = async (productId, token) => {
  const res = await fetch(`${API_BASE}/wishlist/remove/${productId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to remove from wishlist');
  return res.json();
};
