import React, { useState, useEffect } from 'react';
import { fetchProducts, addProduct, updateProduct, deleteProduct } from '../services/productApi';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminProductDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAdmin, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) return;
    fetchProducts()
      .then(setProducts)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [isAdmin]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id, token);
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      setError('Failed to delete product: ' + err.message);
    }
  };

  if (!isAdmin) return <div>Access denied. Admins only.</div>;
  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: 24 }}>
      <h2>Admin Product Management</h2>
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      <button onClick={() => navigate('/admin/products/new')} style={{ marginBottom: 16 }}>Add New Product</button>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>{product.price}</td>
              <td>{product.quantity}</td>
              <td>
                <button onClick={() => navigate(`/admin/products/${product.id}/edit`)} style={{ marginRight: 8 }}>Edit</button>
                <button onClick={() => handleDelete(product.id)} style={{ color: 'red' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProductDashboard;
