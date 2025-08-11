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

export const fetchProductsByCategory = async (category) => {
  const res = await fetch(`${API_BASE}/products/category/${category}`);
  if (!res.ok) throw new Error('Failed to fetch products by category');
  return res.json();
};

export const fetchLowStockProducts = async () => {
  const res = await fetch(`${API_BASE}/products/low-stock`);
  if (!res.ok) throw new Error('Failed to fetch low stock products');
  return res.json();
};

export const fetchRecommendedProducts = async (id) => {
  const res = await fetch(`${API_BASE}/products/${id}/recommendations`);
  if (!res.ok) throw new Error('Failed to fetch recommended products');
  return res.json();
};

export const addProduct = async (product, token, imageFile) => {
  const formData = new FormData();
  formData.append('product', new Blob([JSON.stringify(product)], { type: 'application/json' }));
  if (imageFile) {
    formData.append('image', imageFile);
  }
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to add product');
  return res.json();
};

export const updateProduct = async (id, product, token, imageFile) => {
  if (imageFile) {
    const formData = new FormData();
    formData.append('product', new Blob([JSON.stringify(product)], { type: 'application/json' }));
    formData.append('image', imageFile);
    const res = await fetch(`${API_BASE}/products/${id}/update`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!res.ok) throw new Error('Failed to update product');
    return res.json();
  } else {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error('Failed to update product');
    return res.json();
  }
};

export const deleteProduct = async (id, token) => {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete product');
  return res;
};

export const updateStock = async (id, quantityChange, token) => {
  const res = await fetch(`${API_BASE}/products/${id}/update-stock?quantityChange=${quantityChange}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to update stock');
  return res.json();
};
