import React, { useState, useEffect } from 'react';
import Spinner from '../components/Spinner';
import { fetchLowStockProducts } from '../services/productApi';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (!isAdmin) return;
    fetchLowStockProducts()
      .then(setLowStock)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [isAdmin]);

  if (!isAdmin) return <div>Access denied. Admins only.</div>;
  if (loading) return <Spinner />;

  return (
    <div style={{ padding: 24 }}>
      <h2>Admin Dashboard</h2>
      <h3>Low Stock Analytics</h3>
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {lowStock.length === 0 ? (
          <div>No low stock products.</div>
        ) : (
          lowStock.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
