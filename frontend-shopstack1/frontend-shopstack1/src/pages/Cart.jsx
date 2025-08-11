import LogoButton from '../components/LogoButton';
import { Container, Row, Col, Table, Button, Form, Spinner as BSpinner, Alert } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { fetchCart, addToCart, removeFromCart, fetchAddresses } from '../services/api';

// Use the new endpoint for placing orders from cart
const placeOrderFromCart = async (orderData, token) => {
  const res = await fetch('http://localhost:8080/api/orders/place', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) throw new Error('Failed to place order');
  return res.json();
};

// Razorpay script loader
function loadRazorpayScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}
// ...existing code...
const Cart = () => {
  const navigate = useNavigate();
  // Remove item from cart
  const handleRemove = async (cartItemId) => {
    try {
      const token = localStorage.getItem('token');
      await removeFromCart(cartItemId, token);
      // Refresh cart after removal
      const cartData = await fetchCart(token);
      setCart(cartData.items || []);
    } catch (err) {
      setCartError('Failed to remove item from cart.');
    }
  };

  // Fetch addresses on mount
  useEffect(() => {
    const fetchUserAddresses = async () => {
      setAddressLoading(true);
      try {
        const token = localStorage.getItem('token');
        const addressesData = await fetchAddresses(token);
        setAddresses(addressesData || []);
      } catch (err) {
        setAddresses([]);
      } finally {
        setAddressLoading(false);
      }
    };
    fetchUserAddresses();
  }, []);
  const [placingOrder, setPlacingOrder] = useState(false);
  const location = useLocation();
  // Fetch cart on mount and whenever location changes (e.g., after navigating to /cart)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const cartData = await fetchCart(token);
        setCart(cartData.items || []);
      } catch (err) {
        setCartError('Failed to load cart.');
      }
    };
    fetchData();
  }, [location]);
  // State initialization (no duplicates, correct order)
  const [cart, setCart] = useState([]);
  const [cartError, setCartError] = useState("");
  const [orderError, setOrderError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("RAZORPAY");
  const [addressLoading, setAddressLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  // Ensure cart is always an array for safe rendering
  const safeCart = Array.isArray(cart) ? cart : [];

  // ...existing code...
  // Handle order placement
  const handlePlaceOrder = async () => {
    setPlacingOrder(true);
    setOrderError("");
    try {
      const token = localStorage.getItem('token');
      const response = await placeOrderFromCart({ addressId: selectedAddress, paymentMethod }, token);
      // If payment method is Razorpay and response contains paymentId, trigger Razorpay modal
  if (paymentMethod === 'RAZORPAY' && response && response.length > 0 && response[0].paymentId) {
        const loaded = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
        if (!loaded) {
          setOrderError('Failed to load Razorpay SDK.');
          setPlacingOrder(false);
          return;
        }
        const order = response[0];
        const options = {
          key: 'rzp_test_7eHty2v7oDxvIG', // Replace with your Razorpay key
          amount: order.totalAmount * 100,
          currency: 'INR',
          name: 'ShopStack',
          description: 'Order Payment',
          order_id: order.paymentId,
          handler: function (res) {
            setOrderSuccess(true);
            setCart([]);
            setSelectedAddress("");
            setPaymentMethod("RAZORPAY");
            window.dispatchEvent(new Event('order-placed'));
            setTimeout(() => setOrderSuccess(false), 1000);
            navigate('/orders');
          },
          prefill: {},
          theme: { color: '#3399cc' },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // For other payment methods or COD, just show success
  setOrderSuccess(true);
  setCart([]);
  setSelectedAddress("");
  setPaymentMethod("RAZORPAY");
  window.dispatchEvent(new Event('order-placed'));
  setTimeout(() => setOrderSuccess(false), 1000);
  navigate('/orders');
      }
    } catch (err) {
      setOrderError('Failed to place order.');
    } finally {
      setPlacingOrder(false);
    }
  };
  return (
    <Container className="py-5" style={{ minHeight: '90vh', background: 'linear-gradient(135deg, #e0f7fa 0%, #f8fafc 100%)', borderRadius: 18, boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)' }}>
      <Row className="justify-content-center mb-4">
        <Col xs="auto">
          <LogoButton icon="cart" text="ShopStack Cart" style={{ fontSize: 28, padding: '12px 36px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderRadius: 12, background: 'rgba(255,255,255,0.8)' }} disabled />
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={8} lg={7}>
          {orderSuccess && <Alert variant="success" className="shadow-sm">Order placed successfully!</Alert>}
          {orderError && <Alert variant="danger" className="shadow-sm">{orderError}</Alert>}
          {cartError && <Alert variant="danger" className="shadow-sm">{cartError}</Alert>}
          {(!safeCart || safeCart.length === 0) ? (
            <div className="d-flex flex-column align-items-center justify-content-center p-5 bg-white rounded-4 shadow-sm" style={{ minHeight: 300 }}>
              <i className="bi bi-cart-x display-3 text-secondary mb-3" />
              <h4>Your cart is empty.</h4>
              <p className="text-muted">Add some products to see them here!</p>
            </div>
          ) : !cartError ? (
            <Row>
              <Col md={8} className="mb-4 mb-md-0">
                <div className="bg-white rounded-4 shadow p-4 mb-4" style={{ border: '1px solid #e3e3e3' }}>
                  <h5 className="mb-4 fw-bold" style={{ letterSpacing: 1 }}>Cart Items</h5>
                  <Table hover borderless responsive className="mb-0 align-middle">
                    <thead className="bg-light">
                      <tr style={{ fontSize: 17 }}>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {safeCart.map(item => (
                        <tr key={item.id} style={{ background: '#f8fafc', borderRadius: 8 }}>
                          <td className="fw-semibold">{item.product?.name || <span className="text-danger">No product</span>}</td>
                          <td>{item.quantity}</td>
                          <td>{item.product ? `₹${item.product.price}` : '-'}</td>
                          <td>
                            <Button variant="outline-danger" size="sm" className="rounded-pill px-3 py-1" onClick={() => handleRemove(item.id)}>
                              <i className="bi bi-trash" /> Remove
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Col>
              <Col md={4}>
                <div className="bg-white rounded-4 shadow p-4 mb-4" style={{ border: '1px solid #e3e3e3', minHeight: 320 }}>
                  <h5 className="mb-3 fw-bold">Order Summary</h5>
                  <div className="mb-3">
                    <span className="text-muted">Total Items:</span> <span className="fw-semibold">{safeCart.length}</span>
                  </div>
                  <div className="mb-3">
                    <span className="text-muted">Total Price:</span> <span className="fw-semibold">₹{safeCart.reduce((sum, item) => sum + (item.product ? item.product.price * item.quantity : 0), 0)}</span>
                  </div>
                  <Form.Group controlId="addressSelect" className="mb-3">
                    <Form.Label className="fw-semibold">Delivery Address</Form.Label>
                    {addressLoading ? (
                      <div className="text-muted">Loading addresses...</div>
                    ) : addresses.length === 0 ? (
                      <div className="text-danger">No addresses found. Please add one in your profile.</div>
                    ) : (
                      <Form.Select value={selectedAddress} onChange={e => setSelectedAddress(e.target.value)}>
                        {addresses.map(addr => (
                          <option key={addr.id} value={addr.id}>
                            {addr.street}, {addr.city}, {addr.state} - {addr.zipCode}
                          </option>
                        ))}
                      </Form.Select>
                    )}
                  </Form.Group>
                  <Form.Group controlId="paymentMethodSelect" className="mb-4">
                    <Form.Label className="fw-semibold">Payment Method</Form.Label>
                    <Form.Select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                      <option value="RAZORPAY">Razorpay</option>
                      <option value="PAYPAL">PayPal</option>
                      <option value="STRIPE">Stripe</option>
                      <option value="UPI">UPI</option>
                      <option value="NETBANKING">Netbanking</option>
                    </Form.Select>
                  </Form.Group>
                  <div className="d-grid">
                    <Button
                      variant="primary"
                      size="lg"
                      className="rounded-pill shadow-sm"
                      onClick={async () => {
                        await handlePlaceOrder();
                        // Refresh cart after order
                        const token = localStorage.getItem('token');
                        const updatedCart = await fetchCart(token);
                        setCart(updatedCart.items || []);
                      }}
                      disabled={placingOrder}
                      style={{ minHeight: 48, fontWeight: 600, fontSize: 18 }}
                    >
                      {placingOrder ? <BSpinner size="sm" animation="border" className="me-2" /> : null}
                      {placingOrder ? 'Placing Order...' : 'Place Order'}
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          ) : null}
        </Col>
      </Row>
    </Container>
  );
}


export default Cart;
