import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { fetchProductById, fetchReviews, addReview, addToCart } from '../services/api';
import { fetchRecommendedProducts } from '../services/productApi';
import { addToWishlist } from '../services/wishlistApi';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewText, setReviewText] = useState('');
  const { isAuthenticated, isAdmin, token } = useAuth();
  const navigate = useNavigate();
  const [cartMessage, setCartMessage] = useState('');
  const [cartQty, setCartQty] = useState(1);

  // Define handleAddToWishlist inside the component
  const handleAddToWishlist = async () => {
    if (!isAuthenticated || !product) return;
    try {
      await addToWishlist(product.id, token);
      alert('Added to wishlist!');
    } catch (err) {
      alert('Failed to add to wishlist: ' + (err?.message || err));
      console.error('Wishlist error:', err);
    }
  };

  useEffect(() => {
  const handleAddToWishlist = async () => {
    if (!isAuthenticated || !product) return;
    try {
      await addToWishlist(product.id, token);
      alert('Added to wishlist!');
    } catch (err) {
      alert('Failed to add to wishlist: ' + (err?.message || err));
      console.error('Wishlist error:', err);
    }
  };
    setLoading(true);
    setError('');
    fetchProductById(id)
      .then(prod => {
        setProduct(prod);
        if (prod.reviews) {
          setReviews(prod.reviews);
        } else {
          fetchReviews(id).then(setReviews).catch(() => setReviews([]));
        }
        fetchRecommendedProducts(id)
          .then(setRecommended)
          .catch(() => setRecommended([]));
      })
      .catch(err => {
        setProduct(null);
        setReviews([]);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    try {
      const token = localStorage.getItem('token');
      await addReview(id, { text: reviewText }, token);
      setReviewText('');
      const updatedReviews = await fetchReviews(id);
      setReviews(updatedReviews);
    } catch {}
  };

  if (loading) return <Spinner />;
  if (!product) return (
    <div style={{ color: 'red', padding: 32, textAlign: 'center' }}>
      <h2>Product not found</h2>
      {error && <div style={{ margin: '12px 0' }}>{error}</div>}
      <div>
        <Link to="/" style={{ color: '#3366cc', textDecoration: 'underline' }}>Go back to Home</Link>
      </div>
    </div>
  );

  return (
    <div style={{ padding: 24 }}>
      <h2>{product.name}</h2>
      <img
        src={product.image ? `http://localhost:8080/api/products/${product.id}/image` : '/assets/default-product.png'}
        alt={product.name}
        style={{ width: 300, height: 200, objectFit: 'cover', borderRadius: 8 }}
        onError={e => { e.target.onerror = null; e.target.src = '/assets/default-product.png'; }}
      />
      <p>{product.description}</p>
  <p><strong>Price:</strong> ₹{product.price}</p>
      <p><strong>Category:</strong> {product.category}</p>
      {isAuthenticated && !isAdmin && (
        <>
          <button onClick={handleAddToWishlist} style={{ marginBottom: 16, marginRight: 12 }}>Add to Wishlist</button>
          <div style={{ marginBottom: 16 }}>
            <label>Qty: <input type="number" min="1" max={product.quantity} value={cartQty} onChange={e => setCartQty(Math.max(1, Math.min(product.quantity, Number(e.target.value))))} style={{ width: 60 }} /></label>
            <button onClick={async () => {
              try {
                await addToCart(product.id, cartQty, token);
                setCartMessage('Added to cart!');
                setTimeout(() => navigate('/cart'), 500); // Redirect to cart after short delay
              } catch (err) {
                setCartMessage('Failed to add to cart: ' + err.message);
              }
            }} style={{ marginLeft: 8 }}>Add to Cart</button>
            {cartMessage && <span style={{ marginLeft: 12, color: cartMessage.startsWith('Added') ? 'green' : 'red' }}>{cartMessage}</span>}
          </div>
        </>
      )}
      <h3>Reviews</h3>
      <ul>
        {reviews.map(r => (
          <li key={r.id}><strong>{r.user?.username || 'Anonymous'}:</strong> {r.text}</li>
        ))}
      </ul>
      {isAuthenticated && (
        <form onSubmit={handleReviewSubmit} style={{ marginTop: 16 }}>
          <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} rows={3} style={{ width: '100%', marginBottom: 8 }} placeholder="Write a review..." />
          <button type="submit">Submit Review</button>
        </form>
      )}
      <h3 style={{ marginTop: 32 }}>Recommended Products</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {recommended.map(product => (
          <ProductCard key={product.id} product={product} onClick={() => window.location.href = `/products/${product.id}`} />
        ))}
      </div>
      {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
    </div>
  );
};

export default ProductDetail;
