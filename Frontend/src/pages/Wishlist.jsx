import LogoButton from '../components/LogoButton';
import React, { useState, useEffect } from 'react';
import Spinner from '../components/Spinner';
import ProductCard from '../components/ProductCard';
import { fetchWishlist, removeFromWishlist } from '../services/wishlistApi';
import { useAuth } from '../context/AuthContext';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;
    const token = localStorage.getItem('token');
    fetchWishlist(token)
      .then(setWishlist)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  const handleRemove = async (wishlistItemId) => {
    const token = localStorage.getItem('token');
    try {
      await removeFromWishlist(wishlistItemId, token);
      const updated = await fetchWishlist(token);
      setWishlist(updated);
    } catch (err) {
      setError('Failed to remove from wishlist: ' + (err?.message || err));
    }
  };

  if (!isAuthenticated) return <div>Please login to view your wishlist.</div>;
  if (loading) return <Spinner />;

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
  <LogoButton icon="heart" text="ShopStack Wishlist" style={{ fontSize: 20, padding: '8px 24px' }} disabled />
      </div>
      <h2>Your Wishlist</h2>
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {wishlist.length === 0 ? (
          <div>Your wishlist is empty.</div>
        ) : (
          wishlist.map(item => (
            <div key={item.id} style={{ position: 'relative' }}>
              <ProductCard product={item.product} onClick={() => window.location.href = `/products/${item.product.id}`} />
              <button onClick={() => handleRemove(item.id)} style={{ position: 'absolute', top: 8, right: 8 }}>Remove</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Wishlist;
