import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, onClick }) => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const imageUrl = product.image ? `http://localhost:8080/api/products/${product.id}/image` : 'src/assets/default-product.png';
  return (
    <div className="product-card" style={{ border: '1px solid #eee', borderRadius: 8, padding: 16, margin: 8, cursor: 'pointer', width: 220 }} onClick={onClick}>
      <img
        src={imageUrl}
        alt={product.name}
        style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 4 }}
        onError={e => { e.target.onerror = null; e.target.src = '/assets/default-product.png'; }}
      />
      <h3 style={{ margin: '12px 0 6px' }}>{product.name}</h3>
      <p style={{ color: '#888', margin: 0 }}>{product.category}</p>
  <p style={{ fontWeight: 'bold', margin: '8px 0 0' }}>₹{product.price}</p>
      {isAdmin && (
        <button style={{ marginTop: 8 }} onClick={e => { e.stopPropagation(); navigate(`/admin/products/${product.id}/edit`); }}>
          Edit
        </button>
      )}
    </div>
  );
};

export default ProductCard;
