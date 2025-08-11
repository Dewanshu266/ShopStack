import React, { useState, useEffect } from 'react';
import Spinner from '../components/Spinner';
import { fetchOrderStatusHistory, updateOrderStatus } from '../services/extraApi';
import { useAuth } from '../context/AuthContext';

const OrderStatusHistory = ({ orderId }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    const token = localStorage.getItem('token');
    fetchOrderStatusHistory(orderId, token)
      .then(setHistory)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [orderId]);
  if (loading) return <Spinner />;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  return (
    <div>
      <h4>Status History</h4>
      <ul>
        {history.map(h => (
          <li key={h.id}>{h.status} at {new Date(h.timestamp).toLocaleString()}</li>
        ))}
      </ul>
    </div>
  );
};

const OrdersAdmin = () => {
  const [orderId, setOrderId] = useState('');
  const [status, setStatus] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const { isAdmin } = useAuth();
  const handleUpdate = async () => {
    setError('');
    try {
      const token = localStorage.getItem('token');
      const updated = await updateOrderStatus(orderId, status, token);
      setResult(updated);
    } catch (err) {
      setError(err.message);
    }
  };
  if (!isAdmin) return <div>Access denied. Admins only.</div>;
  return (
    <div style={{ padding: 24 }}>
      <h2>Order Management</h2>
      <div style={{ marginBottom: 16 }}>
        <input value={orderId} onChange={e => setOrderId(e.target.value)} placeholder="Order ID" style={{ marginRight: 8 }} />
        <input value={status} onChange={e => setStatus(e.target.value)} placeholder="New Status" style={{ marginRight: 8 }} />
        <button onClick={handleUpdate}>Update Status</button>
      </div>
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      {result && (
        <div>
          <h4>Order Updated</h4>
          <div>ID: {result.id}</div>
          <div>Status: {result.status}</div>
          <OrderStatusHistory orderId={orderId} />
        </div>
      )}
    </div>
  );
};

export default OrdersAdmin;
