import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { fetchOrders, placeOrder, cancelOrder } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const [cancelling, setCancelling] = useState({});

  const location = useLocation();
  useEffect(() => {
    if (!isAuthenticated) return;
    setLoading(true);
    const token = localStorage.getItem('token');
    console.log('[Orders Page] Using token:', token);
    fetchOrders(token)
      .then(data => {
        console.log('[Orders Page] Orders fetched:', data);
        setOrders(data);
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));

    // Listen for order-placed event to refresh orders
    const refreshOrders = () => {
      setLoading(true);
      fetchOrders(token)
        .then(data => {
          console.log('[Orders Page] Orders refreshed:', data);
          setOrders(data);
        })
        .catch(() => setOrders([]))
        .finally(() => setLoading(false));
    };
    window.addEventListener('order-placed', refreshOrders);
    return () => window.removeEventListener('order-placed', refreshOrders);
  }, [isAuthenticated, location]);

  const handleCancel = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(prev => ({ ...prev, [orderId]: true }));
    const token = localStorage.getItem('token');
    try {
      await cancelOrder(orderId, token);
      // Optimistically update UI
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'CANCELLED' } : o));
    } catch (e) {
      // Show backend error message if available
      if (e && e.message) {
        alert('Cancel failed: ' + e.message);
      } else {
        alert('Failed to cancel order');
      }
    } finally {
      setCancelling(prev => ({ ...prev, [orderId]: false }));
    }
  };

  if (!isAuthenticated) return <div>Please login to view your orders.</div>;
  if (loading) return <Spinner />;

  return (
    <div style={{ padding: 24 }}>
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <div>No orders found.</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Status</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : '-'}</td>
                <td>{order.status}</td>
                <td>{order.totalAmount !== undefined ? `₹${order.totalAmount}` : '-'}</td>
                <td>
                  {order.status === 'PLACED' ? (
                    <button
                      onClick={() => handleCancel(order.id)}
                      disabled={!!cancelling[order.id]}
                      style={{
                        color: cancelling[order.id] ? 'gray' : 'red',
                        cursor: cancelling[order.id] ? 'not-allowed' : 'pointer',
                        opacity: cancelling[order.id] ? 0.6 : 1,
                        border: '1px solid #ccc',
                        borderRadius: 4,
                        padding: '4px 12px',
                        background: cancelling[order.id] ? '#f8f9fa' : '#fff',
                        minWidth: 80
                      }}
                    >
                      {cancelling[order.id] ? 'Cancelling...' : 'Cancel'}
                    </button>
                  ) : order.status === 'CANCELLED' ? (
                    <span style={{ color: 'gray' }}>Cancelled</span>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Orders;
